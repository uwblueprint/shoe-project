default: run 

setup:
	python3 -m pip install virtualenv
	python3 -m virtualenv .venv

install:
	(\
		source .venv/bin/activate; \
		pip install -r requirements.txt; \
		deactivate \
	)

run: install
	(\
		source .venv/bin/activate; \
		python $(filename); \
		deactivate \
	)	

.PHONY: setup install run
