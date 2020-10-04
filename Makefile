default: docker-build

setup:
	(cd ui; yarn)

docker-build: setup
	docker-compose up

clean-frontend:
	(cd ui; rm -rf node_modules)
	(cd ui; yarn clean)

clean-backend:
	rm -rf shoe-project

clean-docker:
	docker-compose down
	docker image rm shoe-project_client || true
	docker image rm shoe-project_server || true

clean: clean-docker clean-frontend clean-backend
