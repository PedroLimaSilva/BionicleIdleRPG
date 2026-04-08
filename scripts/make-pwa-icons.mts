/**
 * Raster PWA / favicon assets from the virtues SVG (GymOverload-style pipeline:
 * high-res raster + Lanczos3 downscale for anti-aliasing; recolor RGB while
 * preserving source alpha only).
 */
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

/** SVG rasterized at this size before downscale (supersampling / AA). */
const RASTER_SIZE = 4096;

/** Scale of the glyph within the square canvas (padding for home screen / maskable). */
const INNER_SCALE = 0.88;

function applySilverToRawRgba(data: Buffer): void {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = SR;
    data[i + 1] = SG;
    data[i + 2] = SB;
  }
}

async function silverSilhouettePaddedPng(
  canvasSize: number,
  coloredRaster: Buffer
): Promise<Buffer> {
  const innerDim = Math.max(1, Math.round(canvasSize * INNER_SCALE));
  const innerPng = await sharp(coloredRaster, {
    raw: { width: RASTER_SIZE, height: RASTER_SIZE, channels: 4 },
  })
    .resize(innerDim, innerDim, {
      kernel: sharp.kernel.lanczos3,
      fit: 'fill',
    })
    .png()
    .toBuffer();

  const ox = Math.floor((canvasSize - innerDim) / 2);
  const oy = Math.floor((canvasSize - innerDim) / 2);

  return sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: innerPng, left: ox, top: oy }])
    .png()
    .toBuffer();
}

const svgBytes = readFileSync(sourceSvgPath);
const { data: rasterData } = await sharp(svgBytes)
  .resize(RASTER_SIZE, RASTER_SIZE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

applySilverToRawRgba(rasterData);

const pwa192 = await silverSilhouettePaddedPng(192, rasterData);
const pwa512 = await silverSilhouettePaddedPng(512, rasterData);
const apple180 = await silverSilhouettePaddedPng(180, rasterData);
const fav32 = await silverSilhouettePaddedPng(32, rasterData);
const png48 = await silverSilhouettePaddedPng(48, rasterData);

writeFileSync(join(publicDir, 'pwa-192.png'), pwa192);
writeFileSync(join(publicDir, 'pwa-512.png'), pwa512);
writeFileSync(join(publicDir, 'apple-touch-icon.png'), apple180);
writeFileSync(join(publicDir, 'favicon-32-light.png'), fav32);
writeFileSync(join(publicDir, 'favicon-32-dark.png'), fav32);

const icoOptions: IcoOptions = {
  sizes: [48],
  resizeOptions: {},
};
await sharpsToIco([sharp(png48)], join(publicDir, 'favicon.ico'), icoOptions);

console.log(
  'make-pwa-icons: wrote pwa-192.png, pwa-512.png, apple-touch-icon.png, favicon-32-*.png, favicon.ico',
);
