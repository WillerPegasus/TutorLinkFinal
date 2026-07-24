# --- Étape 1 : build de l'application React/Vite ---
FROM node:20-alpine AS build
WORKDIR /app

# URLs injectées au build (voir docker-compose.yml -> build.args)
ARG VITE_API_BASE_URL=http://localhost:8080/api
ARG VITE_SOCKET_URL=http://localhost:8086
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm install

COPY . .
# Écrase .env.production pour éviter que d'anciennes valeurs (ex: ngrok) prennent le dessus
RUN echo "VITE_API_BASE_URL=$VITE_API_BASE_URL" > .env.production && \
    echo "VITE_SOCKET_URL=$VITE_SOCKET_URL" >> .env.production
RUN npm run build

# --- Étape 2 : servir les fichiers statiques avec nginx ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
