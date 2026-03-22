# ========================
# Stage 1 : Dependencies
# ========================
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY prisma ./prisma/
RUN npx prisma generate

# ========================
# Stage 2 : Build
# ========================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Compile le seed en JS pour la prod
RUN npx tsc prisma/seed.ts --outDir prisma/dist --esModuleInterop --module commonjs --skipLibCheck

# ========================
# Stage 3 : Production
# ========================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY prisma/schema.prisma ./prisma/
COPY --from=builder /app/prisma/dist ./prisma/dist

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
