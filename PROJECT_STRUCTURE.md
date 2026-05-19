# Mapa da Conquista - Estrutura do Projeto

Este documento serve como referência para a estrutura e tecnologias utilizadas no projeto **Mapa da Conquista**, evitando alucinações e garantindo consistência no desenvolvimento.

## 🚀 Arquitetura

O projeto utiliza uma arquitetura **Fullstack Independente**:
- **Frontend**: Aplicação React com Vite e TanStack Start (SSR).
- **Backend**: Servidor Express.js dedicado para processamento de Webhooks e integração com BotConversa.

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (React + TanStack Router).
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/).
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/).
- **Animações**: [Framer Motion](https://www.framer.com/motion/) e [Canvas Confetti](https://github.com/catdad/canvas-confetti).
- **Ícones**: [Lucide React](https://lucide.dev/).
- **Gerenciamento de Estado**: React Hooks e TanStack Query.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/).
- **Framework**: [Express.js](https://expressjs.com/).
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/).
- **Integração**: [Axios](https://axios-http.com/) para chamadas ao BotConversa.

## 📂 Estrutura de Diretórios

```text
/
├── backend/                  # Servidor Express
│   ├── src/
│   │   ├── controllers/      # Lógica de processamento dos webhooks
│   │   ├── services/         # Integração com serviços externos (BotConversa)
│   │   ├── types/            # Definições de tipos TypeScript
│   │   └── index.ts          # Ponto de entrada do servidor (Porta 3001)
│   └── .env                  # Variáveis de ambiente (BOTCONVERSA_WEBHOOK_URL)
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── assets/           # Imagens dos avatares dos perfis
│   │   ├── components/
│   │   │   ├── quiz/         # Lógica principal do Quiz (App, Particles, Data)
│   │   │   └── ui/           # Componentes base do Shadcn/UI
│   │   ├── routes/           # Definição de rotas do TanStack Router
│   │   ├── styles.css        # Estilos globais e variáveis de tema
│   │   └── ...
│   └── PROJECT_STRUCTURE.md  # Este documento
```

## 📡 Fluxo de Webhooks

O projeto utiliza um gatilho duplo para capturar leads no BotConversa:

1.  **Gatilho Inicial**: Disparado quando o usuário clica em "COMEÇAR" no formulário de lead.
    - **Tag**: `quiz_iniciado`
    - **Dados**: `nome`, `telefone`, `consultor`.
2.  **Gatilho Final**: Disparado ao concluir o quiz, na tela de revelação.
    - **Tag**: `quiz`
    - **Dados**: `nome`, `telefone`, `consultor`, `perfil`.

## 📝 Perfis e Consultores

### Perfis (ProfileKey)
- `acelerador`: Foco em ação e conquista rápida.
- `estrategico`: Foco em análise e decisões conscientes.
- `conservador`: Foco em construção sólida de patrimônio.
- `visionario`: Foco em visão de futuro e longo prazo.
- `patrimonial`: Foco em estabilidade e segurança.

### Consultores
EDUARDO, ISABELI, JESSICA, JONAS, KAREN, KASSIO, LUCAS ROQUES, MURILO, RAPHAEL.

## 🚀 Como Rodar

1.  **Backend**: `cd backend && npm install && npm run dev` (Roda na porta 3001).
2.  **Frontend**: `cd frontend && npm install && npm run dev` (Roda na porta 5173).
