FROM node:lts-alpine3.22 AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN corepack enable

FROM base AS development
RUN pnpm install
COPY . .
CMD ["pnpm", "dev"]

FROM base AS build
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS prod-deps
RUN pnpm install --frozen-lockfile --prod

FROM node:lts-alpine3.22 AS production
WORKDIR /app
RUN corepack enable
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start"]