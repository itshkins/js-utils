#!/bin/sh

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"

cd "$PROJECT_DIR/backend" && npm run build \
  && cd "$PROJECT_DIR/frontend" && npm run build \
  && pm2 restart server
