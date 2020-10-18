# shoe-project

## Setup

Requirements:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Yarn >= 1.20
- Node >= 12 (We recommend managing node versions with https://volta.sh/)


## Development Workflow
The project is dockerized and hence it is recommended to use `docker-compose` to develop and run services!

- Backend server supports hot-reload so you don't need to re run it every change
- Frontend also supports hot-reload so no need to re run it ever change

Install dependencies and docker setup:
```
make setup
```

To run all the services:
```
make
```

To run DB migrations:
```
make docker-setup
```

To run server:
```
make docker-server
```
- **Frontend**: Go to [localhost:8900](http://localhost:8900)
- **Backend**: Go to [localhost:8900/api](http://localhost:8900/api)

To run frontend:
```
make docker-frontend
```
- Go to [localhost:1234](http://localhost:1234)

To run database:
```
make docker-postgres
```
- **PgAdmin**: Go to [localhost:5050](http://localhost:5050)


If you install new dependencies, clean the docker images with `make clean-docker`, then run `make` again.

Trouble? Feel free to blow everything up with `make clean`. Also, you can run `docker image ls` to list all images, and `docker ps` to see all running images.

If you see message:
```
Pulling frontend (shoe_project_image:)...
ERROR: The image for the service you're trying to recreate has been removed. If you continue, volume data could be lost. Consider backing up your data before continuing.
```
- Resolve this by doing `make setup`

## Building for Production

See the `docker/Dockerfile.prod` for more details.

TL;DR, run `yarn build-prod`, and then just run the server.

## Manual setup (frontend)

The frontend uses [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/), and bundles assets using [Parcel](https://parceljs.org/).

Navigate into the UI folder.
```bash
cd ui
```

Run yarn to install deps.
```bash
yarn
```

Run yarn watch to start building development assets. This will not run it's own server, you will instead need to run the go server to view the assets.
```bash
yarn watch
```

To run the UI assets on it's own server, run:
```bash
yarn start
```
