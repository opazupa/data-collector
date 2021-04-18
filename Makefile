# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'

help:           ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

setup:  ## Setup environment
	cd car-collector && npm install
