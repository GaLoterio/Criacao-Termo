# Deploy da Edge Function `clicksign-proxy`

Seu projeto Supabase (pelo `SUPABASE_URL` já usado no `supabase-auth.js`) tem a ref:

```
qoqtnwobjfmpmsealfbs
```

## 1. Instalar a Supabase CLI (uma vez só, na sua máquina)

```bash
npm install -g supabase
```

## 2. Login e link com o projeto

```bash
supabase login
supabase link --project-ref qoqtnwobjfmpmsealfbs
```

(Rode esse comando dentro da pasta raiz do projeto, onde está a pasta `supabase/`.)

## 3. Configurar as secrets (o token da Clicksign NUNCA vai pro GitHub)

```bash
supabase secrets set CLICKSIGN_ACCESS_TOKEN=seu_token_da_clicksign_aqui
```

Se quiser restringir quem pode chamar a função (recomendado, já que o repositório é público):

```bash
supabase secrets set ALLOWED_ORIGIN=https://galoterio.github.io
```

(Troque pela URL real onde o GitHub Pages está publicando o site. Se não tiver certeza, deixe sem configurar por enquanto — o padrão é `*`, e dá pra restringir depois.)

Se for testar em sandbox da Clicksign antes de ir pra produção:

```bash
supabase secrets set CLICKSIGN_BASE_URL=https://sandbox.clicksign.com/api/v1
```

## 4. Deploy da função

```bash
supabase functions deploy clicksign-proxy
```

Depois disso, a função fica disponível em:

```
https://qoqtnwobjfmpmsealfbs.supabase.co/functions/v1/clicksign-proxy
```

(Essa é exatamente a URL que o `termoresponsabilidade.html` já está configurado para chamar, então não precisa editar nada no front depois do deploy.)

## 5. Testando

Depois do deploy, gere um termo pelo site normalmente. Se dar erro, o Supabase te deixa ver os logs da função com:

```bash
supabase functions logs clicksign-proxy
```

## O que mudou de segurança

- O token da Clicksign fica só nas *secrets* do Supabase — nunca é commitado, nunca aparece no navegador, nunca aparece no GitHub.
- A função exige que quem chamar esteja logado no site (mesma sessão do Supabase Auth que vocês já usam) — sem login válido, a função recusa a chamada com erro 401.
- Se quiser ir além, dá pra restringir por setor (ex: só "TI" consegue enviar), bastando checar isso dentro da função — mas isso depende de vocês terem uma tabela de perfis vinculando usuário → setor no Supabase (hoje o setor "TI" está fixo/hardcoded no HTML, então essa parte ainda não está realmente ligada ao banco).
