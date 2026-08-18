// ===============================
// Supabase Auth - Criação de Termo (versão final com persistência)
// ===============================

const SUPABASE_URL = 'https://qoqtnwobjfmpmsealfbs.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcXRud29iamZtcG1zZWFsZmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzUzNTAsImV4cCI6MjA3NzE1MTM1MH0.3gW_CC5dcm-hPl6VkL1gAN_zLY9qGPTMHKseM9SYnx4';

let supabase;

// -------------------------------
// 🚀 Inicialização imediata com persistência de sessão
// -------------------------------
if (window.supabase && window.supabase.createClient) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,       // Mantém o usuário logado entre reloads
      autoRefreshToken: true,     // Atualiza o token automaticamente
      detectSessionInUrl: true    // Suporte a login via link mágico
    }
  });
  console.log('✅ Cliente Supabase inicializado com sucesso.');
} else {
  console.error('❌ Supabase ainda não foi carregado. Verifique a tag <script> da biblioteca.');
}

// -------------------------------
// 🔍 Verifica se o e-mail é permitido
// -------------------------------
async function isAllowedEmail(email) {
  if (!email.endsWith('@omeletecompany.com')) {
    console.warn('Domínio inválido:', email);
    return false;
  }

  const { data, error } = await supabase
    .from('allowed_emails')
    .select('email')
    .eq('email', email)
    .limit(1);

  if (error) {
    console.error('Erro ao consultar allowed_emails:', error);
    return false;
  }

  return data && data.length === 1;
}

// -------------------------------
// 🧾 Registro com e-mail e senha
// -------------------------------
async function signUpWithEmail(email, password, options = {}) {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  if (!email.endsWith('@omeletecompany.com')) {
    throw new Error('Somente e-mails @omeletecompany.com são permitidos.');
  }

  const permitido = await isAllowedEmail(email);
  if (!permitido) {
    throw new Error('E-mail não autorizado. Contate o administrador.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: options.fullName,
        sector: options.sector,
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

// -------------------------------
// ✉️ Login com e-mail e senha
// -------------------------------
async function signInWithEmail(email, password) {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  if (!email.endsWith('@omeletecompany.com')) {
    throw new Error('Somente e-mails @omeletecompany.com são permitidos.');
  }

  const permitido = await isAllowedEmail(email);
  if (!permitido) {
    throw new Error('E-mail não autorizado. Contate o administrador.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error.message);
  return data;
}

// -------------------------------
// 🔗 Login via link mágico (sem senha)
// -------------------------------
async function sendMagicLink(email) {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  if (!email.endsWith('@omeletecompany.com')) {
    throw new Error('Somente e-mails @omeletecompany.com são permitidos.');
  }

  const permitido = await isAllowedEmail(email);
  if (!permitido) {
    throw new Error('E-mail não autorizado. Contate o administrador.');
  }

  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw new Error(error.message);
  return true;
}

// -------------------------------
// 🔐 Enviar e-mail de recuperação de senha
// -------------------------------
async function sendPasswordResetEmail(email) {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  if (!email.endsWith('@omeletecompany.com')) {
    throw new Error('Somente e-mails @omeletecompany.com são permitidos.');
  }

  const permitido = await isAllowedEmail(email);
  if (!permitido) {
    throw new Error('E-mail não autorizado. Contate o administrador.');
  }

  const redirectBase = window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'http://localhost';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${redirectBase}/Pages/reset-password.html`
  });

  if (error) throw new Error(error.message);
  return true;
}

// -------------------------------
// 🧍 Obter usuário logado (com sessão persistente)
// -------------------------------
async function currentUser() {
  if (!supabase) {
    console.warn('Supabase ainda não foi inicializado.');
    return null;
  }

  // Tenta recuperar sessão persistida
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('Erro ao recuperar sessão:', sessionError);
  }

  if (!session) {
    console.warn('ℹ️ Nenhum usuário logado no momento.');
    return null;
  }

  // Obtém dados completos do usuário
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (error.message.includes('Auth session missing')) {
      console.warn('ℹ️ Sessão expirada ou inexistente.');
      return null;
    }
    console.error('❌ Erro ao obter usuário atual:', error);
    return null;
  }

  return data?.user ?? null;
}

// -------------------------------
// 🔑 Obter o access_token da sessão atual
// (usado para autenticar chamadas às Edge Functions)
// -------------------------------
async function getAccessToken() {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao recuperar sessão:', error);
    return null;
  }
  return session ? session.access_token : null;
}

// -------------------------------
// � Obter sessão atual
// -------------------------------
async function getSession() {
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Erro ao recuperar sessão:', error);
    return null;
  }
  return session;
}

// -------------------------------
// 🔐 Atualizar senha do usuário autenticado
// -------------------------------
async function updatePassword(newPassword) {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  if (!newPassword || newPassword.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres.');
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw new Error(error.message);
  return data;
}

// -------------------------------
// �🚪 Logout
// -------------------------------
async function signOut() {
  if (!supabase) throw new Error('Supabase ainda não foi inicializado.');
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Erro ao sair:', error);
  else console.log('👋 Usuário desconectado com sucesso.');
}

// -------------------------------
// 🌐 Exporta as funções globalmente
// -------------------------------
window.authSupabase = {
  signUpWithEmail,
  signInWithEmail,
  sendMagicLink,
  sendPasswordResetEmail,
  currentUser,
  getAccessToken,
  getSession,
  updatePassword,
  signOut
};

// CORREÇÃO: Expõe a URL base do Supabase globalmente de forma explícita,
// garantindo que outros scripts (incluindo módulos) possam acessá-la
// de forma segura através de `window.SUPABASE_URL`.
window.SUPABASE_URL = SUPABASE_URL;
