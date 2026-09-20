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
import { setAuthoredNormalMapsEnabled } from '../../hooks/authoredNormalMaps';
import {
  PACKED_METALNESS_HAS_MAP_KEY,
  PACKED_ROUGHNESS_HAS_MAP_KEY,
  setPackedMetalnessEnabled,
  setPackedRoughnessEnabled,
} from '../../hooks/packedPbrMaps';
import { TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION } from '../../hooks/transmissiveKitMaterial';
import {
  applyRebuiltSheetMaterials,
  REBUILT_SHEET_SLOT_COLORS,
  REBUILT_SHEET_WEATHERED,
} from './rebuiltSheetPalette';

const COLORS: MatoranColors = {
  arms: { main: LegoColor.Tan, metal: LegoColor.LightGray, secondary: LegoColor.Tan },
  body: { main: LegoColor.Tan, metal: LegoColor.LightGray, secondary: LegoColor.Tan },
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: { main: LegoColor.DarkOrange, metal: LegoColor.LightGray, secondary: LegoColor.Tan },
  mask: LegoColor.DarkOrange,
  weapon: { glow: LegoColor.TransNeonOrange, main: LegoColor.Tan, metal: LegoColor.LightGray },
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

describe('rebuilt sheet materials', () => {
  test('sheet slot map covers every shipped Body / Brain name', () => {
    expect(Object.keys(REBUILT_SHEET_SLOT_COLORS).sort()).toEqual([
      'Body_Body_Baked',
      'Body_Limbs_Baked',
      'Body_Metal_Baked',
      'Brain',
      'Glowing Eyes',
    ]);
    expect(REBUILT_SHEET_WEATHERED.authoredPbrMaps).toBe('packed');
  });

  test('keeps baked normals and discoloration, and uses packed emissive for metalness / roughness', () => {
    const bake = mapTex();
    const normal = mapTex();
    const mr = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      metalnessMap: mr,
      name: 'Body_Body_Baked',
      normalMap: normal,
      roughnessMap: mr,
    });
    const mesh = uvMesh([main]);
    Object.assign(mesh, { frustumCulled: true, isSkinnedMesh: true });

    applyRebuiltSheetMaterials(mesh, COLORS);

    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial & {
      metalnessNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(applied.name).toBe('WeatheredMetal');
    expect(applied.color.getHexString().toUpperCase()).toBe(
      LegoColor.Tan.replace('#', '').toUpperCase()
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
    expect(setAuthoredNormalMapsEnabled(mesh, false)).toBe(1);
    expect(applied.normalScale.x).toBe(0);
    expect(applied.normalScale.y).toBe(0);
    expect(applied.normalMap).toBe(normal);
    expect(setAuthoredNormalMapsEnabled(mesh, true)).toBe(1);
    expect(applied.normalScale.x).toBe(1);
  });

  test('dex packed-map toggles flatten roughness and metalness without dropping the bake', () => {
    const bake = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      name: 'Body_Body_Baked',
    });
    const mesh = uvMesh([main]);
    applyRebuiltSheetMaterials(mesh, COLORS);
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

  test('limbs use feet.main; metal uses Mata PBR; brain gel stays transmissive', () => {
    const limbs = new MeshStandardMaterial({ name: 'Body_Limbs_Baked' });
    const metal = new MeshStandardMaterial({ name: 'Body_Metal_Baked' });
    const brain = new MeshStandardMaterial({ name: 'Brain' });
    const eyes = new MeshStandardMaterial({ name: 'Glowing Eyes' });
    const mesh = uvMesh([limbs, metal, brain, eyes]);

    applyRebuiltSheetMaterials(mesh, COLORS);

    const [nextLimbs, nextMetal, nextBrain, nextEyes] = mesh.material as MeshStandardMaterial[];
    expect(nextLimbs.color.getHexString().toUpperCase()).toBe(
      LegoColor.DarkOrange.replace('#', '').toUpperCase()
    );
    expect(nextMetal.color.getHexString().toUpperCase()).toBe(
      LegoColor.LightGray.replace('#', '').toUpperCase()
    );
    expect(nextMetal.metalness).toBeGreaterThan(0.5);
    expect(nextBrain).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextBrain as MeshPhysicalMaterial).transmission).toBe(
      TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION
    );
    expect(nextEyes.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.TransNeonOrange.replace('#', '').toUpperCase()
    );
    expect((nextEyes as MeshStandardMaterial & { mrtNode?: unknown }).mrtNode).toBeUndefined();
  });
});
