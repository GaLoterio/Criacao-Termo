# 🧾 Gerador de Termos de Responsabilidade

O **Gerador de Termos de Responsabilidade** é uma aplicação web moderna e elegante desenvolvida para automatizar e padronizar a criação de documentos formais de entrega de equipamentos e acessórios a colaboradores e prestadores de serviço.

O sistema foi construído com **design responsivo e animado**, utilizando **HTML5, CSS3 e JavaScript puro**, com geração automática de **arquivos PDF diretamente no navegador** e **sistema de autenticação baseado em JSON**, dispensando a necessidade de softwares adicionais, servidores ou dependências externas.

---

## ✨ Novas Funcionalidades e Melhorias

### 🔐 **Sistema de Autenticação por Setores (NOVO!)**
- **Login e registro** de usuários com validação
- **Controle de acesso** baseado em setores organizacionais
- **4 setores disponíveis**: RH, TI, Financeiro e Administração
- **Banco de dados JSON** para armazenamento de usuários
- **Criptografia de senhas** com SHA-256
- **Sessões seguras** com expiração automática (24h)
- **Histórico de termos** salvo por usuário
- **Sincronização** entre dispositivos via arquivo JSON
- **Permissões personalizadas** por setor

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
- Formulário interativo com **validação em tempo real**
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
- **Font Awesome** – Ícones profissionais e consistentes
- **Google Fonts (Inter)** – Tipografia moderna e legível

### **Sistema de Autenticação**
- **JSON Database** – Arquivo `data/users.json` como banco de dados
- **SHA-256** – Criptografia de senhas
- **Local Storage** – Backup e sessões locais
- **Web Crypto API** – Criptografia nativa do navegador

### **Bibliotecas e Ferramentas**
- **jsPDF** – Geração de PDF no navegador
- **GitHub Pages** – Hospedagem estática gratuita
- **CSS Custom Properties** – Sistema de design consistente
- **Intersection Observer API** – Animações baseadas em scroll

### **Recursos Avançados**
- **CSS Grid & Flexbox** – Layouts responsivos modernos
- **CSS Animations** – Transições e efeitos visuais
- **JSON Storage** – Persistência de dados de usuários
- **Progressive Enhancement** – Funcionalidade em todos os navegadores

---

## 🚀 Como Usar

### **Primeiro Acesso**
1. **Acesse** `Pages/register.html` para criar sua conta
2. **Preencha seus dados** (nome, email, empresa)
3. **Selecione seu setor** (RH, TI, Financeiro ou Admin)
4. **Crie uma senha** segura (mínimo 6 caracteres)
5. **Confirme** e clique em "Criar Conta"

### **Login**
1. **Acesse** `index.html` (página raiz)
2. **Digite** email e senha
3. **Clique** em "Entrar"
4. O sistema reconhece automaticamente seu setor do arquivo JSON

### **Gerando Termos**
1. Após o login, você será redirecionado para `Pages/termoresponsabilidade.html`
2. **Preencha o formulário** com as informações necessárias
3. **Valide os dados** automaticamente em tempo real
4. **Clique em "Gerar PDF"** e aguarde o processamento
5. **Baixe o documento** automaticamente gerado
6. O termo será **salvo automaticamente** no seu histórico

---

### 💼 Desenvolvido por
**Gabriel Loterio**  
📧 [Contato via GitHub](https://github.com/GaLoterio)

---

## 🎉 Novidades da Versão 2.0.0

- 🔐 **Sistema de autenticação** completo com login/registro
- 🏢 **Controle por setores** (RH, TI, Financeiro, Admin)
- 📄 **Banco de dados JSON** para armazenamento de usuários
- 🔒 **Criptografia de senhas** com SHA-256
- 💾 **Histórico de termos** por usuário
- 🔄 **Sincronização** entre dispositivos via arquivo JSON
- ✨ **Design completamente renovado** com interface moderna
- 📱 **Responsividade total** para todos os dispositivos
- 🎨 **Animações e efeitos visuais** profissionais
- 🌙 **Modo escuro/claro** com alternância suave
- ⚡ **Performance otimizada** e carregamento rápido
- 🔧 **Validação inteligente** com feedback visual
- 🎯 **Experiência do usuário** significativamente melhorada

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
