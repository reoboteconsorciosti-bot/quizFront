# Build version: 1.0.7 - Root Dockerfile switching to Node Serve
FROM node:20-slim AS build

WORKDIR /app

# Copiar arquivos do frontend para o build
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

# Copiar a dist gerada
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Rodar o serve
CMD ["serve", "-s", "dist", "-l", "3000"]
