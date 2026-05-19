# Build version: 1.0.9 - Final Port 3000 Fix
FROM node:20-slim AS build

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia o código e faz o build
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

# Copiamos apenas o necessário para servir o cliente
COPY --from=build /app/dist/client ./dist/client

# Expomos a porta 3000
EXPOSE 3000

# Comando para rodar o serve na porta 3000, apontando para a pasta client e aceitando conexões externas
CMD ["serve", "-s", "dist/client", "-l", "3000"]
