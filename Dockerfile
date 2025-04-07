# Use Node.js 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y wget ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies including dev for TypeScript build
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Set environment variable
ENV PORT=3000

# Start the server
CMD ["node", "dist/backend/index.js"]