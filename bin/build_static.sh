#!/usr/bin/env bash
#
# run locally
#

set -o errexit
set -o pipefail
set -o nounset

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$(dirname "${SCRIPT_DIR}")"

echo "INFO: setting version info"
"${SCRIPT_DIR}/set_version.sh"

cd "${REPO_DIR}"

if [ ! -d "node_modules" ]; then
    echo "INFO: installing node modules"
    npm install
fi

echo "INFO: building static files"
npm run build

echo "INFO: static files are located in '${REPO_DIR}/build/client/'"