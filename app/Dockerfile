# ============================================================================
# Horizon Hotel — Hospitality Management System
# Multi-stage Dockerfile: build the Vite/React app, then serve the static
# output with Nginx. Keeps the final image small (no Node.js at runtime).
# ============================================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching on rebuilds)
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .

# Firebase config is injected at build time via build args, then exposed to
# Vite through matching VITE_ env vars (Vite only reads env vars available
# at build time and prefixed with VITE_).
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# ---- Stage 2: Serve ----
FROM nginx:1.27-alpine AS runtime

# Custom Nginx config: SPA fallback (React Router) + gzip + a /metrics-friendly
# access log format that nginx-prometheus-exporter can scrape via stub_status.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
