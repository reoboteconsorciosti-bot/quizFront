# Build version: 1.0.2 - Frontend Nginx
# Estagio 1: Build do Frontend
FROM node:20-slim AS build-frontend

WORKDIR /app

# Copiar arquivos de dependencia do frontend
COPY frontend/package*.json ./frontend/

# Instalar dependencias do frontend
RUN cd frontend && npm install

# Copiar o restante do codigo do frontend
COPY frontend/ ./frontend/

# Build do frontend (gera a pasta frontend/dist)
RUN cd frontend && npm run build

# Estagio 2: Servir com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos buildados do estagio anterior para o diretorio do Nginx
COPY --from=build-frontend /app/frontend/dist /usr/share/nginx/html

# Copiar uma configuracao customizada do Nginx para lidar com roteamento SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
