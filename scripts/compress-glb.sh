#!/bin/bash
# Compress GLB files with Draco only (preserves scene hierarchy).
# Usage: yarn compress public/path/to/file.glb [more files...]
set -e
for f in "$@"; do
  npx @gltf-transform/cli draco "$f" "$f.tmp" && mv "$f.tmp" "$f"
  echo "Compressed: $f"
done
