import { readFileSync } from 'node:fs';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

/** Reads the JSON chunk from a GLB without decoding Draco meshes. */
export function readGlbJsonFromPath(path: string): Record<string, unknown> {
  const buffer = readFileSync(path);
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  return JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as Record<
    string,
    unknown
  >;
}

export type GlbNodeMaterialSlots = Readonly<Record<string, readonly string[]>>;

/** Material `.name` values on each mesh node in a kit GLB. */
export function extractGlbNodeMaterialSlots(glbPath: string): GlbNodeMaterialSlots {
  const gltf = readGlbJsonFromPath(glbPath);
  const materials = ((gltf.materials as { name?: string }[] | undefined) ?? []).map(
    (material, index) => material.name ?? `mat_${index}`
  );
  const meshes = (gltf.meshes as { primitives?: { material?: number }[] }[] | undefined) ?? [];
  const nodes = (gltf.nodes as { name?: string; mesh?: number }[] | undefined) ?? [];

  const result: Record<string, string[]> = {};
  for (const node of nodes) {
    if (node.mesh === undefined || !node.name) continue;
    const mesh = meshes[node.mesh];
    const slots = new Set<string>();
    for (const primitive of mesh?.primitives ?? []) {
      if (primitive.material === undefined) continue;
      slots.add(materials[primitive.material] ?? 'unknown');
    }
    if (slots.size > 0) {
      result[node.name] = [...slots].sort();
    }
  }
  return result;
}
