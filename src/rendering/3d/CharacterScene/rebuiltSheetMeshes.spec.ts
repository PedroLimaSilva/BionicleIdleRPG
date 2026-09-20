import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  isRebuiltSheetMesh,
  isRebuiltSheetRenderableMesh,
  REBUILT_SHEET_BODY_MATERIAL_NAMES,
  REBUILT_SHEET_BODY_MESH,
  REBUILT_SHEET_BRAIN_MATERIAL_NAMES,
  REBUILT_SHEET_BRAIN_MESH,
  REBUILT_SHEET_RIG_NODE,
} from './rebuiltSheetMeshes';

const REBUILT_GLB = join(__dirname, '../../../../public/rebuilt.glb');

describe('rebuilt.glb packed sheet layout', () => {
  test('ships a single Matoran armature lifted so the origin stays at the feet', () => {
    const gltf = readGlbJsonFromPath(REBUILT_GLB);
    const nodes = (gltf.nodes as { name?: string; translation?: number[] }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual([REBUILT_SHEET_RIG_NODE]);
    const matoran = nodes.find((node) => node.name === REBUILT_SHEET_RIG_NODE);
    // Armature object is lifted so scene origin stays at the feet — do not zero it at runtime.
    expect(matoran?.translation?.[1]).toBeGreaterThan(1);
  });

  test('Body_Baked is the packed opaque body; Brain stays a separate mesh', () => {
    const gltf = readGlbJsonFromPath(REBUILT_GLB);
    const nodes =
      (gltf.nodes as { mesh?: number; name?: string; skin?: number }[] | undefined) ?? [];
    const body = nodes.find((node) => node.name === REBUILT_SHEET_BODY_MESH);
    const brain = nodes.find((node) => node.name === REBUILT_SHEET_BRAIN_MESH);
    expect(body?.mesh).toBeDefined();
    expect(brain?.mesh).toBeDefined();
    expect(brain?.skin).toBeDefined();

    const slots = extractGlbNodeMaterialSlots(REBUILT_GLB);
    expect(slots[REBUILT_SHEET_BODY_MESH]).toEqual([...REBUILT_SHEET_BODY_MATERIAL_NAMES].sort());
    expect(slots[REBUILT_SHEET_BRAIN_MESH]).toEqual([...REBUILT_SHEET_BRAIN_MATERIAL_NAMES].sort());
  });

  test('opaque body slots ship packed emissive and normals, without metallicRoughness', () => {
    const gltf = readGlbJsonFromPath(REBUILT_GLB);
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
    for (const name of REBUILT_SHEET_BODY_MATERIAL_NAMES) {
      const mat = byName.get(name);
      expect(mat).toBeDefined();
      expect(mat?.emissiveTexture).toBeDefined();
      expect(mat?.normalTexture).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.metallicRoughnessTexture).toBeUndefined();
      const packedName = images[imageIndex(mat?.emissiveTexture?.index) ?? -1]?.name ?? '';
      expect(packedName).toMatch(/Packed$/);
    }
  });

  test('Masks is parented to Head with a +90° X rest', () => {
    const gltf = readGlbJsonFromPath(REBUILT_GLB);
    const nodes =
      (gltf.nodes as {
        children?: number[];
        name?: string;
        rotation?: number[];
      }[]) ?? [];
    const masksIndex = nodes.findIndex((node) => node.name === 'Masks');
    const head = nodes.find((node) => node.name === 'Head');
    expect(masksIndex).toBeGreaterThanOrEqual(0);
    expect(head?.children).toContain(masksIndex);
    const masks = nodes[masksIndex];
    // +90° X ≈ (0.707, 0, 0, 0.707). Runtime does not apply the diminished −90° cancel.
    expect(masks?.rotation?.[0]).toBeCloseTo(0.707, 2);
    expect(masks?.rotation?.[3]).toBeCloseTo(0.707, 2);
  });
});

describe('rebuilt sheet mesh naming', () => {
  test('identifies Body_Baked and Brain', () => {
    expect(isRebuiltSheetMesh('Body_Baked')).toBe(true);
    expect(isRebuiltSheetMesh('Brain')).toBe(true);
    expect(isRebuiltSheetMesh('MatoranBody')).toBe(false);
  });

  test('treats skinned primitives parented under Body_Baked as sheet meshes', () => {
    const bodyGroup = {
      name: 'Body_Baked',
      parent: null,
    } as unknown as import('three').Object3D;
    const part = {
      name: 'Part-Body.002',
      parent: bodyGroup,
    } as unknown as import('three').Object3D;
    expect(isRebuiltSheetMesh(part.name)).toBe(false);
    expect(isRebuiltSheetRenderableMesh(part)).toBe(true);
  });

  test('treats Body_Baked / Brain nodes as renderable sheet meshes', () => {
    expect(isRebuiltSheetRenderableMesh({ name: 'Body_Baked' } as import('three').Object3D)).toBe(
      true
    );
    expect(isRebuiltSheetRenderableMesh({ name: 'MatoranBody' } as import('three').Object3D)).toBe(
      false
    );
  });
});
