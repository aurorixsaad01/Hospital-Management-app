# Build stage - using Node.js 20 Alpine for small, secure image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for reproducible installs
RUN npm ci

# Copy application code
COPY . .

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built app from builder stage
COPY --from=builder /app . 

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Run the application
CMD ["npm", "start"]
