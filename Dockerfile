# Build version: 1.0.3 - Frontend Fixed Path
# Estagio 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Copiar arquivos de dependencia (usando caminho relativo a raiz do repo)
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar o restante do codigo do frontend
COPY frontend/ .

# Build do projeto
RUN npm run build

# Estagio 2: Servir com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos buildados do estagio anterior para o diretorio do Nginx
# O Vite gera a pasta dist dentro de /app no container
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração SPA Nginx
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
