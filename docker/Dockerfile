FROM node:20.11-alpine as builder

WORKDIR /app

COPY . .

RUN yarn && yarn run build

COPY docker/scripts/docker-entrypoint.sh /usr/local/bin

ENTRYPOINT [ "docker-entrypoint.sh" ]