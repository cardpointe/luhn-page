#!/usr/bin/env bash
#
# run locally
#

set -o errexit
set -o pipefail
set -o nounset

#
# load an .env file if it exists
#
ENV_FILE="${1:-./.env}"
if [ -f "${ENV_FILE}" ]; then
    echo "INFO: loading '${ENV_FILE}'!"
    export $(cat "${ENV_FILE}")
else
    echo "INFO: '${ENV_FILE}' not found!"
fi

if [ "${PORT:-BAD}" == "BAD" ]; then
	export PORT=80
fi

docker build \
	--build-arg COMMIT=$(git rev-parse --short HEAD) \
	--build-arg LASTMOD=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
	--progress plain \
	--tag luhn-page \
	.

docker run \
	--env PORT=${PORT} \
	--interactive \
	--publish ${PORT}:${PORT} \
	--rm \
	--tty \
	luhn-page
