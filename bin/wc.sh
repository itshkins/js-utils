#!/bin/sh

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"

cd "$PROJECT_DIR" \
  && find backend/src frontend/src shared/* \
    -type f \
    -not -path '*/node_modules/*' \
    -not -path '*.json' \
    -not -path '*.test.js' \
    | xargs wc ${1-}
