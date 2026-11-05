#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PORT="${DEV_PORT:-5173}"
HOST="${DEV_HOST:-0.0.0.0}"

if curl -sf "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then
  echo "Vite dev server already responding on port ${PORT}"
  exit 0
fi

exec npm run dev -- --host "${HOST}" --port "${PORT}"
