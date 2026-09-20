import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three';
import { LegoColor } from '../../../../types/Colors';
import type { MatoranColors } from '../../../../types/Matoran';
import { DISCOLORATION_MAP_USERDATA_KEY } from '../../hooks/bakedDiscoloration';
import {
  PACKED_METALNESS_HAS_MAP_KEY,
  PACKED_ROUGHNESS_HAS_MAP_KEY,
  setPackedMetalnessEnabled,
  setPackedRoughnessEnabled,
} from '../../hooks/packedPbrMaps';
import {
  TRANSMISSIVE_KIT_CLEAR_TRANSMISSION,
  TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION,
} from '../../hooks/transmissiveKitMaterial';
import {
  applyBohrokSheetMaterials,
  BOHROK_SHEET_ACCESSORY_SLOT_COLORS,
  BOHROK_SHEET_BODY_SLOT_COLORS,
  BOHROK_SHEET_PACKED_SLOT_COLORS,
  BOHROK_SHEET_WEATHERED,
} from './bohrokSheetPalette';

const COLORS: MatoranColors = {
  arms: { main: LegoColor.Orange },
  body: { main: LegoColor.Red },
  eyes: LegoColor.Blue,
  face: LegoColor.Black,
  feet: { main: LegoColor.Red },
  mask: LegoColor.Black,
};

function mapTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
}

function uvMesh(materials: MeshStandardMaterial[]): Mesh {
  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
  );
  geom.setAttribute('uv', new BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1]), 2));
  return new Mesh(geom, materials);
}

describe('bohrok sheet materials', () => {
  test('packed body map covers every shipped Body_Baked name', () => {
    expect(Object.keys(BOHROK_SHEET_BODY_SLOT_COLORS).sort()).toEqual([
      'Body_Original_Black_Baked',
      'Body_Original_Main_Baked',
      'Body_Original_Metal_Baked',
      'Body_Original_Secondary_Baked',
    ]);
    expect(BOHROK_SHEET_WEATHERED.authoredPbrMaps).toBe('packed');
    expect(Object.keys(BOHROK_SHEET_PACKED_SLOT_COLORS).sort()).toEqual([
      'Body_Original_Black_Baked',
      'Body_Original_Main_Baked',
      'Body_Original_Metal_Baked',
      'Body_Original_Secondary_Baked',
      'Swarms_Baked',
    ]);
    expect(Object.keys(BOHROK_SHEET_ACCESSORY_SLOT_COLORS).sort()).toEqual([
      'Glowing',
      'Krana',
      'Trans_Color',
    ]);
  });

  test('keeps baked normals and discoloration, and uses packed emissive for metalness / roughness', () => {
    const bake = mapTex();
    const normal = mapTex();
    const mr = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      metalnessMap: mr,
      name: 'Body_Original_Main_Baked',
      normalMap: normal,
      roughnessMap: mr,
    });
    const mesh = uvMesh([main]);
    Object.assign(mesh, { frustumCulled: true, isSkinnedMesh: true });

    applyBohrokSheetMaterials(mesh, COLORS);

    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial & {
      metalnessNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(applied.name).toBe('WeatheredMetal');
    expect(applied.color.getHexString().toUpperCase()).toBe(
      LegoColor.Red.replace('#', '').toUpperCase()
    );
    expect(applied.normalMap).toBe(normal);
    expect(applied.roughnessMap).toBeNull();
    expect(applied.metalnessMap).toBeNull();
    expect(applied.emissiveMap).toBeNull();
    expect(applied.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(bake);
    expect(applied.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(1);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);
    expect(applied.roughnessNode).toBeDefined();
    expect(applied.metalnessNode).toBeDefined();
    expect(mesh.frustumCulled).toBe(false);
  });

  test('dex packed-map toggles flatten roughness and metalness without dropping the bake', () => {
    const bake = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      name: 'Body_Original_Main_Baked',
    });
    const mesh = uvMesh([main]);
    applyBohrokSheetMaterials(mesh, COLORS);
    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial;

    expect(setPackedRoughnessEnabled(mesh, false)).toBe(1);
    expect(applied.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(0);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);
    expect(applied.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(bake);

    expect(setPackedMetalnessEnabled(mesh, false)).toBe(1);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(0);
  });

  test('secondary uses arms.main; metal uses Mata PBR; eyes stay transmissive', () => {
    const secondary = new MeshStandardMaterial({ name: 'Body_Original_Secondary_Baked' });
    const metal = new MeshStandardMaterial({ name: 'Body_Original_Metal_Baked' });
    const crystal = new MeshStandardMaterial({ name: 'Trans_Color' });
    const iris = new MeshStandardMaterial({ name: 'Glowing' });
    const mesh = uvMesh([secondary, metal, crystal, iris]);

    applyBohrokSheetMaterials(mesh, COLORS);

    const [nextSecondary, nextMetal, nextCrystal, nextIris] =
      mesh.material as MeshStandardMaterial[];
    expect(nextSecondary.color.getHexString().toUpperCase()).toBe(
      LegoColor.Orange.replace('#', '').toUpperCase()
    );
    expect(nextMetal.color.getHexString().toUpperCase()).toBe(
      LegoColor.LightGray.replace('#', '').toUpperCase()
    );
    expect(nextMetal.metalness).toBeGreaterThan(0.5);
    expect(nextCrystal).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextCrystal as MeshPhysicalMaterial).transmission).toBe(
      TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION
    );
    expect(nextIris.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.Blue.replace('#', '').toUpperCase()
    );
  });

  test('Swarms_Baked tints body.main with packed weathering; faceplate Clear stays transmissive', () => {
    const bake = mapTex();
    const normal = mapTex();
    const shield = uvMesh([
      new MeshStandardMaterial({
        emissiveMap: bake,
        name: 'Swarms_Baked',
        normalMap: normal,
      }),
    ]);
    shield.name = 'Gahlok';
    const viewport = uvMesh([
      new MeshStandardMaterial({
        emissiveMap: bake,
        name: 'Swarms_Baked',
        normalMap: normal,
      }),
      new MeshStandardMaterial({ name: 'Clear' }),
    ]);
    viewport.name = 'FacePlate_Transparent';
    const root = new Group();
    root.add(shield, viewport);

    applyBohrokSheetMaterials(root, COLORS);

    const shieldMat = (
      Array.isArray(shield.material) ? shield.material[0] : shield.material
    ) as MeshStandardMaterial;
    expect(shieldMat.name).toBe('WeatheredMetal');
    expect(shieldMat.color.getHexString().toUpperCase()).toBe(
      LegoColor.Red.replace('#', '').toUpperCase()
    );
    expect(shieldMat.normalMap).toBe(normal);
    const [shellMat, viewportMat] = viewport.material as MeshStandardMaterial[];
    expect(shellMat.name).toBe('WeatheredMetal');
    expect(shellMat.color.getHexString().toUpperCase()).toBe(
      LegoColor.Red.replace('#', '').toUpperCase()
    );
    expect(viewportMat).toBeInstanceOf(MeshPhysicalMaterial);
    expect((viewportMat as MeshPhysicalMaterial).transmission).toBe(
      TRANSMISSIVE_KIT_CLEAR_TRANSMISSION
    );
  });
});
