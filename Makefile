default: app

setup:
	(cd ui; yarn)
	docker build -t shoe_project_image -f ./docker/Dockerfile.dev .
	go get golang.org/x/tools/cmd/goimports

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

clean: clean-docker clean-frontend clean-backend

fmt:
	goimports -w .
	go mod tidy
