# Build version: 1.1.0 - Vite Preview Official
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

# Copiamos TUDO para garantir que o Vite Preview tenha o contexto necessário
COPY --from=build /app ./

# Expomos a porta 3000
EXPOSE 3000

# O comando 'vite preview' vai servir a pasta dist corretamente
# O --host garante que o Easypanel consiga acessar o container
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]