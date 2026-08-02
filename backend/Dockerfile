# ===============================
# CloudCart Backend Dockerfile
# ===============================

FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first (Docker cache optimization)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# Give ownership
RUN chown -R appuser:appgroup /app

USER appuser

# Backend Port
EXPOSE 5000

# Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
CMD wget -qO- http://localhost:5000/api/health > /dev/null || exit 1

# Start Application
CMD ["npm", "start"]