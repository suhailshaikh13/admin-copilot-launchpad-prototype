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

if ! npx playwright install chromium --with-deps; then
  echo "Playwright browser download failed; use system Chrome via PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/local/bin/google-chrome for tests." >&2
fi
