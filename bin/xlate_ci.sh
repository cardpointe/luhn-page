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
if ! command -v gron &> /dev/null; then
    echo "ERROR: gron is not installed. Please install it to run this script."
    exit 1
fi

echo "INFO: checking translations in ${MESSAGES_DIR}"

cd "${MESSAGES_DIR}"

PRIMARY="en.json"
RETVAL=0

for FILENAME in *.json; do
    if [ "${FILENAME}" != "${PRIMARY}" ]; then
        echo "INFO: checking ${FILENAME}..."
        set +e
        DIFF_OUTPUT=$(diff <(gron "${PRIMARY}" | awk -F " = " '{print $1}') <(gron "${FILENAME}" | awk -F " = " '{print $1}') || true)
        set -e
        if [ -n "${DIFF_OUTPUT}" ]; then
            echo "ERROR: ${FILENAME} is not in sync with ${PRIMARY}!"
            echo "${DIFF_OUTPUT}"
            echo ""
            RETVAL=1
        fi
    fi
done

exit ${RETVAL}