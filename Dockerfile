FROM node:alpine AS base
RUN npm install -g pnpm
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

FROM base AS development
RUN pnpm install
COPY . .
RUN pnpm run build

FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN pnpm install --prod
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/src/main"]