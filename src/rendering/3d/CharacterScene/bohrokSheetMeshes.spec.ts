import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  attachBohrokSheetAccessories,
  bohrokSheetBreedName,
  bohrokSheetShieldMeshName,
  BOHROK_SHEET_BODY_MATERIAL_NAMES,
  BOHROK_SHEET_BODY_MESH,
  BOHROK_SHEET_EYES_MATERIAL_NAMES,
  BOHROK_SHEET_EYES_MESH,
  BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES,
  BOHROK_SHEET_FACEPLATE_MESH,
  BOHROK_SHEET_KAL_BODY_MATERIAL_NAMES,
  BOHROK_SHEET_KAL_BODY_MESH,
  BOHROK_SHEET_KAL_FACEPLATE_MATERIAL_NAMES,
  BOHROK_SHEET_KAL_FACEPLATE_MESH,
  BOHROK_SHEET_KAL_SHIELD_MATERIAL_NAMES,
  BOHROK_SHEET_KAL_SHIELD_MESHES,
  BOHROK_SHEET_KRANA_MATERIAL_NAMES,
  BOHROK_SHEET_KRANA_MESH,
  BOHROK_SHEET_RIG_NODE,
  BOHROK_SHEET_SHIELD_MATERIAL_NAMES,
  BOHROK_SHEET_SHIELD_MESHES,
  BOHROK_SHEET_SHIELD_SOCKETS,
  BOHROK_SHEET_SWARMS_MATERIAL,
  BOHROK_SHEET_SYMBOL_MESHES,
  BOHROK_SHEET_SYMBOL_PARENT,
  bohrokSheetRuntimeName,
  isBohrokSheetShieldMesh,
  setBohrokSheetVariant,
} from './bohrokSheetMeshes';

const BOHROK_GLB = join(__dirname, '../../../../public/Bohrok.glb');

describe('Bohrok.glb packed swarm + Kal layout', () => {
  test('ships the Bohrok armature plus breed accessory roots', () => {
    const gltf = readGlbJsonFromPath(BOHROK_GLB);
    const nodes = (gltf.nodes as { name?: string }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots[0]).toBe(BOHROK_SHEET_RIG_NODE);
    expect(sceneRoots).toEqual(
      expect.arrayContaining([
        BOHROK_SHEET_RIG_NODE,
        ...BOHROK_SHEET_SHIELD_MESHES,
        ...BOHROK_SHEET_KAL_SHIELD_MESHES,
      ])
    );
    expect(sceneRoots).not.toEqual(expect.arrayContaining([...BOHROK_SHEET_SYMBOL_MESHES]));
  });

  test('chassis and faceplates are skinned; shields stay rigid', () => {
    const gltf = readGlbJsonFromPath(BOHROK_GLB);
    const nodes =
      (gltf.nodes as { mesh?: number; name?: string; skin?: number }[] | undefined) ?? [];
    const byName = new Map(nodes.map((node) => [node.name, node]));
    expect(byName.get(BOHROK_SHEET_BODY_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_KAL_BODY_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_FACEPLATE_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_KAL_FACEPLATE_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_EYES_MESH)?.skin).toBeDefined();
    expect(byName.get(BOHROK_SHEET_KRANA_MESH)?.skin).toBeDefined();
    for (const name of [...BOHROK_SHEET_SHIELD_MESHES, ...BOHROK_SHEET_KAL_SHIELD_MESHES]) {
      expect(byName.get(name)?.mesh).toBeDefined();
      expect(byName.get(name)?.skin).toBeUndefined();
    }
    for (const socket of BOHROK_SHEET_SHIELD_SOCKETS) {
      expect(byName.get(socket)).toBeDefined();
    }
    expect(byName.get(BOHROK_SHEET_SYMBOL_PARENT)).toBeDefined();
    const parentOf = new Map<string, string>();
    nodes.forEach((node) => {
      for (const child of (node as { children?: number[] }).children ?? []) {
        const childName = nodes[child]?.name;
        if (childName) parentOf.set(childName, node.name ?? '');
      }
    });
    for (const name of BOHROK_SHEET_SYMBOL_MESHES) {
      expect(parentOf.get(name)).toBe(BOHROK_SHEET_SYMBOL_PARENT);
    }

    const slots = extractGlbNodeMaterialSlots(BOHROK_GLB);
    expect(slots[BOHROK_SHEET_BODY_MESH]).toEqual([...BOHROK_SHEET_BODY_MATERIAL_NAMES].sort());
    expect(slots[BOHROK_SHEET_KAL_BODY_MESH]).toEqual(
      [...BOHROK_SHEET_KAL_BODY_MATERIAL_NAMES].sort()
    );
    expect(slots[BOHROK_SHEET_EYES_MESH]).toEqual([...BOHROK_SHEET_EYES_MATERIAL_NAMES].sort());
    expect(slots[BOHROK_SHEET_FACEPLATE_MESH]).toEqual(
      [...BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES].sort()
    );
    expect(slots[BOHROK_SHEET_KAL_FACEPLATE_MESH]).toEqual(
      [...BOHROK_SHEET_KAL_FACEPLATE_MATERIAL_NAMES].sort()
    );
    expect(slots[BOHROK_SHEET_KRANA_MESH]).toEqual([...BOHROK_SHEET_KRANA_MATERIAL_NAMES].sort());
    for (const name of BOHROK_SHEET_SHIELD_MESHES) {
      expect(slots[name]).toEqual([...BOHROK_SHEET_SHIELD_MATERIAL_NAMES].sort());
    }
    for (const name of BOHROK_SHEET_KAL_SHIELD_MESHES) {
      expect(slots[name]).toEqual([...BOHROK_SHEET_KAL_SHIELD_MATERIAL_NAMES].sort());
    }
  });

  test('opaque packed slots ship emissive and normals, without metallicRoughness', () => {
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
    const packedNames = [
      ...BOHROK_SHEET_BODY_MATERIAL_NAMES,
      ...BOHROK_SHEET_KAL_BODY_MATERIAL_NAMES,
      BOHROK_SHEET_SWARMS_MATERIAL,
      ...BOHROK_SHEET_KAL_SHIELD_MATERIAL_NAMES,
    ];
    for (const name of packedNames) {
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

describe('packed shield attach', () => {
  test('bohrokSheetBreedName maps dex ids onto mesh names', () => {
    expect(bohrokSheetBreedName('gahlok')).toBe('Gahlok');
    expect(bohrokSheetBreedName('tahnok_kal')).toBe('Tahnok');
    expect(bohrokSheetShieldMeshName('Gahlok', false)).toBe('Gahlok');
    expect(bohrokSheetShieldMeshName('Gahlok', true)).toBe('Gahlok.Kal');
    expect(bohrokSheetRuntimeName('Tahnok.Kal')).toBe('TahnokKal');
    expect(bohrokSheetRuntimeName('Tahnok.Symbol')).toBe('TahnokSymbol');
    expect(isBohrokSheetShieldMesh('Pahrak')).toBe(true);
    expect(isBohrokSheetShieldMesh('Pahrak.Kal')).toBe(true);
    expect(isBohrokSheetShieldMesh('Body')).toBe(false);
  });

  test('instances the swarm breed onto both sockets', () => {
    const root = new Group();
    root.name = 'Bohrok';
    const left = new Group();
    left.name = 'Shield_L';
    const right = new Group();
    right.name = 'Shield_R';
    const body = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Body_Main_Baked' }));
    body.name = 'Body';
    const kal = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Kal_Main_Baked' }));
    kal.name = 'Kal';
    const swarmFace = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Swarms_Baked' })
    );
    swarmFace.name = 'FacePlate_Transparent';
    const kalFace = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'KalShields_Baked' })
    );
    kalFace.name = 'FacePlate_Kal';
    root.add(left, right, body, kal, swarmFace, kalFace);

    const gahlok = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Swarms_Baked' }));
    gahlok.name = 'Gahlok';
    const clones = attachBohrokSheetAccessories({
      breed: 'Gahlok',
      isKal: false,
      root,
      templates: { Gahlok: gahlok },
    });

    expect(body.visible).toBe(true);
    expect(kal.visible).toBe(false);
    expect(swarmFace.visible).toBe(true);
    expect(kalFace.visible).toBe(false);
    expect(clones).toHaveLength(2);
    expect(clones[0]?.parent).toBe(left);
    expect(clones[1]?.parent).toBe(right);
  });

  test('Kal hides the swarm chassis and toggles the Face Plate symbol', () => {
    const root = new Group();
    root.name = 'Bohrok';
    const left = new Group();
    left.name = 'Shield_L';
    const right = new Group();
    right.name = 'Shield_R';
    const facePlate = new Group();
    facePlate.name = 'Face Plate';
    const body = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Body_Main_Baked' }));
    body.name = 'Body';
    const kal = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Kal_Main_Baked' }));
    kal.name = 'Kal';
    const swarmFace = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Swarms_Baked' })
    );
    swarmFace.name = 'FacePlate_Transparent';
    const kalFace = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'KalShields_Baked' })
    );
    kalFace.name = 'FacePlate_Kal';
    const tahnokSymbol = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Tahnok.Symbol' })
    );
    tahnokSymbol.name = 'Symbol_Bohrok-Kal_Tahnok-Kal-Coloured';
    tahnokSymbol.userData.name = 'Tahnok.Symbol';
    const gahlokSymbol = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Gahlok.Symbol' })
    );
    gahlokSymbol.name = 'Symbol_Bohrok-Kal_Tahnok-Kal-Coloured005';
    gahlokSymbol.userData.name = 'Gahlok.Symbol';
    facePlate.add(tahnokSymbol, gahlokSymbol);
    root.add(left, right, facePlate, body, kal, swarmFace, kalFace);

    const shield = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'KalShields_Baked' })
    );
    shield.name = 'Part-44937_dot_dat001';
    shield.userData.name = 'Tahnok.Kal';

    const clones = attachBohrokSheetAccessories({
      breed: 'Tahnok',
      isKal: true,
      root,
      templates: { 'Part-44937_dot_dat001': shield },
    });

    expect(body.visible).toBe(false);
    expect(kal.visible).toBe(true);
    expect(swarmFace.visible).toBe(false);
    expect(kalFace.visible).toBe(true);
    expect(clones).toHaveLength(2);
    expect(clones[0]?.parent).toBe(left);
    expect(clones[1]?.parent).toBe(right);
    expect(tahnokSymbol.visible).toBe(true);
    expect(gahlokSymbol.visible).toBe(false);
    expect(tahnokSymbol.parent).toBe(facePlate);
    setBohrokSheetVariant(root, false);
    expect(kal.visible).toBe(false);
    expect(body.visible).toBe(true);
  });

  test('hides every primitive under Body / Kal / faceplate groups', () => {
    const root = new Group();
    root.name = 'Bohrok';
    const left = new Group();
    left.name = 'Shield_L';
    const right = new Group();
    right.name = 'Shield_R';
    const body = new Group();
    body.name = 'Body';
    const swarmSlot = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Body_Main_Baked' })
    );
    swarmSlot.name = 'Swarm';
    body.add(swarmSlot);
    const kal = new Group();
    kal.name = 'Kal';
    const kalSlot = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'Kal_Main_Baked' })
    );
    kalSlot.name = 'Body_Kal';
    kal.add(kalSlot);
    const swarmFace = new Group();
    swarmFace.name = 'FacePlate_Transparent';
    const viewport = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ name: 'Clear' }));
    viewport.name = 'FacePlate_Transparent_1';
    swarmFace.add(viewport);
    const kalFace = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'KalShields_Baked' })
    );
    kalFace.name = 'FacePlate_Kal';
    const shield = new Mesh(
      new BoxGeometry(),
      new MeshStandardMaterial({ name: 'KalShields_Baked' })
    );
    shield.name = 'TahnokKal';
    root.add(left, right, body, kal, swarmFace, kalFace);

    attachBohrokSheetAccessories({
      breed: 'Tahnok',
      isKal: true,
      root,
      templates: { TahnokKal: shield },
    });

    expect(body.visible).toBe(false);
    expect(swarmSlot.visible).toBe(false);
    expect(kal.visible).toBe(true);
    expect(kalSlot.visible).toBe(true);
    expect(swarmFace.visible).toBe(false);
    expect(viewport.visible).toBe(false);
    expect(kalFace.visible).toBe(true);

    setBohrokSheetVariant(root, false);
    expect(body.visible).toBe(true);
    expect(swarmSlot.visible).toBe(true);
    expect(kal.visible).toBe(false);
    expect(kalSlot.visible).toBe(false);
    expect(swarmFace.visible).toBe(true);
    expect(kalFace.visible).toBe(false);
  });
});
