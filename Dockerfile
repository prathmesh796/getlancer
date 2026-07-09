# ---------- 1. Install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# ---------- 2. Build Next.js ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Accept NEXT_PUBLIC_* build-time variables so Next.js can embed them
# into the client bundle during `npm run build`. These are intentionally
# public values (see .env.example) and are safe to pass as build args.
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

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