# ============================================================
# MedFlow Frontend — Multi-stage Dockerfile
#
# Stages:
#   deps       → install node_modules (cached layer)
#   dev        → hot-reload dev server  (docker compose up)
#   build      → production bundle
#   production → nginx serving the bundle
# ============================================================

# ---- deps ----
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --prefer-offline --no-audit

# ---- dev ----
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---- build ----
FROM deps AS build
COPY . .
# VITE_ vars must be available at BUILD time; pass via --build-arg
ARG VITE_API_BASE_URL=http://localhost:5001/api
ARG VITE_APP_NAME=MedFlow
ARG VITE_APP_ENV=production
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_ENV=$VITE_APP_ENV
RUN npm run build

# ---- production ----
FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
