FROM node:24-bookworm AS builder

COPY ./package.json ./package-lock.json /app/
WORKDIR /app
RUN npm install

COPY . /app/

RUN npm run build

FROM joseluisq/static-web-server:2
COPY --from=builder /app/build/client /public
