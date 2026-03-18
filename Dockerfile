FROM node:alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/build build
COPY --from=builder /app/node_modules node_modules
COPY package.json .
ENV NODE_ENV=production
CMD [ "node", "build" ]