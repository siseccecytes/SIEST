# ===== Etapa 1: compilar el frontend con Node =====
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# La URL del API queda como /api (mismo dominio); Caddy la redirige al backend.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ===== Etapa 2: servir los archivos con Caddy (HTTPS automatico) =====
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80
EXPOSE 443
