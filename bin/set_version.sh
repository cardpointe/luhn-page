#!/usr/bin/env bash
#
# set the version info for the about page (use git )
#

set -o errexit
set -o pipefail
set -o nounset

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$(dirname "${SCRIPT_DIR}")"

if [[ ! -f "${REPO_DIR}/public/status.json" ]]; then
  echo "ERROR: status.json not found in ${REPO_DIR}/public/"
  exit 1
fi


echo "INFO: checking for jq"
if ! command -v jq &> /dev/null; then
    echo "ERROR: jq could not be found, please install it to run this script."
    exit 2
fi

echo "INFO: checking for sponge"
if ! command -v sponge &> /dev/null; then
    echo "ERROR: sponge could not be found, please install it to run this script."
    exit 3
fi


echo "INFO: marking status.json as unchanged"
git update-index --assume-unchanged "${REPO_DIR}/public/status.json"

echo "INFO: setting version info"
COMMIT=$(git rev-parse --short HEAD)
if [[ $(git diff --stat) != '' ]]; then
  COMMIT="${COMMIT}-dirty"
fi
cat "${REPO_DIR}/public/status.json" | jq --arg COMMIT "${COMMIT}"  '.commit = $COMMIT' | sponge "${REPO_DIR}/public/status.json"

echo "INFO: setting last modified"
LASTMOD=$(date -u +%Y-%m-%dT%H:%M:%SZ)
cat "${REPO_DIR}/public/status.json" | jq --arg LASTMOD "${LASTMOD}"  '.lastmod = $LASTMOD' | sponge "${REPO_DIR}/public/status.json"

echo "INFO: setting tech info"
TECH="React Router $(npx react-router --version)"
cat "${REPO_DIR}/public/status.json" | jq --arg TECH "${TECH}"  '.tech = $TECH' | sponge "${REPO_DIR}/public/status.json"

