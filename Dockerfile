# ============================================================================
# TransitIntel AI — Docker Build (Custom Socket.io Server)
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install ALL dependencies (including devDependencies needed for build like Tailwind)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 transitintel
RUN adduser --system --uid 1001 transitintel

# Copy built app and dependencies
COPY --from=builder --chown=transitintel:transitintel /app ./

USER transitintel

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Run the custom Socket.io server
CMD ["npm", "start"]
