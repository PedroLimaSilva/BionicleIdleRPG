import { TAHU_MATA_KIT_2001_ATTACHMENTS } from './attachments/Toa Mata/tahu';
import {
  buildSelectiveKitCacheKey,
  collectAllowedTextureIndices,
  collectMaterialIndicesForKitNodes,
  collectRequiredKitNodes,
  collectTextureIndicesForMaterials,
  hashRequiredKitNodes,
  resolveKitGltfUrl,
  type KitGltfJson,
} from './selectiveKitTextureSelection';

const SAMPLE_JSON: KitGltfJson = {
  materials: [
    {
      emissiveTexture: { index: 0 },
      normalTexture: { index: 1 },
    },
    {
      emissiveTexture: { index: 2 },
      normalTexture: { index: 3 },
    },
    {
      pbrMetallicRoughness: { baseColorTexture: { index: 4 } },
    },
    {
      emissiveTexture: { index: 5 },
      normalTexture: { index: 6 },
    },
  ],
  meshes: [
    { primitives: [{ material: 0 }] },
    { primitives: [{ material: 1 }, { material: 2 }] },
    { primitives: [{ material: 3 }] },
  ],
  nodes: [
    { mesh: 0, name: 'MataChest' },
    { mesh: 1, name: 'MataFoot' },
    { mesh: 2, name: 'UnusedPart' },
  ],
};

describe('collectRequiredKitNodes', () => {
  it('returns unique kit node names from an attachment map', () => {
    const nodes = collectRequiredKitNodes(TAHU_MATA_KIT_2001_ATTACHMENTS);
    expect(nodes.has('MataChest')).toBe(true);
    expect(nodes.has('TahuSword')).toBe(true);
    expect(nodes.has('MataChest')).toBe(true);
    expect(nodes.size).toBeGreaterThan(20);
  });
});

describe('collectAllowedTextureIndices', () => {
  it('only includes textures for required kit nodes', () => {
    const required = new Set(['MataChest', 'MataFoot']);
    const allowed = collectAllowedTextureIndices(SAMPLE_JSON, required);
    expect(allowed).toEqual(new Set([0, 1, 2, 3, 4]));
    expect(allowed.has(5)).toBe(false);
    expect(allowed.has(6)).toBe(false);
  });

  it('returns an empty set when no nodes match', () => {
    expect(collectAllowedTextureIndices(SAMPLE_JSON, new Set(['Missing']))).toEqual(new Set());
  });
});

describe('collectMaterialIndicesForKitNodes', () => {
  it('collects all materials on matched meshes', () => {
    const materials = collectMaterialIndicesForKitNodes(SAMPLE_JSON, new Set(['MataFoot']));
    expect(materials).toEqual(new Set([1, 2]));
  });
});

describe('collectTextureIndicesForMaterials', () => {
  it('collects emissive, normal, and base color texture indices', () => {
    const textures = collectTextureIndicesForMaterials(SAMPLE_JSON, new Set([1, 2]));
    expect(textures).toEqual(new Set([2, 3, 4]));
  });
});

describe('selective kit cache keys', () => {
  it('builds stable hashed cache keys and resolves fetch URLs', () => {
    const url = '/BionicleIdleRPG/kit_2001.glb';
    const key = buildSelectiveKitCacheKey(url, ['MataChest', 'MataFoot']);
    expect(key.startsWith(url + '#kitnodes=')).toBe(true);
    expect(resolveKitGltfUrl(key)).toBe(url);
    expect(hashRequiredKitNodes(['B', 'A'])).toBe(hashRequiredKitNodes(['A', 'B']));
  });
});
