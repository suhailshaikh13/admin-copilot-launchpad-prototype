#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${ARTIFACTORY_USERNAME:-}" || -z "${ARTIFACTORY_API_KEY:-}" ]]; then
  echo "ARTIFACTORY_USERNAME and ARTIFACTORY_API_KEY must be set as environment secrets." >&2
  exit 1
fi

curl -fsSL -u "${ARTIFACTORY_USERNAME}:${ARTIFACTORY_API_KEY}" \
  "https://zdrepo.jfrog.io/zdrepo/api/npm/npm/auth/zendesk" >> "${HOME}/.npmrc"

npm ci --legacy-peer-deps

npx playwright install chromium --with-deps
