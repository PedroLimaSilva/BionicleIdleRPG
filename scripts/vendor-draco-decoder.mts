import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRACO_SRC = join(ROOT, 'node_modules/three/examples/jsm/libs/draco/gltf');
const DRACO_DEST = join(ROOT, 'public/draco');

const FILES = ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js'] as const;

mkdirSync(DRACO_DEST, { recursive: true });

for (const file of FILES) {
  copyFileSync(join(DRACO_SRC, file), join(DRACO_DEST, file));
}

console.log(`Vendored Draco decoder to public/draco/ (${FILES.join(', ')})`);
