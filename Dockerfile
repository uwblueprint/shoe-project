FROM golang:1.15

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash
# Install node and confirm that it was successful
RUN apt-get update && apt-get install -y nodejs && node -v

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# Install yarn and confirm that it was successful
RUN apt update && apt install -y yarn

WORKDIR /app
ADD . /app

RUN cd ui && yarn && yarn build-prod && cd ..

RUN go mod download

RUN go build

EXPOSE 8900 8900
CMD ["./shoe-project", "server"]
