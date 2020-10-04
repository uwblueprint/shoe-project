# shoe-project

## Setup (Development environment)

Requirements:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Yarn
- Node

Then run the Makefile to get started.

```
make
```

If you install new dependencies, we recommend you clean the docker images with `make clean-docker`, then run `make` again.

Trouble? Feel free to blow everything up with `make clean`. Also, you can run `docker image ls` to list all images, and `docker ps` to see all running images.

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
