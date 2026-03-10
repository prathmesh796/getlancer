# ---------- 1. Install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# ---------- 2. Build Next.js ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- 3. Production image ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# copy standalone build
COPY --from=builder /app/.next/standalone ./

# copy static files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]