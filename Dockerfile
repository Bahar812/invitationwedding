# --- build frontend ---
FROM node:22-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- jalankan backend + sajikan frontend ---
FROM node:22-alpine
WORKDIR /app/backend
ENV NODE_ENV=production PORT=3000 DATA_DIR=/data/data UPLOADS_DIR=/data/uploads FRONTEND_DIST=/app/frontend/dist
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=web /web/dist /app/frontend/dist
RUN mkdir -p /data/data /data/uploads
EXPOSE 3000
CMD ["node", "server.js"]
