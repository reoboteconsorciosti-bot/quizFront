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

# Copiar apenas a pasta dist do estágio anterior
COPY --from=build /app/dist ./dist

# Expor a porta 3000 (padrão do serve)
EXPOSE 3000

# Comando para rodar o serve na porta 3000, apontando para a pasta dist e tratando SPAs (-s)
CMD ["serve", "-s", "dist", "-l", "3000"]
