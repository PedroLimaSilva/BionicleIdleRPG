import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * `useIdleAnimation` looks its idle action up by clip name and silently returns
 * when the name is absent, so a re-export that renames (or drops) the idle clip
 * leaves the rig frozen in its bind pose with no console warning. These are the
 * names each CharacterScene model asks for, checked against the shipped GLBs.
 */
const REQUIRED_IDLE_CLIPS: Record<string, string> = {
  'Toa_Mata/gali.glb': 'Idle',
  'Toa_Mata/kopaka.glb': 'Idle',
  'Toa_Mata/lewa.glb': 'Idle',
  'Toa_Mata/onua.glb': 'Idle',
  'Toa_Mata/pohatu.glb': 'Idle',
  'Toa_Mata/tahu.glb': 'Idle',
  'Toa_Metru/Lhikan.glb': 'Idle',
  'Toa_Nuva/gali.glb': 'Idle',
  'Toa_Nuva/kopaka.glb': 'Idle',
  'Toa_Nuva/lewa.glb': 'Idle',
  'Toa_Nuva/onua.glb': 'Idle',
  'Toa_Nuva/pohatu.glb': 'Idle',
  'Toa_Nuva/tahu.glb': 'Idle',
  'Toa_Nuva/takanuva.glb': 'Idle',
  'bohrok_master.glb': 'Idle',
  'matoran_master.glb': 'Idle',
  'matoran_metru.glb': 'Idle',
  // RahkshiModel swaps between 'Empty' (no Kraata) and 'Idle' (glow complete).
  'rahkshi.glb': 'Empty',
  'rebuilt.glb': 'Idle',
};

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

/** Reads clip names out of a GLB's JSON chunk without decoding any geometry. */
function readClipNames(relativePath: string): string[] {
  const buffer = readFileSync(join(__dirname, '../../../public', relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString());
  return (gltf.animations ?? []).map((animation: { name: string }) => animation.name);
}

describe('character rig idle clips', () => {
  test.each(Object.entries(REQUIRED_IDLE_CLIPS))('%s exposes a "%s" clip', (glb, clipName) => {
    expect(readClipNames(glb)).toContain(clipName);
  });

  test('Toa Lhikan drives his idle through the shared pipeline, not a bespoke clip name', () => {
    expect(readClipNames('Toa_Metru/Lhikan.glb')).toEqual(['Idle']);
  });
});
