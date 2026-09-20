import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  isKopakaSheetMesh,
  isKopakaSheetRenderableMesh,
  KOPAKA_SHEET_BODY_MATERIAL_NAMES,
  KOPAKA_SHEET_BODY_MESH,
  KOPAKA_SHEET_BRAIN_MATERIAL_NAMES,
  KOPAKA_SHEET_BRAIN_MESH,
  KOPAKA_SHEET_RIG_NODE,
  KOPAKA_SHEET_SWORD_MATERIAL_NAMES,
  KOPAKA_SHEET_SWORD_MESH,
} from './kopakaSheetMeshes';

const KOPAKA_GLB = join(__dirname, '../../../../public/Toa_Mata/kopaka.glb');

describe('Toa_Mata/kopaka.glb skinned sheet layout', () => {
  test('ships a single Kopaka armature with Body / Brain / Sword meshes', () => {
    const gltf = readGlbJsonFromPath(KOPAKA_GLB);
    const nodes = (gltf.nodes as { name?: string; translation?: number[] }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual([KOPAKA_SHEET_RIG_NODE]);
    const kopaka = nodes.find((node) => node.name === KOPAKA_SHEET_RIG_NODE);
    expect(kopaka?.translation?.[1]).toBeGreaterThan(1);
  });

  test('Body is one skinned mesh with baked slots; Brain and Sword stay separate', () => {
    const slots = extractGlbNodeMaterialSlots(KOPAKA_GLB);
    expect(slots[KOPAKA_SHEET_BODY_MESH]).toEqual([...KOPAKA_SHEET_BODY_MATERIAL_NAMES].sort());
    expect(slots[KOPAKA_SHEET_BRAIN_MESH]).toEqual([...KOPAKA_SHEET_BRAIN_MATERIAL_NAMES].sort());
    expect(slots[KOPAKA_SHEET_SWORD_MESH]).toEqual([...KOPAKA_SHEET_SWORD_MATERIAL_NAMES].sort());
  });

  test('opaque body slots ship packed emissive and normals, without metallicRoughness', () => {
    const gltf = readGlbJsonFromPath(KOPAKA_GLB);
    const images = (gltf.images as { name?: string }[] | undefined) ?? [];
    const textures =
      (gltf.textures as
        | { extensions?: { EXT_texture_webp?: { source?: number } }; source?: number }[]
        | undefined) ?? [];
    const materials =
      (gltf.materials as {
        emissiveTexture?: { index: number };
        name?: string;
        normalTexture?: { index: number };
        pbrMetallicRoughness?: { metallicRoughnessTexture?: { index: number } };
      }[]) ?? [];
    const imageIndex = (textureIndex: number | undefined): number | undefined => {
      if (textureIndex === undefined) return undefined;
      const texture = textures[textureIndex];
      return texture?.extensions?.EXT_texture_webp?.source ?? texture?.source;
    };
    const byName = new Map(materials.map((mat) => [mat.name, mat]));
    for (const name of KOPAKA_SHEET_BODY_MATERIAL_NAMES) {
      const mat = byName.get(name);
      expect(mat).toBeDefined();
      expect(mat?.emissiveTexture).toBeDefined();
      expect(mat?.normalTexture).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.metallicRoughnessTexture).toBeUndefined();
      const packedName = images[imageIndex(mat?.emissiveTexture?.index) ?? -1]?.name ?? '';
      expect(packedName).toMatch(/Packed$/);
    }
  });
});

describe('kopaka sheet mesh naming', () => {
  test('identifies the three skinned sheet meshes', () => {
    expect(isKopakaSheetMesh('Body')).toBe(true);
    expect(isKopakaSheetMesh('Brain')).toBe(true);
    expect(isKopakaSheetMesh('Sword')).toBe(true);
    expect(isKopakaSheetMesh('MataChest')).toBe(false);
  });

  test('treats skinned primitives parented under Body as sheet meshes', () => {
    const bodyGroup = {
      name: 'Body',
      parent: null,
    } as unknown as import('three').Object3D;
    const part = {
      name: 'Part-Evanetic__kit1-6_dot_1_dot_dat003',
      parent: bodyGroup,
    } as unknown as import('three').Object3D;
    expect(isKopakaSheetMesh(part.name)).toBe(false);
    expect(isKopakaSheetRenderableMesh(part)).toBe(true);
  });

  test('treats Body / Brain / Sword nodes as renderable sheet meshes', () => {
    expect(isKopakaSheetRenderableMesh({ name: 'Body' } as import('three').Object3D)).toBe(true);
    expect(isKopakaSheetRenderableMesh({ name: 'MataChest' } as import('three').Object3D)).toBe(
      false
    );
  });
});
