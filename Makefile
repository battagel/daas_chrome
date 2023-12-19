YARN := yarn

## help: Print this message
.PHONY: help
help:
	@fgrep -h '##' $(MAKEFILE_LIST) | fgrep -v fgrep | column -t -s ':' | sed -e 's/## //'


## install: Install dependencies
.PHONY: install
install:
	$(YARN) install

## build: Build the project
.PHONY: build
build:
	$(YARN) build

## run: Run the project
.PHONY: run
run:
	$(YARN) dev

## deploy: Deploy the project
.PHONY: deploy
deploy:
	$(YARN) deploy
