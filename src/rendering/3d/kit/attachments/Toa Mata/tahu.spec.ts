import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { TAHU_MATA_KIT_2001_ATTACHMENTS } from './tahu';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

function sanitizeNodeName(name: string): string {
  return name.replace(/\./g, '').replace(/ /g, '_');
}

function readGlbNodeNames(relativePath: string): Set<string> {
  const buffer = readFileSync(join(process.cwd(), 'public', relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as {
    nodes?: { name?: string }[];
  };
  return new Set(
    (gltf.nodes ?? []).map((node) => sanitizeNodeName(node.name ?? '')).filter(Boolean)
  );
}

describe('Tahu Mata kit attachments', () => {
  test('every attachment socket exists on Toa_Mata/tahu.glb after Three.js sanitization', () => {
    const sockets = readGlbNodeNames('Toa_Mata/tahu.glb');
    for (const socketName of Object.keys(TAHU_MATA_KIT_2001_ATTACHMENTS)) {
      expect(sockets.has(socketName)).toBe(true);
    }
  });

  test('socket keys are Three.js runtime names (no leftover Blender dots)', () => {
    for (const socketName of Object.keys(TAHU_MATA_KIT_2001_ATTACHMENTS)) {
      expect(socketName).not.toContain('.');
    }
  });
});
