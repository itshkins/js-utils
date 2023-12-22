#!/bin/sh

PROJECT_DIR="$(realpath "$(dirname "$0")/..")"

pm2 stop server
cd "$PROJECT_DIR/shared" && npm ci \
  && cd "$PROJECT_DIR/backend" && npm ci && npm run build \
  && cd "$PROJECT_DIR/frontend" && npm ci && npm run build \
  && pm2 restart server
