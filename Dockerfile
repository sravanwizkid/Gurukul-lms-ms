# Use Node.js 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy only package files first
COPY package.json ./

# Clean install dependencies
RUN npm cache clean --force && \
    npm install --production=false

# Install TypeScript globally
RUN npm install -g typescript

# Copy source code
COPY . .

# Build
RUN npm run build

# Clean dev dependencies
RUN npm prune --production

# Setup startup script
RUN echo '#!/bin/sh' > /app/startup.sh && \
    echo 'cd /app' >> /app/startup.sh && \
    echo 'export PORT=${PORT:-3000}' >> /app/startup.sh && \
    echo 'export NODE_ENV=production' >> /app/startup.sh && \
    echo 'echo "Starting server on port $PORT"' >> /app/startup.sh && \
    echo 'node dist/backend/index.js' >> /app/startup.sh && \
    chmod +x /app/startup.sh

# Get Cloud SQL proxy
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /cloud_sql_proxy && \
    chmod +x /cloud_sql_proxy

RUN echo '/cloud_sql_proxy -instances=gurukul-lms-ms:asia-south1:gurukul-postgres=tcp:5432 &' >> /app/startup.sh

# Expose port
EXPOSE 3000

# Set environment variable
ENV PORT=3000

# Start the server
CMD ["node", "dist/backend/index.js"]