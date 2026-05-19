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
RUN npm run build && ls -la dist

# Estagio 2: Servir com Nginx
FROM nginx:stable-alpine

# Remover configuração padrão do Nginx para evitar que ela sobreponha a nossa
RUN rm /etc/nginx/conf.d/default.conf

# Copiar os arquivos buildados do estagio anterior para o diretorio do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Criar uma nova configuração do Nginx para o SPA
RUN printf "server { \n\
    listen 80; \n\
    server_name localhost; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

# Garantir permissões de leitura
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
