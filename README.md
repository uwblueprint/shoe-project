# shoe-project

## Setup

Requirements:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Yarn >= 1.20
- Node >= 12 (We recommend managing node versions with https://volta.sh/)
- `.env` file pinned on Slack channel


## Development Workflow
The project is dockerized and hence it is recommended to use `docker-compose` to develop and run services!

- Backend server supports hot-reload so you don't need to re run it every change
- Frontend also supports hot-reload so no need to re run it every change
- You may be missing one or more env variables in your `.env` file: check the Slack channel

Install dependencies and build docker image:
```
make setup
```

To run all the services for the app:
```
make
```

To seed DB:
```
make seed
```

To run backend:
```
make backend
```
- **Frontend**: Go to [localhost:8900](http://localhost:8900)
- **Backend**: Go to [localhost:8900/api](http://localhost:8900/api)

To run frontend:
```
make frontend
```
- Go to [localhost:1234](http://localhost:1234)

To run postgres:
```
make postgres
```
Now database can be accessed by `Pgadmin`:
- Go to [localhost:5050](http://localhost:5050)
- **Username**: user@blueprint.org and **Password**: admin


If you install new dependencies, clean the docker images with `make clean-docker`, then run `make setup` and `make` again.

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

## Backend Code quality and checks
Before pushing code, make sure to format the code and run all tests. This can be done by:
```bash
make backend-fmt
make backend-test
```

You can run a single test file by specifying the package it's in:
```bash
make backend-test pkg=<package_name>
# eg. make backend-test pkg=restapi
```

Before code is merged, series of checks are run on the code to make sure it is formatted correctly.
You can check locally to make sure none of these issues show up by:
```bash
make backend-check
```

## Authentication
All the `create` endpoints are protected, which means you have to login before you can make POST requests to these endpoints.

1. Make sure that you have the latest `.env` file (pinned on Slack channel) in the *root* of your `shoe-project` directory.
2. It's best to do `make clean-docker && make setup` before starting your backend server: `make`
3. In a separate tab, make a POST request to the `/login` endpoint using `curl`:

```bash
$ curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"<username>","password":"<password>"}' \
  http://localhost:8900/api/login
```

The `<username>` and `<password>` should be changed to the superuser's username and password in your `.env` file.

4. Once you have successfully authenticated, the response will contain a JWT token. Export this token as an environment variable:

```bash
> {"status":"OK","payload":<JWT-Token>}

$ TOKEN=<JWT-Token>
```

5. Now, you can use this token to authenticate yourself with every POST request you make to protected endpoints. Pass the token in your header like this:

```bash
$ curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" http://localhost:8900/api/<protected-endpoint>
```

Note that the key `Authorization: Bearer` is fixed, so don't change this.

## Running Script

Navigate into the scripts folder.
```bash
cd scripts
```

Set up the virtual environment.
```bash
make setup
```

Run the script by specifying the name of the script file. Make sure the script is included in the scripts folder.
```bash
make filename=[filename]
```
For add_images.py script, images folder with all the images that needs to be uploaded to s3 should be included in the scripts folder
