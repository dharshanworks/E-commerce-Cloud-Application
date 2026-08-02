# ==========================================
# CloudCart Frontend Dockerfile
# Multi-Stage Build
# ==========================================

# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port
EXPOSE 80

# Health Check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
CMD wget --spider http://localhost || exit 1

CMD ["nginx","-g","daemon off;"]