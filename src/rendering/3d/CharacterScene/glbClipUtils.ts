import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

/** Repo root `public/` relative to this module (`src/rendering/3d/CharacterScene/`). */
export const PUBLIC_DIR = join(__dirname, '../../../../public');

/** Reads clip names out of a GLB's JSON chunk without decoding any geometry. */
export function readGlbClipNames(relativePath: string, publicDir: string = PUBLIC_DIR): string[] {
  const buffer = readFileSync(join(publicDir, relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString());
  return (gltf.animations ?? []).map((animation: { name: string }) => animation.name);
}
