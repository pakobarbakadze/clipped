FROM node:alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine as production
WORKDIR /usr/src/app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/src/main"]