FROM node:12

WORKDIR /app
ADD . /app

RUN cd ui && yarn && yarn build-prod && cd ..

FROM golang:1.15

RUN go mod download

RUN go build

EXPOSE 127.08900 8900
CMD ["./shoe-project", "server"]
