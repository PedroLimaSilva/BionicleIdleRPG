import { DataTexture, LinearFilter, RepeatWrapping } from 'three';
import { createSeededRandom } from './seededRandom';

/** Fixed seed so wear / weathered noise textures are stable across reloads and in tests. */
export const DEFAULT_WEAR_NOISE_TEXTURE_SEED = 0x8f3c2a1b;

const NOISE_SIZE = 128;

/**
 * Builds a tileable grayscale noise `DataTexture` from a seeded PRNG grid.
 * Same seed always produces identical texel data.
 */
export function createTileableNoiseTexture(
  seed: number = DEFAULT_WEAR_NOISE_TEXTURE_SEED
): DataTexture {
  const size = NOISE_SIZE;
  const next = createSeededRandom(seed);
  const grid: number[] = [];
  for (let i = 0; i < size * size; i++) grid.push(next());
  const sample = (ix: number, iy: number) => grid[(iy % size) * size + (ix % size)];
  const data = new Uint8Array(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = i + 0.5;
      const y = j + 0.5;
      const i0 = Math.floor(x) % size;
      const i1 = (i0 + 1) % size;
      const j0 = Math.floor(y) % size;
      const j1 = (j0 + 1) % size;
      const fx = x - Math.floor(x);
      const fy = y - Math.floor(y);
      const v =
        (1 - fx) * (1 - fy) * sample(i0, j0) +
        fx * (1 - fy) * sample(i1, j0) +
        (1 - fx) * fy * sample(i0, j1) +
        fx * fy * sample(i1, j1);
      const idx = (j * size + i) * 4;
      const byte = Math.floor(v * 255);
      data[idx] = data[idx + 1] = data[idx + 2] = byte;
      data[idx + 3] = 255;
    }
  }
  const tex = new DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.minFilter = tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}
