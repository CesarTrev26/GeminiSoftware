FROM node:20-slim

# Install OpenSSL 3 and other dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Clean any cached Prisma client and generate fresh with correct binary target
RUN rm -rf node_modules/.prisma node_modules/@prisma/client
RUN npx prisma generate

# Build TypeScript (includes lint + type-check)
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 3001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

CMD ["node", "dist/server.js"]
