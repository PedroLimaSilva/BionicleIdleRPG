#!/bin/bash
# Compress GLB files with Draco only (preserves scene hierarchy).
# Outputs a single .glb per input (extension must be .glb for embedded output).
# Usage: yarn compress public/path/to/file.glb [more files...]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TSX="$ROOT/node_modules/.bin/tsx"
DIAGNOSE=("$TSX" "$ROOT/scripts/diagnose-glb-draco.mts")

if [ "$#" -eq 0 ]; then
  echo "Usage: yarn compress public/path/to/file.glb [more files...]" >&2
  exit 1
fi

for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "error: file not found: $f" >&2
    exit 1
  fi

  if ! "${DIAGNOSE[@]}" "$f"; then
    echo "Skipping Draco for $f — fix the export issues above and re-export." >&2
    exit 1
  fi

  out="${f}.draco.glb"
  if ! npx @gltf-transform/cli draco "$f" "$out"; then
    echo "error: Draco compress failed for $f (gltf-transform)." >&2
    echo "Re-checking texture / UV slots:" >&2
    "${DIAGNOSE[@]}" "$f" || true
    exit 1
  fi
  mv "$out" "$f"
  echo "Compressed: $f"
done
