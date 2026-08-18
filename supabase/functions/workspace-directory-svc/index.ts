// ============================================================
// Edge Function: workspace-directory-svc
// ------------------------------------------------------------
// Endpoint seguro para administração de usuários (allowlist +
// papéis). O nome da rota é propositalmente genérico ("directory
// service") só como camada extra de ofuscação — a defesa real é
// a checagem de role feita em cada requisição (ver validateAdmin).
//
// Segurança:
// 1. Valida o JWT de sessão do Supabase em toda chamada.
// 2. Consulta no banco (tabela profiles) se o usuário autenticado
//    tem role = 'admin'. Nunca confia em um campo enviado pelo
//    próprio frontend.
// 3. Rejeita com 403 qualquer chamada de não-admin, mesmo com JWT válido.
// 4. Usa a Service Role Key (Secrets) só aqui dentro, no servidor,
//    para as operações privilegiadas. Ela nunca é exposta ao frontend.
// ============================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";
const ALLOWED_DOMAIN = "@omeletecompany.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// --- Guarda de segurança: valida sessão + role de admin no banco ---
async function validateAdmin(
  req: Request,
): Promise<{ error: Response | null; serviceClient: SupabaseClient }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { error: jsonResponse({ error: "Não autenticado." }, 401), serviceClient: null! };
  }

  // Cliente "de sessão": usa o JWT do usuário para descobrir quem ele é.
  const sessionClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await sessionClient.auth.getUser();
  if (userError || !user) {
    return { error: jsonResponse({ error: "Sessão inválida ou expirada." }, 401), serviceClient: null! };
  }

  // Cliente com Service Role: usado só a partir daqui, dentro do servidor.
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    return {
      error: jsonResponse({ error: "Acesso negado. Requer privilégios de administrador." }, 403),
      serviceClient: null!,
    };
  }

  return { error: null, serviceClient };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { error, serviceClient } = await validateAdmin(req);
  if (error) return error;
  // A partir daqui, garantidamente um admin autenticado.

  try {
    switch (req.method) {
      case "GET": { // Listar usuários (email, status, role, data)
        const { data, error } = await serviceClient
          .from("admin_user_overview")
          .select("*");
        if (error) throw error;
        return jsonResponse(data);
      }

      case "POST": { // Adicionar e-mail à allowlist
        const { email } = await req.json();
        if (!email || typeof email !== "string" || !email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
          return jsonResponse(
            { error: `E-mail inválido ou não pertence ao domínio ${ALLOWED_DOMAIN}.` },
            400,
          );
        }
        const { data, error } = await serviceClient
          .from("allowed_emails")
          .insert({ email: email.toLowerCase() })
          .select();
        if (error) throw error;
        return jsonResponse(data, 201);
      }

      case "DELETE": { // Remover e-mail (revogar acesso)
        const { email } = await req.json();
        if (!email) {
          return jsonResponse({ error: "O campo 'email' é obrigatório." }, 400);
        }

        const { error: deleteAllowedError } = await serviceClient
          .from("allowed_emails")
          .delete()
          .eq("email", email);
        if (deleteAllowedError) throw deleteAllowedError;

        // Também remove o usuário do sistema de autenticação, se existir.
        const { data: listData, error: listError } = await serviceClient.auth.admin.listUsers();
        if (listError) throw listError;

        const targetUser = listData?.users?.find((u) => u.email === email);
        if (targetUser) {
          const { error: deleteUserError } = await serviceClient.auth.admin.deleteUser(targetUser.id);
          if (deleteUserError) throw deleteUserError;
        }

        return jsonResponse({ message: `Acesso para ${email} revogado com sucesso.` });
      }

      case "PATCH": { // Promover/rebaixar (alterar role)
        const { user_id, new_role } = await req.json();
        if (!user_id || !["user", "admin"].includes(new_role)) {
          return jsonResponse(
            { error: "Campos 'user_id' e 'new_role' ('user' ou 'admin') são obrigatórios." },
            400,
          );
        }

        const { data, error } = await serviceClient
          .from("profiles")
          .update({ role: new_role, updated_at: new Date().toISOString() })
          .eq("id", user_id)
          .select();

        if (error) throw error;
        return jsonResponse(data && data.length > 0 ? data[0] : { message: "Papel atualizado com sucesso." });
      }

      default:
        return jsonResponse({ error: "Método não permitido." }, 405);
    }
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "Erro interno do servidor.";
    return jsonResponse({ error: message }, 500);
  }
});
