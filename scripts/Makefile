default: setup

setup:
	python3 -m pip install virtualenv
	python3 -m virtualenv .venv

source:
	ls
	source .venv/bin/activate

deactivate:
	deactivate

install: source
	pip install -r requirements.txt