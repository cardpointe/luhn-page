#!/usr/bin/env bash
#
# run locally
#

set -o errexit
set -o pipefail
set -o nounset

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

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

#bin/build_static.sh
#cd "${SCRIPT_DIR}"

echo "INFO: current directory is $(pwd)"

echo "INFO: building docker image..."
docker build \
	--progress plain \
	--tag luhn-page \
	.

echo "INFO: running docker image on port ${PORT}..."
docker run \
	--env PORT=${PORT} \
	--interactive \
	--publish ${PORT}:80 \
	--rm \
	--tty \
	luhn-page
