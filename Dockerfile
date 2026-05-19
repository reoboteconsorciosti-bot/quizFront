# Build version: 1.1.2 - TanStack Start Vite Preview (Docker/Easypanel)
FROM node:20-slim AS build

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

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copiamos o build e as dependências necessárias
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

# Importante: o log "Accepting connections at http://localhost:3000" pode indicar bind em localhost.
# Forçamos bind em 0.0.0.0 via --host para o Easypanel alcançar o container.
CMD ["sh", "-c", "./node_modules/.bin/vite preview --host 0.0.0.0 --port ${PORT}"]
