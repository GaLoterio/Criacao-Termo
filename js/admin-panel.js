// ===============================
// Painel de Admin - chamadas para a Edge Function workspace-directory-svc
// A Edge Function é quem de fato valida se o usuário é admin (via tabela
// profiles, com a Service Role Key). Este arquivo só monta as requisições.
// ===============================

const FUNCTIONS_URL = `${window.SUPABASE_URL}/functions/v1/workspace-directory-svc`;

async function authFetch(method, body) {
  const token = await window.authSupabase.getAccessToken();
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');

  const response = await fetch(FUNCTIONS_URL, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data && data.error) || `Erro HTTP ${response.status}`);
  }
  return data;
}

// GET — listar usuários da allowlist (email, status, role, data)
async function listUsers() {
  return authFetch('GET');
}

// POST — adicionar e-mail à allowlist
async function addUser(email) {
  return authFetch('POST', { email });
}

// DELETE — revogar acesso de um e-mail
async function removeUser(email) {
  return authFetch('DELETE', { email });
}

// PATCH — promover/rebaixar (mudar role)
async function updateUserRole(userId, newRole) {
  return authFetch('PATCH', { user_id: userId, new_role: newRole });
}

window.adminPanel = { listUsers, addUser, removeUser, updateUserRole };
