FROM node:20.11-alpine as builder

WORKDIR /app

COPY . .

RUN yarn && yarn run build

CMD [ "node", "dist/src/main.js" ]