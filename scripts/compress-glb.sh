#!/bin/bash
# Compress GLB files with Draco only (preserves scene hierarchy).
# Outputs a single .glb per input (extension must be .glb for embedded output).
# Usage: yarn compress public/path/to/file.glb [more files...]
set -e
for f in "$@"; do
  out="${f}.draco.glb"
  npx @gltf-transform/cli draco "$f" "$out" && mv "$out" "$f"
  echo "Compressed: $f"
done
