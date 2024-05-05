FROM node:alpine As base

RUN npm i -g pnpm


FROM base as development

WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build


FROM base as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --omit=dev
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/auth/main"]