# Build version: 1.1.5 - Pure Node Serve (No Nginx, No Vite Proxy)
FROM node:20-slim AS build

WORKDIR /app

# Copiar apenas os arquivos de dependência
COPY package*.json ./
RUN npm install

# Copiar o código e buildar
COPY . .
RUN npm run build

# Estágio de Produção
FROM node:20-slim

WORKDIR /app

# Instalar o pacote 'serve' para entregar os arquivos estáticos sem travas de host
RUN npm install -g serve

# Copiar a pasta dist/client gerada pelo build
COPY --from=build /app/dist/client ./dist/client

# Expomos a porta 3000
EXPOSE 3000

# O comando serve não faz checagem de host como o Vite Preview
# Isso vai matar o erro de "Blocked request" de uma vez por todas
CMD ["serve", "-s", "dist/client", "-l", "3000"]
