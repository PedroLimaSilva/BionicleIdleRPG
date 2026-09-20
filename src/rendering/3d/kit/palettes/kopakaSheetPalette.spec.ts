import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
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
import { TRANSMISSIVE_KIT_BRAIN_TRANSMISSION } from '../../hooks/transmissiveKitMaterial';
import {
  applyKopakaSheetMaterials,
  KOPAKA_SHEET_SLOT_COLORS,
  KOPAKA_SHEET_WEATHERED,
} from './kopakaSheetPalette';

const COLORS: MatoranColors = {
  arms: { main: LegoColor.White, metal: LegoColor.LightGray, secondary: LegoColor.White },
  body: { main: LegoColor.White, metal: LegoColor.LightGray, secondary: LegoColor.White },
  eyes: LegoColor.MediumBlue,
  face: LegoColor.LightGray,
  feet: { main: LegoColor.White, metal: LegoColor.LightGray, secondary: LegoColor.White },
  mask: LegoColor.White,
  weapon: { glow: LegoColor.TransLightBlue, main: LegoColor.White, metal: LegoColor.LightGray },
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

describe('kopaka sheet materials', () => {
  test('sheet slot map covers every shipped Body / Brain / Sword name', () => {
    expect(Object.keys(KOPAKA_SHEET_SLOT_COLORS).sort()).toEqual([
      'Body_Black_Baked',
      'Body_Main_Baked',
      'Body_Metal_Baked',
      'Body_Secondary_Baked',
      'Brain',
      'Glowing Eyes',
      'Weapon Transparent',
    ]);
    expect(KOPAKA_SHEET_WEATHERED.authoredPbrMaps).toBe('packed');
  });

  test('keeps baked normals and discoloration, and uses packed emissive for metalness / roughness', () => {
    const bake = mapTex();
    const normal = mapTex();
    const mr = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      metalnessMap: mr,
      name: 'Body_Main_Baked',
      normalMap: normal,
      roughnessMap: mr,
    });
    const mesh = uvMesh([main]);
    Object.assign(mesh, { frustumCulled: true, isSkinnedMesh: true });

    applyKopakaSheetMaterials(mesh, COLORS);

    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial & {
      metalnessNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(applied.name).toBe('WeatheredMetal');
    expect(applied.color.getHexString().toUpperCase()).toBe(
      LegoColor.White.replace('#', '').toUpperCase()
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
      name: 'Body_Main_Baked',
    });
    const mesh = uvMesh([main]);
    applyKopakaSheetMaterials(mesh, COLORS);
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

  test('brain gel and ice sword are transmissive and join the bloom MRT; eyes do not', () => {
    const brain = new MeshStandardMaterial({ name: 'Brain' });
    const eyes = new MeshStandardMaterial({ name: 'Glowing Eyes' });
    const sword = new MeshStandardMaterial({ name: 'Weapon Transparent' });
    const mesh = uvMesh([brain, eyes, sword]);

    applyKopakaSheetMaterials(mesh, COLORS);

    const [nextBrain, nextEyes, nextSword] = mesh.material as MeshStandardMaterial[];
    expect(nextBrain).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextBrain as MeshPhysicalMaterial).transmission).toBe(
      TRANSMISSIVE_KIT_BRAIN_TRANSMISSION
    );
    expect((nextBrain as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();

    expect(nextEyes).not.toBeInstanceOf(MeshPhysicalMaterial);
    expect(nextEyes.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.MediumBlue.replace('#', '').toUpperCase()
    );
    expect((nextEyes as MeshStandardMaterial & { mrtNode?: unknown }).mrtNode).toBeUndefined();

    expect(nextSword).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextSword as MeshPhysicalMaterial).transmission).toBe(
      TRANSMISSIVE_KIT_BRAIN_TRANSMISSION
    );
    expect((nextSword as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
    expect(nextSword.color.getHexString().toUpperCase()).toBe(
      LegoColor.MediumBlue.replace('#', '').toUpperCase()
    );
  });
});
