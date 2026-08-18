# 🧾 Gerador de Termos de Responsabilidade

O **Gerador de Termos de Responsabilidade** é uma aplicação web moderna para automatizar a criação de documentos de entrega de equipamentos.

O sistema foi construído com **HTML5, CSS3 e JavaScript puro**, integrado ao **Supabase** para autenticação e funções de backend, e utiliza a **Clicksign** para assinaturas eletrônicas.

---

## ✨ Novas Funcionalidades e Melhorias

### 🔐 **Sistema de Autenticação com Supabase**
- **Login e registro** de usuários com confirmação por e-mail.
- **Recuperação de senha** segura integrada via e-mail (`reset-password.html`).
- **Perfis de usuário** com armazenamento de nome e setor.
- **Integração com Clicksign** via Edge Function segura, protegendo o token de acesso.
- **Controle de acesso** que exige que o usuário esteja logado para usar as funcionalidades.
- **Painel Administrativo (`admin.html`)**: Permite que administradores gerenciem a lista de e-mails autorizados (allowlist), promovam ou rebaixem usuários e revoguem acessos.

### 🎨 **Design Moderno e Responsivo**
- **Layout responsivo** otimizado para desktop, tablet e mobile
- **Gradientes animados** e efeitos visuais modernos
- **Tipografia profissional** com fonte Inter para melhor legibilidade
- **Animações suaves** e transições elegantes
- **Modo escuro/claro** com alternância automática
- **Efeitos de partículas** no fundo para maior apelo visual

### 🚀 **Experiência do Usuário Aprimorada**
- **Validação em tempo real** dos campos obrigatórios
- **Feedback visual** com animações de erro e sucesso
- **Estados de loading** durante a geração do PDF
- **Ícones intuitivos** para cada campo do formulário
- **Animações de entrada** sequenciais dos elementos
- **Efeitos hover** e interações fluidas
- **Informações do usuário** no header
- **Botão de logout** integrado
- **Máscaras e Validações Dinâmicas**: CPF e CNPJ validados em tempo real no front-end por algoritmos matemáticos oficiais da Receita Federal.

### 📱 **Responsividade Total**
- **Mobile-first design** com breakpoints otimizados
- **Touch-friendly** para dispositivos móveis
- **Layout adaptativo** que se ajusta a qualquer tela
- **Performance otimizada** para todos os dispositivos

---

## 🎯 Objetivo

Padronizar e simplificar o processo de emissão dos **Termos de Responsabilidade e Recibo de Entrega de Equipamentos e Acessórios**, garantindo:

- ✅ **Conformidade jurídica** com a CLT (para pessoas físicas) e com o Código Civil (para pessoas jurídicas)
- ✅ **Rastreabilidade e controle** sobre os equipamentos corporativos entregues
- ✅ **Redução de erros manuais** e tempo gasto na criação de documentos
- ✅ **Facilidade de uso** por qualquer colaborador da empresa, sem necessidade de instalação ou acesso técnico
- ✅ **Experiência visual moderna** e profissional

---

## ⚙️ Principais Funcionalidades

### 📋 **Formulário Inteligente**
- Formulário interativo com **validação em tempo real (CPF/CNPJ)**
- **Detecção automática** de CPF ou CNPJ, selecionando o modelo jurídico correto
- **Campo dinâmico** de Razão Social, exibido apenas para casos de CNPJ
- **Ícones visuais** para cada campo, melhorando a usabilidade
- **Placeholders informativos** com exemplos práticos

### 📄 **Geração de Documentos**
- **Geração automática** de data e cidade, refletindo o dia atual
- **Formatação jurídica oficial** com espaçamento e linguagem formal
- **Cláusulas padronizadas** conforme modelos internos da empresa
- **Criação instantânea de PDF** pronto para download e assinatura
- **Nomenclatura automática** dos arquivos baseada no tipo de documento

### 🔒 **Segurança e Privacidade**
- **Execução 100% local** no navegador
- **Sem envio de dados** para servidores externos
- **Garantia de confidencialidade** total dos dados
- **Compatibilidade total** com navegadores modernos

### 🎨 **Interface Moderna**
- **Design responsivo** com gradientes animados
- **Modo escuro/claro** com persistência de preferência
- **Animações fluidas** e transições suaves
- **Feedback visual** para todas as interações
- **Loading states** e mensagens de status

---

## 🌐 Infraestrutura e Hospedagem

O sistema foi publicado utilizando o **GitHub Pages**, permitindo:

- ✅ **Acesso rápido e gratuito** via URL pública
- ✅ **Atualizações simples** via GitHub (sem infraestrutura de backend)
- ✅ **Compartilhamento fácil** com o time ou departamentos internos
- ✅ **CDN global** para carregamento rápido em qualquer localização

---

## 🧩 Tecnologias Utilizadas

### **Frontend**
- **HTML5** – Estrutura semântica e acessível
- **CSS3** – Estilização moderna com Flexbox/Grid, animações e gradientes
- **JavaScript ES6+** – Lógica interativa, geração de PDF e autenticação

### **Backend e Infraestrutura**
- **Supabase Auth** – Para gerenciamento de usuários e autenticação.
- **Supabase Edge Functions** – Para lógica de backend segura (integração com Clicksign).
- **Clicksign API** – Para o fluxo de assinatura eletrônica.

### **Bibliotecas e Ferramentas**
- **jsPDF** – Geração de PDF no navegador
- **GitHub Pages** – Hospedagem estática gratuita
- **CSS Custom Properties** – Sistema de design consistente
- **Intersection Observer API** – Animações baseadas em scroll

---

## 🚀 Como Usar

### **Primeiro Acesso**
1. **Acesse** `Pages/register.html` para criar sua conta
2. **Preencha** seu nome completo, e-mail e selecione seu setor.
3. **Crie uma senha** segura (mínimo 6 caracteres)
4. **Clique em "Criar Conta"** e verifique seu e-mail para confirmar o cadastro (caso configurado).
   > *Nota: O cadastro só será permitido para e-mails terminados em `@omeletecompany.com` e que estejam previamente cadastrados na lista de e-mails autorizados (allowlist).*

### **Painel do Administrador**
1. Acesse `Pages/admin.html`.
2. Administradores podem adicionar novos e-mails na allowlist, visualizar quem já se registrou, promover usuários para administradores e deletar contas de acesso do Supabase de maneira integrada.
3. Qualquer alteração ou listagem é protegida no servidor utilizando Edge Functions, garantindo que nenhum usuário comum consiga alterar dados ou obter privilégios indevidos.

### **Login**
1. **Acesse** `index.html` (página raiz)
2. **Digite** email e senha
3. **Clique** em "Entrar"

### **Recuperação de Senha**
1. Na tela de login, clique em "Esqueci minha senha".
2. Insira seu e-mail para receber um link de redefinição de senha.
3. Ao clicar no link enviado por e-mail, você será redirecionado para `Pages/reset-password.html` onde definirá uma nova senha com total segurança.

### **Gerando Termos**
1. Após o login, você será redirecionado para `Pages/termoresponsabilidade.html`
2. **Preencha o formulário** com as informações necessárias
3. **Clique em "Gerar PDF e Enviar para Assinatura"**.
4. O documento será gerado, baixado localmente e enviado para o e-mail do signatário via Clicksign.

---

### 💼 Desenvolvido por
**Gabriel Loterio**  
📧 [Contato via GitHub](https://github.com/GaLoterio)

## 📁 Estrutura do Projeto

```
projeto/
├── data/
│   └── users.json          # Banco de dados JSON dos usuários
├── js/
│   └── json-auth.js        # Sistema de autenticação JSON
├── images/
│   ├── imgFundo.jpeg
│   └── logoOMLT.jpeg
├── Pages/
│   ├── termoresponsabilidade.html  # Gerador de termos (protegido)
│   └── register.html       # Página de registro
├── index.html              # Página de login (raiz)
└── README.md
```
