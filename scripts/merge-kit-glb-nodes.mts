/**
 * Copy named kit nodes (mesh + scene placement) from a donor GLB into a target GLB.
 * Use to preserve nodes that exist in the shipped kit but not in a fresh Blender export
 * (e.g. TahuSwordFlame).
 *
 * Usage:
 *   yarn tsx scripts/merge-kit-glb-nodes.mts public/kit_2001.glb donor.glb TahuSwordFlame [...]
 */
import { readFileSync, writeFileSync } from 'node:fs';

type Accessor = {
  bufferView?: number;
  byteOffset?: number;
  componentType: number;
  count: number;
  type: string;
  normalized?: boolean;
  max?: number[];
  min?: number[];
};

type Primitive = {
  attributes: Record<string, number>;
  indices?: number;
  mode?: number;
  material?: number;
  extensions?: Record<string, unknown>;
};

type GltfJson = {
  accessors?: Accessor[];
  bufferViews?: { buffer: number; byteOffset: number; byteLength: number }[];
  buffers?: { byteLength: number }[];
  materials?: unknown[];
  meshes?: { name?: string; primitives: Primitive[] }[];
  nodes?: {
    name?: string;
    mesh?: number;
    children?: number[];
    translation?: number[];
    rotation?: number[];
    scale?: number[];
  }[];
  scenes?: { nodes?: number[] }[];
};

type GlbParts = { json: GltfJson; bin: Buffer };

const COMPONENT_BYTES: Record<number, number> = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4,
};
const TYPE_COMPONENTS: Record<string, number> = {
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
};

function readGlb(path: string): GlbParts {
  const file = readFileSync(path);
  const jsonLen = file.readUInt32LE(12);
  const jsonText = file
    .slice(20, 20 + jsonLen)
    .toString('utf8')
    .replace(/\0+$/, '');
  const json = JSON.parse(jsonText) as GltfJson;
  const bin = file.slice(20 + jsonLen + 8);
  return { bin, json };
}

function writeGlb(path: string, json: GltfJson, bin: Buffer): void {
  const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
  const jsonChunk = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);
  const binPad = (4 - (bin.length % 4)) % 4;
  const totalLen = 12 + 8 + jsonChunk.length + 8 + bin.length + binPad;
  const out = Buffer.alloc(totalLen);
  let o = 0;
  out.writeUInt32LE(0x46546c67, o);
  o += 4;
  out.writeUInt32LE(2, o);
  o += 4;
  out.writeUInt32LE(totalLen, o);
  o += 4;
  out.writeUInt32LE(jsonChunk.length, o);
  o += 4;
  out.writeUInt32LE(0x4e4f534a, o);
  o += 4;
  jsonChunk.copy(out, o);
  o += jsonChunk.length;
  out.writeUInt32LE(bin.length + binPad, o);
  o += 4;
  out.writeUInt32LE(0x004e4942, o);
  o += 4;
  bin.copy(out, o);
  writeFileSync(path, out);
}

function accessorByteLength(json: GltfJson, accessorIdx: number): number {
  const acc = json.accessors![accessorIdx];
  return acc.count * COMPONENT_BYTES[acc.componentType] * TYPE_COMPONENTS[acc.type];
}

function copyAccessor(donor: GlbParts, target: GlbParts, donorAccessorIdx: number): number {
  const donorAcc = donor.json.accessors![donorAccessorIdx];
  const donorView = donor.json.bufferViews![donorAcc.bufferView!];
  const byteOffset = (donorView.byteOffset ?? 0) + (donorAcc.byteOffset ?? 0);
  const byteLength = accessorByteLength(donor.json, donorAccessorIdx);
  const slice = donor.bin.subarray(byteOffset, byteOffset + byteLength);
  const targetBinOffset = target.bin.length;
  const paddedLen = byteLength + ((4 - (byteLength % 4)) % 4);
  target.bin = Buffer.concat([target.bin, slice, Buffer.alloc(paddedLen - byteLength)]);
  const bufferViewIdx = target.json.bufferViews!.length;
  target.json.bufferViews!.push({ buffer: 0, byteLength, byteOffset: targetBinOffset });
  const accessorIdx = target.json.accessors!.length;
  const next: Accessor = {
    bufferView: bufferViewIdx,
    componentType: donorAcc.componentType,
    count: donorAcc.count,
    type: donorAcc.type,
  };
  if (donorAcc.normalized !== undefined) next.normalized = donorAcc.normalized;
  if (donorAcc.max) next.max = [...donorAcc.max];
  if (donorAcc.min) next.min = [...donorAcc.min];
  target.json.accessors!.push(next);
  target.json.buffers![0].byteLength = target.bin.length;
  return accessorIdx;
}

function copyMesh(donor: GlbParts, target: GlbParts, meshIdx: number): number {
  const donorMesh = donor.json.meshes![meshIdx];
  const primitives = donorMesh.primitives.map((prim) => {
    const next: Primitive = { attributes: {} };
    for (const [attr, accIdx] of Object.entries(prim.attributes)) {
      next.attributes[attr] = copyAccessor(donor, target, accIdx);
    }
    if (prim.indices !== undefined) next.indices = copyAccessor(donor, target, prim.indices);
    if (prim.mode !== undefined) next.mode = prim.mode;
    if (prim.material !== undefined) next.material = prim.material;
    if (prim.extensions) next.extensions = structuredClone(prim.extensions);
    return next;
  });
  const meshIndex = target.json.meshes!.length;
  target.json.meshes!.push({ name: donorMesh.name, primitives });
  return meshIndex;
}

function nodeIndexByName(json: GltfJson, name: string): number {
  const idx = json.nodes!.findIndex((n) => n.name === name);
  if (idx < 0) throw new Error(`Node not found: ${name}`);
  return idx;
}

function mergeNode(donor: GlbParts, target: GlbParts, nodeName: string): void {
  if (target.json.nodes!.some((n) => n.name === nodeName)) {
    console.log(`skip ${nodeName}: already in target`);
    return;
  }
  const donorNodeIdx = nodeIndexByName(donor.json, nodeName);
  const donorNode = donor.json.nodes![donorNodeIdx];
  const nextNode: typeof donorNode = { name: nodeName };
  if (donorNode.translation) nextNode.translation = [...donorNode.translation];
  if (donorNode.rotation) nextNode.rotation = [...donorNode.rotation];
  if (donorNode.scale) nextNode.scale = [...donorNode.scale];
  if (donorNode.mesh !== undefined) {
    nextNode.mesh = copyMesh(donor, target, donorNode.mesh);
  }
  const nodeIdx = target.json.nodes!.length;
  target.json.nodes!.push(nextNode);
  target.json.scenes![0].nodes!.push(nodeIdx);
  console.log(`merged ${nodeName} -> node ${nodeIdx}`);
}

const [targetPath, donorPath, ...nodeNames] = process.argv.slice(2);
if (!targetPath || !donorPath || nodeNames.length === 0) {
  console.error(
    'Usage: yarn tsx scripts/merge-kit-glb-nodes.mts <target.glb> <donor.glb> <NodeName> [...]'
  );
  process.exit(1);
}

const target = readGlb(targetPath);
const donor = readGlb(donorPath);
for (const name of nodeNames) mergeNode(donor, target, name);
writeGlb(targetPath, target.json, target.bin);
console.log('wrote', targetPath);
