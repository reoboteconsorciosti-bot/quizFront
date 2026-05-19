# Build version: 1.1.1 - TanStack Start Node SSR
FROM node:20 AS build

WORKDIR /app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia tudo e faz o build
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app

# Variáveis para o TanStack Start rodar em produção
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copiamos o build e as dependências necessárias
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Expomos a porta 3000
EXPOSE 3000

# O TanStack Start gera um servidor Node em .output ou dist/server
# O comando padrão para rodar o servidor compilado do TanStack Start
CMD ["node", "dist/server/index.js"]
