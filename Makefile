default: docker-run

setup:
	(cd ui; yarn)
	docker-compose build

docker-run:
	docker-compose up

docker-setup:
	docker-compose up build-setup

docker-server:
	docker-compose up server

docker-frontend:
	docker-compose up frontend

docker-database:
	docker-compose up postgres

clean-frontend:
	(cd ui; rm -rf node_modules)
	(cd ui; yarn clean)

clean-backend:
	rm -rf shoe-project

clean-docker:
	docker-compose down

clean: clean-docker clean-frontend clean-backend
