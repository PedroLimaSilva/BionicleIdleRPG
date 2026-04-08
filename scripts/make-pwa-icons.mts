/**
 * Raster PWA / favicon assets from the virtues SVG (GymOverload-style pipeline:
 * rasterize once, bilinear resize, recolor RGB while preserving source alpha only).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import sharp from 'sharp';
import type { IcoOptions } from 'sharp-ico';

const { sharpsToIco } = createRequire(import.meta.url)('sharp-ico') as typeof import('sharp-ico');

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const sourceSvgPath = join(publicDir, 'ThreeVirtues-light.svg');

/** Silver #8a9099 (matches light-mode glyph; alpha-only silhouette) */
const SR = 0x8a;
const SG = 0x90;
const SB = 0x99;

function resizePng(src: PNG, dstW: number, dstH: number): PNG {
  const sw = src.width;
  const sh = src.height;
  const srcData = src.data;
  const dst = new PNG({ width: dstW, height: dstH });

  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const sx = ((x + 0.5) * sw) / dstW - 0.5;
      const sy = ((y + 0.5) * sh) / dstH - 0.5;
      const x0 = Math.max(0, Math.min(sw - 1, Math.floor(sx)));
      const y0 = Math.max(0, Math.min(sh - 1, Math.floor(sy)));
      const x1 = Math.max(0, Math.min(sw - 1, x0 + 1));
      const y1 = Math.max(0, Math.min(sh - 1, y0 + 1));
      const fx = sx - x0;
      const fy = sy - y0;
      const di = (dstW * y + x) << 2;

      for (let c = 0; c < 4; c++) {
        const i00 = ((sh * y0 + x0) << 2) + c;
        const i10 = ((sh * y0 + x1) << 2) + c;
        const i01 = ((sh * y1 + x0) << 2) + c;
        const i11 = ((sh * y1 + x1) << 2) + c;
        const v00 = srcData[i00];
        const v10 = srcData[i10];
        const v01 = srcData[i01];
        const v11 = srcData[i11];
        const top = v00 * (1 - fx) + v10 * fx;
        const bot = v01 * (1 - fx) + v11 * fx;
        dst.data[di + c] = Math.round(top * (1 - fy) + bot * fy);
      }
    }
  }
  return dst;
}

function silverSilhouette(src: PNG, size: number): PNG {
  const r = resizePng(src, size, size);
  for (let i = 0; i < r.data.length; i += 4) {
    const sa = r.data[i + 3];
    r.data[i] = SR;
    r.data[i + 1] = SG;
    r.data[i + 2] = SB;
    r.data[i + 3] = sa;
  }
  return r;
}

function writePng(path: string, png: PNG): void {
  writeFileSync(path, PNG.sync.write(png));
}

const svgBytes = readFileSync(sourceSvgPath);
const raster1024 = await sharp(svgBytes).resize(1024, 1024).ensureAlpha().png().toBuffer();
const source = PNG.sync.read(raster1024);

if (source.width !== source.height) {
  console.warn('make-pwa-icons: source raster is not square; maskable slots may look stretched.');
}

writePng(join(publicDir, 'pwa-192.png'), silverSilhouette(source, 192));
writePng(join(publicDir, 'pwa-512.png'), silverSilhouette(source, 512));
writePng(join(publicDir, 'apple-touch-icon.png'), silverSilhouette(source, 180));

const fav32 = silverSilhouette(source, 32);
const fav32Bytes = PNG.sync.write(fav32);
writeFileSync(join(publicDir, 'favicon-32-light.png'), fav32Bytes);
writeFileSync(join(publicDir, 'favicon-32-dark.png'), fav32Bytes);

const png48 = silverSilhouette(source, 48);
const icoOptions: IcoOptions = {
  sizes: [48],
  resizeOptions: {},
};
await sharpsToIco([sharp(PNG.sync.write(png48))], join(publicDir, 'favicon.ico'), icoOptions);

console.log(
  'make-pwa-icons: wrote pwa-192.png, pwa-512.png, apple-touch-icon.png, favicon-32-*.png, favicon.ico'
);
