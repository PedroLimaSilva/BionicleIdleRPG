import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  attachBohrokSwarmShields,
  bohrokSheetBreedName,
  BOHROK_SHEET_BODY_MATERIAL_NAMES,
  BOHROK_SHEET_BODY_MESH,
  BOHROK_SHEET_EYES_MATERIAL_NAMES,
  BOHROK_SHEET_EYES_MESH,
  BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES,
  BOHROK_SHEET_FACEPLATE_MESH,
  BOHROK_SHEET_KRANA_MATERIAL_NAMES,
  BOHROK_SHEET_KRANA_MESH,
  BOHROK_SHEET_RIG_NODE,
  BOHROK_SHEET_SHIELD_MATERIAL_NAMES,
  BOHROK_SHEET_SHIELD_MESHES,
  BOHROK_SHEET_SHIELD_SOCKETS,
  BOHROK_SHEET_SWARMS_MATERIAL,
  isBohrokSheetShieldMesh,
} from './bohrokSheetMeshes';

const BOHROK_GLB = join(__dirname, '../../../../public/Bohrok.glb');

describe('Bohrok.glb packed swarm layout', () => {
  test('ships a single Bohrok armature', () => {
    const gltf = readGlbJsonFromPath(BOHROK_GLB);
    const nodes = (gltf.nodes as { name?: string }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual([BOHROK_SHEET_RIG_NODE]);
  });

  test('Body_Baked, faceplate, eyes, and Krana are skinned; shields stay rigid', () => {
    const gltf = readGlbJsonFromPath(BOHROK_GLB);
    const nodes =
      (gltf.nodes as { mesh?: number; name?: string; skin?: number }[] | undefined) ?? [];
    const byName = new Map(nodes.map((node) => [node.name, node]));
    expect(byName.get(BOHROK_SHEET_BODY_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_FACEPLATE_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_EYES_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_KRANA_MESH)?.skin).toBeDefined();
    for (const name of BOHROK_SHEET_SHIELD_MESHES) {
      expect(byName.get(name)?.mesh).toBeDefined();
      expect(byName.get(name)?.skin).toBeUndefined();
    }
    for (const socket of BOHROK_SHEET_SHIELD_SOCKETS) {
      expect(byName.get(socket)).toBeDefined();
    }

    const slots = extractGlbNodeMaterialSlots(BOHROK_GLB);
    expect(slots[BOHROK_SHEET_BODY_MESH]).toEqual([...BOHROK_SHEET_BODY_MATERIAL_NAMES].sort());
    expect(slots[BOHROK_SHEET_EYES_MESH]).toEqual([...BOHROK_SHEET_EYES_MATERIAL_NAMES].sort());
    expect(slots[BOHROK_SHEET_FACEPLATE_MESH]).toEqual(
      [...BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES].sort()
    );
    expect(slots[BOHROK_SHEET_KRANA_MESH]).toEqual([...BOHROK_SHEET_KRANA_MATERIAL_NAMES].sort());
    for (const name of BOHROK_SHEET_SHIELD_MESHES) {
      expect(slots[name]).toEqual([...BOHROK_SHEET_SHIELD_MATERIAL_NAMES].sort());
    }
  });

  test('opaque body and swarm slots ship packed emissive and normals, without metallicRoughness', () => {
    const gltf = readGlbJsonFromPath(BOHROK_GLB);
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
    for (const name of [...BOHROK_SHEET_BODY_MATERIAL_NAMES, BOHROK_SHEET_SWARMS_MATERIAL]) {
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

describe('packed swarm shield attach', () => {
  test('bohrokSheetBreedName maps dex ids onto mesh names', () => {
    expect(bohrokSheetBreedName('gahlok')).toBe('Gahlok');
    expect(bohrokSheetBreedName('tahnok_kal')).toBe('Tahnok');
    expect(isBohrokSheetShieldMesh('Pahrak')).toBe(true);
    expect(isBohrokSheetShieldMesh('Body_Baked')).toBe(false);
  });

  test('hides every authored shield and instances the breed onto both sockets', () => {
    const root = new Group();
    root.name = 'Bohrok';
    const left = new Group();
    left.name = 'Shield_L';
    const right = new Group();
    right.name = 'Shield_R';
    const tahnok = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Swarms_Baked' }));
    tahnok.name = 'Tahnok';
    const gahlok = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Swarms_Baked' }));
    gahlok.name = 'Gahlok';
    root.add(left, right, tahnok, gahlok);

    const clones = attachBohrokSwarmShields(root, 'Gahlok');

    expect(tahnok.visible).toBe(false);
    expect(gahlok.visible).toBe(false);
    expect(clones).toHaveLength(2);
    expect(clones[0]?.parent).toBe(left);
    expect(clones[1]?.parent).toBe(right);
    expect(clones.every((clone) => clone.visible)).toBe(true);
    expect(clones.every((clone) => clone.name === 'Gahlok')).toBe(true);
  });
});
