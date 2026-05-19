# Build version: 1.2.0 - Standard Vite SPA
FROM node:20-slim AS build

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia o código e faz o build (SPA padrão)
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app
RUN npm install -g serve

# Copiamos a pasta dist (Vite SPA gera aqui)
COPY --from=build /app/dist ./dist

# Expomos a porta 3000
EXPOSE 3000

# O comando 'serve' entrega o index.html da pasta dist
CMD ["serve", "-s", "dist", "-l", "3000"]
