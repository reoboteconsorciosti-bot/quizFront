# Build version: 1.0.6 - Switching from Nginx to Node Serve
FROM node:20-slim AS build

WORKDIR /app

# Copiar arquivos de dependencia
COPY package*.json ./
RUN npm install

# Copiar o restante do codigo e fazer o build
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app

# Instalar o pacote 'serve' globalmente para servir arquivos estáticos
RUN npm install -g serve

# Copiar apenas a pasta dist do estágio anterior
COPY --from=build /app/dist ./dist

# Expor a porta 3000 (padrão do serve)
EXPOSE 3000

# Comando para rodar o serve na porta 3000, apontando para a pasta dist e tratando SPAs (-s)
CMD ["serve", "-s", "dist", "-l", "3000"]
