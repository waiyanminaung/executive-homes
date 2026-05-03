FROM node:lts-alpine3.22 AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm install
COPY . .
RUN npx prisma generate
CMD ["npm", "run dev"]

FROM base AS build
RUN npm install --silent
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS prod-deps
RUN npm install --silent --omit=dev

FROM node:lts-alpine3.22 AS production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/public ./public
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]