# Build version: 1.0.4 - Frontend Folder Context
# Estagio 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Como o Easypanel está entrando na pasta /frontend, 
# os arquivos já estão na raiz do contexto de build.
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar o restante do codigo
COPY . .

# Build do projeto
RUN npm run build

# Estagio 2: Servir com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos buildados do estagio anterior para o diretorio do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração SPA Nginx para lidar com rotas do React
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
