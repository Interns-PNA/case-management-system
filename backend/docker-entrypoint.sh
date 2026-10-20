#!/bin/sh
set -e

# Seed a fresh (empty) uploads volume with the sample files bundled in the
# image. On Container Apps / compose the runtime uploads dir may be a mount.
if [ -d /app/uploads-seed ] && [ -z "$(ls -A /app/uploads 2>/dev/null)" ]; then
  cp -r /app/uploads-seed/. /app/uploads/ 2>/dev/null || true
fi

exec "$@"
