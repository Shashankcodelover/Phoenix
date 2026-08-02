# Google-Standard Production Node.js Dockerfile
FROM node:18-alpine AS base

# Install security updates
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000

# Security: Run as non-root user
USER node

EXPOSE 5000

CMD ["node", "server.js"]
