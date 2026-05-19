# Build version: 1.0.5 - Frontend Nginx Conf Fix
FROM node:20 AS build

WORKDIR /app

# Instalação limpa
COPY package*.json ./
RUN npm install

# Cópia e Build
COPY . .
RUN npm run build

# Produção com Nginx
FROM nginx:stable-alpine

# Remove configurações padrão
RUN rm -rf /etc/nginx/conf.d/*

# Copia nossa configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do build (Vite gera na pasta dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Ajuste de permissões
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
