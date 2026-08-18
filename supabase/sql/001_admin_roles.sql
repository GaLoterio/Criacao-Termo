-- ============================================================
-- Painel de Admin: papéis de usuário (roles) e visão consolidada
-- Execute este script no SQL Editor do seu projeto Supabase
-- (Project: qoqtnwobjfmpmsealfbs)
-- ============================================================

-- 1) Tabela de allowlist (mantém compatível com o que já existe)
create table if not exists public.allowed_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.allowed_emails enable row level security;

-- O frontend público (chave anon) precisa poder LER a allowlist
-- para o login/registro funcionar (isAllowedEmail em supabase-auth.js).
drop policy if exists "allowed_emails_select_all" on public.allowed_emails;
create policy "allowed_emails_select_all"
  on public.allowed_emails
  for select
  using (true);

-- Propositalmente NÃO criamos policies de insert/update/delete aqui.
-- Alterar a allowlist só pode acontecer via Edge Function, usando a
-- Service Role Key (que ignora RLS). Isso é o que impede qualquer
-- usuário comum de se auto-adicionar à allowlist pelo navegador.

-- 2) Tabela de perfis, com o papel (role) de cada usuário autenticado
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  sector text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada usuário pode ver o próprio perfil (necessário para o frontend
-- saber se deve exibir o link/página do painel de admin).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Nenhuma policy de insert/update/delete para authenticated/anon:
-- só a Edge Function (Service Role) pode promover/rebaixar um usuário.
-- Isso é o que garante que ninguém vira admin editando o próprio JWT
-- ou chamando a API do Supabase diretamente pelo navegador.

-- 3) Trigger: cria automaticamente uma linha em profiles quando
--    um novo usuário se cadastra (signUp) no Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, sector)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'sector'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4) View usada pela Edge Function no GET: junta allowlist + perfil
--    (mostra e-mail, status, papel e data de criação, como pedido)
create or replace view public.admin_user_overview as
select
  ae.email,
  ae.created_at as allowed_at,
  p.id as user_id,
  p.role,
  p.full_name,
  p.sector,
  case when p.id is not null then 'registrado' else 'pendente' end as status
from public.allowed_emails ae
left join public.profiles p on p.email = ae.email
order by ae.created_at desc;

-- 5) IMPORTANTE: defina manualmente o(s) primeiro(s) admin(s).
--    Troque o e-mail abaixo pelo seu e rode depois que você já tiver
--    feito o cadastro (signUp) normal no sistema pelo menos uma vez:
--
-- update public.profiles set role = 'admin' where email = 'seu.email@omeletecompany.com';
