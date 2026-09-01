/**
 * Replace a kit node mesh in a target GLB with the donor mesh (position, normal,
 * UV, indices). UV-only patching breaks when Blender adds seam vertices.
 *
 * Usage:
 *   yarn tsx scripts/patch-kit-bevel-uv.mts public/kit_2001.glb .work/blender/kit_2001_export.glb MataChest
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
};

type GltfJson = {
  accessors?: Accessor[];
  bufferViews?: { buffer: number; byteOffset: number; byteLength: number }[];
  buffers?: { byteLength: number }[];
  meshes?: { name?: string; primitives: Primitive[] }[];
  nodes?: { name?: string; mesh?: number }[];
};

type GlbParts = {
  json: GltfJson;
  bin: Buffer;
};

const COMPONENT_BYTES: Record<number, number> = {
  5120: 1,
  5121: 1,
  5122: 2,
  5123: 2,
  5125: 4,
  5126: 4,
};

const TYPE_COMPONENTS: Record<string, number> = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

function readGlb(path: string): GlbParts {
  const file = readFileSync(path);
  const jsonLen = file.readUInt32LE(12);
  // GLB JSON chunks are 4-byte padded with 0x00; trim so JSON.parse succeeds.
  const jsonText = file
    .slice(20, 20 + jsonLen)
    .toString('utf8')
    .replace(/\0+$/, '');
  const json = JSON.parse(jsonText) as GltfJson;
  const bin = file.slice(20 + jsonLen + 8);
  return { json, bin };
}

function writeGlb(path: string, json: GltfJson, bin: Buffer): void {
  const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
  // Pad with ASCII space so chunk length includes padding but JSON.parse still works.
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
  const componentBytes = COMPONENT_BYTES[acc.componentType];
  const typeComponents = TYPE_COMPONENTS[acc.type];
  return acc.count * componentBytes * typeComponents;
}

function copyAccessor(
  donor: GlbParts,
  target: GlbParts,
  donorAccessorIdx: number
): number {
  const donorAcc = donor.json.accessors![donorAccessorIdx];
  const donorView = donor.json.bufferViews![donorAcc.bufferView!];
  const byteOffset = (donorView.byteOffset ?? 0) + (donorAcc.byteOffset ?? 0);
  const byteLength = accessorByteLength(donor.json, donorAccessorIdx);
  const slice = donor.bin.subarray(byteOffset, byteOffset + byteLength);

  const targetBinOffset = target.bin.length;
  const paddedLen = byteLength + ((4 - (byteLength % 4)) % 4);
  target.bin = Buffer.concat([target.bin, slice, Buffer.alloc(paddedLen - byteLength)]);

  const bufferViewIdx = target.json.bufferViews!.length;
  target.json.bufferViews!.push({
    buffer: 0,
    byteOffset: targetBinOffset,
    byteLength,
  });

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

function meshIndexForNode(json: GltfJson, nodeName: string): number {
  const node = json.nodes?.find((n) => n.name === nodeName);
  if (!node || node.mesh === undefined) {
    throw new Error(`Node not found or has no mesh: ${nodeName}`);
  }
  return node.mesh;
}

function copyMeshFromDonor(donor: GlbParts, target: GlbParts, nodeName: string): void {
  const donorMeshIdx = meshIndexForNode(donor.json, nodeName);
  const targetMeshIdx = meshIndexForNode(target.json, nodeName);
  const donorPrim = donor.json.meshes![donorMeshIdx].primitives[0];
  const targetPrim = target.json.meshes![targetMeshIdx].primitives[0];
  const donorMeshName = donor.json.meshes![donorMeshIdx].name;

  const nextPrim: Primitive = { attributes: {} };
  for (const [attr, donorAccIdx] of Object.entries(donorPrim.attributes)) {
    nextPrim.attributes[attr] = copyAccessor(donor, target, donorAccIdx);
  }
  if (donorPrim.indices !== undefined) {
    nextPrim.indices = copyAccessor(donor, target, donorPrim.indices);
  }
  if (donorPrim.mode !== undefined) {
    nextPrim.mode = donorPrim.mode;
  }
  if (donorPrim.material !== undefined) {
    nextPrim.material = donorPrim.material;
  } else if (targetPrim.material !== undefined) {
    nextPrim.material = targetPrim.material;
  }

  target.json.meshes![targetMeshIdx] = {
    name: donorMeshName,
    primitives: [nextPrim],
  };

  const counts = Object.fromEntries(
    Object.entries(nextPrim.attributes).map(([k, v]) => [k, target.json.accessors![v].count])
  );
  console.log(`patched ${nodeName}:`, counts);
}

const [targetPath, donorPath, ...nodeNames] = process.argv.slice(2);
if (!targetPath || !donorPath || nodeNames.length === 0) {
  console.error(
    'Usage: yarn tsx scripts/patch-kit-bevel-uv.mts <target.glb> <donor.glb> <NodeName> [...]'
  );
  process.exit(1);
}

const target = readGlb(targetPath);
const donor = readGlb(donorPath);

for (const name of nodeNames) {
  copyMeshFromDonor(donor, target, name);
}

writeGlb(targetPath, target.json, target.bin);
console.log('wrote', targetPath);
