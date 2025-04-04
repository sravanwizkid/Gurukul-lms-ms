# Use Node.js 18
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including dev for TypeScript build
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Now remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start using the script
CMD ["node", "dist/backend/index.js"]