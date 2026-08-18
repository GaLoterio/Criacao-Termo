// ============================================================
// Edge Function: clicksign-proxy
// ------------------------------------------------------------
// Recebe do front-end os dados do formulário (PDF em base64,
// e-mail do signatário, "assinar como" e mensagem) e faz, do lado
// do SERVIDOR, as 4 chamadas para a API da Clicksign:
//   1. POST /documents
//   2. POST /signers
//   3. POST /lists
//   4. POST /notifications
//
// O access_token da Clicksign NUNCA fica no front-end: ele vive
// só aqui, como uma secret do projeto Supabase.
//
// Segurança: só aceita a chamada se vier acompanhada do token de
// sessão de um usuário autenticado no Supabase (Authorization: Bearer <jwt>).
// ============================================================

import { createClient } from "@supabase/supabase-js";

// Troque para a URL de sandbox se estiver testando:
// "https://sandbox.clicksign.com/api/v1"
const CLICKSIGN_BASE_URL = Deno.env.get("CLICKSIGN_BASE_URL") ?? "https://app.clicksign.com/api/v1";
const CLICKSIGN_ACCESS_TOKEN = Deno.env.get("CLICKSIGN_ACCESS_TOKEN");

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Domínios autorizados a chamar esta função (ajuste para o seu domínio do GitHub Pages)
// Ex: "https://galoterio.github.io"
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function clicksignFetch(path: string, body: unknown) {
  const url = `${CLICKSIGN_BASE_URL}${path}?access_token=${CLICKSIGN_ACCESS_TOKEN}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detalhe = data ? JSON.stringify(data) : `HTTP ${response.status}`;
    throw new Error(`Falha em ${path}: ${detalhe}`);
  }

  return data;
}

Deno.serve(async (req) => {
  // Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido." }, 405);
  }

  if (!CLICKSIGN_ACCESS_TOKEN) {
    return jsonResponse({ error: "CLICKSIGN_ACCESS_TOKEN não configurado nas secrets do projeto." }, 500);
  }

  // --- Autenticação: exige um usuário logado no Supabase ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Não autenticado. Faça login e tente novamente." }, 401);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return jsonResponse({ error: "Sessão inválida ou expirada. Faça login novamente." }, 401);
  }

  // (Opcional) Aqui você pode checar o setor/permissão do usuário antes de continuar,
  // caso tenha uma tabela de perfis vinculada ao usuário no Supabase.

  // --- Validação do corpo da requisição ---
  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Corpo da requisição inválido (esperado JSON)." }, 400);
  }

  const { pdfBase64DataUri, nomeArquivo, email, nomeSignatario, signAs, mensagem } = payload ?? {};

  if (!pdfBase64DataUri || !nomeArquivo || !email || !nomeSignatario || !signAs) {
    return jsonResponse({ error: "Campos obrigatórios ausentes (pdfBase64DataUri, nomeArquivo, email, nomeSignatario, signAs)." }, 400);
  }

  try {
    // Passo 1: Criar o documento
    const documentData = await clicksignFetch("/documents", {
      document: {
        path: `/Termos de Responsabilidade/${nomeArquivo}`,
        content_base64: pdfBase64DataUri,
        auto_close: true,
      },
    });
    const documentKey = documentData.document.key;

    // Passo 2: Cadastrar o signatário
    const signerData = await clicksignFetch("/signers", {
      signer: {
        email,
        name: nomeSignatario,
        auths: ["email"],
      },
    });
    const signerKey = signerData.signer.key;

    // Passo 3: Vincular o signatário ao documento
    const listData = await clicksignFetch("/lists", {
      list: {
        document_key: documentKey,
        signer_key: signerKey,
        sign_as: signAs,
        message: mensagem,
      },
    });
    const requestSignatureKey = listData.list.request_signature_key;

    // Passo 4: Disparar o e-mail com a mensagem personalizada
    await clicksignFetch("/notifications", {
      request_signature_key: requestSignatureKey,
      message: mensagem,
    });

    return jsonResponse({ success: true, documentKey, signerKey, requestSignatureKey });
  } catch (erro) {
    console.error(erro);
    return jsonResponse({ error: erro instanceof Error ? erro.message : "Erro desconhecido ao falar com a Clicksign." }, 502);
  }
});
