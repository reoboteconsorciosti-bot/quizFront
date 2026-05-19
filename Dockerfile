# Build version: 1.0.8 - Final Frontend Folder Context
FROM node:20-slim AS build

WORKDIR /app

# Como o Easypanel está entrando na pasta /frontend, 
# os arquivos já estão na raiz do contexto de build.
# NÃO use "frontend/" nos caminhos de COPY.
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

# Copiar a pasta dist/client gerada pelo TanStack Start
COPY --from=build /app/dist/client ./dist/client

# Expor a porta 3000
EXPOSE 3000

# Rodar o serve apontando para a pasta client
CMD ["serve", "-s", "dist/client", "-l", "3000"]
