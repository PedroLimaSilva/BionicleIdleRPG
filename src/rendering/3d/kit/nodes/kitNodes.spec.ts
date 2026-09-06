import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_2003_NODES } from './kit2003Nodes';
import { KIT_2001_NODES } from './kit2001Nodes';
import { KIT_2004_NODES } from './kit2004Nodes';
import { sanitizeKitNodeName } from './sanitizeKitNodeName';
import {
  countKitNodeReferences,
  getKit2001NodeUsageRanking,
  getKit2003NodeUsageRanking,
  getUnusedKit2001NodeNames,
  getUnusedKit2003NodeNames,
  getUnusedKit2004NodeNames,
  getUsedKit2001NodeNames,
  getUsedKit2003NodeNames,
  getUsedKit2004NodeNames,
  KIT_2001_ATTACHMENT_MAPS,
} from './collectKitNodeUsage';
import {
  KIT_2001_MATERIAL_SLOT_EXEMPT,
  KIT_2003_MATERIAL_SLOT_EXEMPT,
  KIT_2004_MATERIAL_SLOT_EXEMPT,
} from './kitMaterialSlots';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

function readGlbRuntimeNodeNames(relativePath: string): Set<string> {
  const buffer = readFileSync(join(process.cwd(), relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as {
    nodes?: { name?: string }[];
  };
  return new Set(
    (gltf.nodes ?? []).map((node) => sanitizeKitNodeName(node.name ?? '')).filter(Boolean)
  );
}

describe('kit nodes', () => {
  test('registry values match Three.js runtime Object3D.name on kit GLBs', () => {
    const kits = [
      [KIT_2001_NODES, 'public/kit_2001.glb', KIT_2001_MATERIAL_SLOT_EXEMPT],
      [KIT_2003_NODES, 'public/kit_2003.glb', KIT_2003_MATERIAL_SLOT_EXEMPT],
      [KIT_2004_NODES, 'public/kit_2004.glb', KIT_2004_MATERIAL_SLOT_EXEMPT],
    ] as const;

    for (const [registry, glbPath, exempt] of kits) {
      const runtimeNames = readGlbRuntimeNodeNames(glbPath);
      const exemptKeys = new Set<string>(exempt);
      for (const [key, kitNodeName] of Object.entries(registry)) {
        if (exemptKeys.has(key)) continue;
        expect(runtimeNames.has(kitNodeName)).toBe(true);
      }
    }
  });

  test('every registered 2001 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2001NodeNames()).toEqual([]);
  });

  test('every registered 2003 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2003NodeNames()).toEqual([]);
  });

  test('every registered 2004 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2004NodeNames()).toEqual([]);
  });

  test('attachment kitNodeName values are registered constants', () => {
    const registered2001 = new Set(Object.values(KIT_2001_NODES));
    for (const name of getUsedKit2001NodeNames()) {
      expect(registered2001.has(name)).toBe(true);
    }

    const registered2003 = new Set(Object.values(KIT_2003_NODES));
    for (const name of getUsedKit2003NodeNames()) {
      expect(registered2003.has(name)).toBe(true);
    }

    const registered2004 = new Set(Object.values(KIT_2004_NODES));
    for (const name of getUsedKit2004NodeNames()) {
      expect(registered2004.has(name)).toBe(true);
    }
  });

  test('usage ranking counts socket references per kit node', () => {
    const socketUses = countKitNodeReferences(KIT_2001_ATTACHMENT_MAPS).get(KIT_2001_NODES.Socket);
    expect(socketUses).toBeGreaterThan(10);

    const ranking = getKit2001NodeUsageRanking();
    expect(ranking[0]?.count).toBeGreaterThanOrEqual(ranking[1]?.count ?? 0);
    expect(ranking.some((row) => row.glbName === KIT_2001_NODES.Socket)).toBe(true);
  });

  test('2003 ranking includes heavily reused Bohrok pieces', () => {
    const ranking = getKit2003NodeUsageRanking();
    const bohrokArm = ranking.find((row) => row.glbName === KIT_2003_NODES.BohrokArm);
    expect(bohrokArm?.count).toBeGreaterThan(2);
  });
});
