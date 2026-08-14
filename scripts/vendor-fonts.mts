import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS_DEST = join(ROOT, 'public/fonts');

const FONT_FILES = [
  {
    dest: 'inter-latin-400.woff2',
    src: join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2'),
  },
  {
    dest: 'inter-latin-500.woff2',
    src: join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2'),
  },
  {
    dest: 'inter-latin-700.woff2',
    src: join(ROOT, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2'),
  },
  {
    dest: 'orbitron-latin-400.woff2',
    src: join(ROOT, 'node_modules/@fontsource/orbitron/files/orbitron-latin-400-normal.woff2'),
  },
  {
    dest: 'orbitron-latin-500.woff2',
    src: join(ROOT, 'node_modules/@fontsource/orbitron/files/orbitron-latin-500-normal.woff2'),
  },
  {
    dest: 'orbitron-latin-700.woff2',
    src: join(ROOT, 'node_modules/@fontsource/orbitron/files/orbitron-latin-700-normal.woff2'),
  },
] as const;

mkdirSync(FONTS_DEST, { recursive: true });

for (const { dest, src } of FONT_FILES) {
  copyFileSync(src, join(FONTS_DEST, dest));
}

console.log(`Vendored UI fonts to public/fonts/ (${FONT_FILES.map((f) => f.dest).join(', ')})`);
