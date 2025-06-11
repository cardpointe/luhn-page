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

if [ ! -d "node_modules" ]; then
    echo "INFO: installing node modules"
    npm install
fi

if [ "${PORT:-BAD}" == "BAD" ]; then
	export PORT=4000
fi

echo "INFO: updating version info"
"${SCRIPT_DIR}/bin/set_version.sh"

echo "INFO: starting dev server on port ${PORT}"
npm run dev
