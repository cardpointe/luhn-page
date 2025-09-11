#!/usr/bin/env bash
#
# compares the language files to make sure translations are in sync
#

set -o pipefail
set -o nounset
set -o errexit

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$(dirname "${SCRIPT_DIR}")"
MESSAGES_DIR="${REPO_DIR}/messages"

# check if gron is installed
if ! command -v sponge &> /dev/null; then
    echo "ERROR: sponge is not installed. Please install it to run this script."
    exit 1
fi

echo "INFO: checking translations in ${MESSAGES_DIR}"

cd "${MESSAGES_DIR}"

for FILENAME in *.json; do
	echo "INFO: sorting ${FILENAME}..."
	cat "${FILENAME}" | jq --sort-keys . | sponge "${FILENAME}"
done

echo "INFO: complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)"
