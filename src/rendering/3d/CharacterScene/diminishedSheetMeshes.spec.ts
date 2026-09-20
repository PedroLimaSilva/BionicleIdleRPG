import { Object3D } from 'three';
import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  alignDiminishedMaskSocket,
  DIMINISHED_MASK_SOCKET_ROTATION,
  DIMINISHED_SHEET_BODY_MATERIAL_NAMES,
  DIMINISHED_SHEET_BODY_MESH,
  DIMINISHED_SHEET_BRAIN_MATERIAL_NAMES,
  DIMINISHED_SHEET_BRAIN_MESH,
  DIMINISHED_SHEET_RIG_NODE,
} from './diminishedSheetMeshes';

const MATORAN_GLB = join(__dirname, '../../../../public/matoran_master.glb');

describe('matoran_master.glb sheet layout', () => {
  test('ships a single Matoran armature lifted so the origin stays at the feet', () => {
    const gltf = readGlbJsonFromPath(MATORAN_GLB);
    const nodes = (gltf.nodes as { name?: string; translation?: number[] }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual([DIMINISHED_SHEET_RIG_NODE]);
    const matoran = nodes.find((node) => node.name === DIMINISHED_SHEET_RIG_NODE);
    // Armature object is lifted so scene origin stays at the feet — do not zero it at runtime.
    expect(matoran?.translation?.[1]).toBeGreaterThan(1);
  });

  test('Body is one skinned mesh with baked body / face / feet slots', () => {
    const gltf = readGlbJsonFromPath(MATORAN_GLB);
    const nodes =
      (gltf.nodes as { mesh?: number; name?: string; skin?: number }[] | undefined) ?? [];
    const skinned = nodes.filter((node) => node.skin !== undefined);
    expect(skinned).toHaveLength(1);
    expect(skinned[0]?.name).toBe(DIMINISHED_SHEET_BODY_MESH);

    const slots = extractGlbNodeMaterialSlots(MATORAN_GLB);
    expect(slots[DIMINISHED_SHEET_BODY_MESH]).toEqual(
      [...DIMINISHED_SHEET_BODY_MATERIAL_NAMES].sort()
    );
    expect(slots[DIMINISHED_SHEET_BRAIN_MESH]).toEqual(
      [...DIMINISHED_SHEET_BRAIN_MATERIAL_NAMES].sort()
    );
  });

  test('opaque baked slots ship packed emissive (R roughness, G metalness, B wear) and normals', () => {
    const gltf = readGlbJsonFromPath(MATORAN_GLB);
    const materials =
      (gltf.materials as {
        emissiveTexture?: { index: number };
        name?: string;
        normalTexture?: { index: number };
        pbrMetallicRoughness?: {
          baseColorTexture?: { index: number };
        };
      }[]) ?? [];
    const images = (gltf.images as { name?: string }[]) ?? [];
    const textures =
      (gltf.textures as {
        extensions?: { EXT_texture_webp?: { source: number } };
        source?: number;
      }[]) ?? [];
    const imageIndex = (textureIndex: number | undefined): number | undefined => {
      if (textureIndex === undefined) return undefined;
      const texture = textures[textureIndex];
      return texture?.extensions?.EXT_texture_webp?.source ?? texture?.source;
    };
    const byName = new Map(materials.map((mat) => [mat.name, mat]));
    for (const name of DIMINISHED_SHEET_BODY_MATERIAL_NAMES) {
      const mat = byName.get(name);
      expect(mat).toBeDefined();
      expect(mat?.emissiveTexture).toBeDefined();
      expect(mat?.normalTexture).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.baseColorTexture).toBeUndefined();
      const packedName = images[imageIndex(mat?.emissiveTexture?.index) ?? -1]?.name ?? '';
      expect(packedName).toMatch(/Packed$/);
    }
  });

  test('Masks is parented to Head with a +90° X rest, which Kanohi must cancel', () => {
    const gltf = readGlbJsonFromPath(MATORAN_GLB);
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
    // +90° X ≈ (0.707, 0, 0, 0.707). Head already has the same rest.
    expect(masks?.rotation?.[0]).toBeCloseTo(0.707, 2);
    expect(masks?.rotation?.[3]).toBeCloseTo(0.707, 2);
  });
});

describe('diminished mask socket', () => {
  test('applies the MataFace −90° X cancel so Kanohi are not flipped', () => {
    const masks = new Object3D();
    masks.rotation.set(Math.PI / 2, 0, 0);
    alignDiminishedMaskSocket(masks);
    expect(masks.rotation.x).toBeCloseTo(DIMINISHED_MASK_SOCKET_ROTATION.x);
    expect(masks.rotation.y).toBe(0);
    expect(masks.rotation.z).toBe(0);
  });
});
