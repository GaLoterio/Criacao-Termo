# Deploy da Edge Function `workspace-directory-svc`

## 1. Rodar o SQL de setup (uma vez só)

Abra o **SQL Editor** do seu projeto Supabase (qoqtnwobjfmpmsealfbs) e execute
o conteúdo de `supabase/sql/001_admin_roles.sql`. Ele cria/ajusta:

- `public.allowed_emails` (allowlist, com RLS de leitura pública)
- `public.profiles` (role de cada usuário, com RLS restrito ao próprio)
- Trigger que cria o perfil automaticamente no cadastro
- View `public.admin_user_overview` (o que o painel de admin lista)

No final do script, defina manualmente o primeiro admin (troque o e-mail):

```sql
update public.profiles set role = 'admin' where email = 'seu.email@omeletecompany.com';
```

## 2. Login e link do projeto

```bash
npm install -g supabase
supabase login
supabase link --project-ref qoqtnwobjfmpmsealfbs
```

## 3. Configurar a secret da Service Role

`Project Settings > API`, copie a chave `service_role` e configure:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_SERVICE_ROLE_AQUI
```

(As secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` já existem automaticamente
em todo projeto Supabase — não precisa configurá-las.)

## 4. Deploy

```bash
supabase functions deploy workspace-directory-svc
```

## 5. Testar rapidamente (opcional)

```bash
curl -X GET "https://qoqtnwobjfmpmsealfbs.supabase.co/functions/v1/workspace-directory-svc" \
  -H "Authorization: Bearer SEU_TOKEN_DE_SESSAO"
```

Se o seu usuário não for admin, deve retornar `403`. Se for, retorna a lista
da allowlist com status/role/data.
