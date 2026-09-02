#!/usr/bin/env bash
# Run Playwright E2E in Docker without relying on Colima bind mounts (often stale/corrupt).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE="${PLAYWRIGHT_IMAGE:-bionicleidlerpg_playwright:latest}"
CONTAINER="bionicle-e2e-$$"
PLAYWRIGHT_ARGS="${*:-yarn test:e2e}"

echo "Building production bundle for Docker E2E..."
(cd "$ROOT" && yarn build)

cleanup() {
  docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker run -d --name "$CONTAINER" \
  -e CI=true \
  -e PLAYWRIGHT_DOCKER=true \
  --shm-size=2g \
  --add-host=host.docker.internal:host-gateway \
  "$IMAGE" \
  sleep 7200 >/dev/null

# Sync sources the VM mount may not reflect.
# Copy directory *contents* (trailing /. and /dest/) so we don't nest e.g. /app/e2e/e2e/.
docker cp "$ROOT/playwright.config.ts" "$CONTAINER:/app/playwright.config.ts"
docker cp "$ROOT/package.json" "$CONTAINER:/app/package.json"
docker cp "$ROOT/e2e/." "$CONTAINER:/app/e2e/"
docker cp "$ROOT/src/." "$CONTAINER:/app/src/"
docker cp "$ROOT/public/." "$CONTAINER:/app/public/"
docker cp "$ROOT/index.html" "$CONTAINER:/app/index.html"
docker cp "$ROOT/vite.config.ts" "$CONTAINER:/app/vite.config.ts"
docker cp "$ROOT/tsconfig.app.json" "$CONTAINER:/app/tsconfig.app.json"
docker cp "$ROOT/tsconfig.json" "$CONTAINER:/app/tsconfig.json"
docker cp "$ROOT/dist/." "$CONTAINER:/app/dist/"

docker exec -e CI=true -e PLAYWRIGHT_DOCKER=true "$CONTAINER" sh -lc "$PLAYWRIGHT_ARGS"

# Pull snapshots and reports back to the host.
docker cp "$CONTAINER:/app/e2e/." "$ROOT/e2e/" 2>/dev/null || true
docker cp "$CONTAINER:/app/test-results/." "$ROOT/test-results/" 2>/dev/null || true
docker cp "$CONTAINER:/app/playwright-report/." "$ROOT/playwright-report/" 2>/dev/null || true
