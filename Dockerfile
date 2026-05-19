# Estagio 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Copiar arquivos de dependencia
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar o restante do codigo
COPY . .

# Build do frontend (gera a pasta dist)
RUN npm run build

# Estagio 2: Servir com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos buildados do estagio anterior para o diretorio do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
