default: app

setup:
	(cd ui; yarn)
	docker build -t shoe_project_image -f ./docker/Dockerfile.dev .

app:
	docker-compose up postgres backend frontend

seed:
	docker-compose up seed

backend:
	docker-compose up backend

frontend:
	docker-compose up frontend

postgres:
	docker-compose up postgres pgadmin

clean-frontend:
	(cd ui; rm -rf node_modules)
	(cd ui; yarn clean)

clean-backend:
	rm -rf shoe-project

clean-docker:
	docker-compose down
	docker image rm shoe_project_image || true

clean: clean-docker clean-frontend clean-backend
