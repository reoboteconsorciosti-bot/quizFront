# Build version: 1.1.6 - SPA Build (SSR Disabled)
FROM node:20-slim AS build

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia o código e faz o build (com SSR desativado no vite.config.ts)
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

# Copiamos a pasta dist/client. Com SSR desativado, o Vite gera o index.html aqui.
COPY --from=build /app/dist/client ./dist/client

# Expomos a porta 3000
EXPOSE 3000

# O comando 'serve' não faz checagem de host, eliminando o erro "Blocked request"
CMD ["serve", "-s", "dist/client", "-l", "3000"]
