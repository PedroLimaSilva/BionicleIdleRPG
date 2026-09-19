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
import {
  bakedDiscolorationMapNode,
  DISCOLORATION_MAP_USERDATA_KEY,
} from '../../hooks/bakedDiscoloration';
import {
  PACKED_METALNESS_HAS_MAP_KEY,
  PACKED_ROUGHNESS_HAS_MAP_KEY,
  setPackedMetalnessEnabled,
  setPackedRoughnessEnabled,
} from '../../hooks/packedPbrMaps';
import {
  applyDiminishedSheetMaterials,
  DIMINISHED_SHEET_SLOT_COLORS,
  DIMINISHED_SHEET_WEATHERED,
} from './diminishedSheetPalette';

const COLORS: MatoranColors = {
  arms: { main: LegoColor.Red, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
  body: { main: LegoColor.Red, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
  eyes: LegoColor.TransNeonRed,
  face: LegoColor.LightGray,
  feet: { main: LegoColor.Black, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
  mask: LegoColor.Red,
  weapon: { glow: LegoColor.Orange, main: LegoColor.Red, metal: LegoColor.LightGray },
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

describe('diminished sheet materials', () => {
  test('sheet slot map covers every shipped Body / Brain material name', () => {
    expect(Object.keys(DIMINISHED_SHEET_SLOT_COLORS).sort()).toEqual([
      'Body_Body_Baked',
      'Body_Face_Baked',
      'Body_Feet_Baked',
      'Brain',
      'Glowing Eyes',
    ]);
    expect(DIMINISHED_SHEET_WEATHERED.authoredPbrMaps).toBe('packed');
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

    applyDiminishedSheetMaterials(mesh, COLORS);

    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial & {
      metalnessNode?: unknown;
      normalNode?: unknown;
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
    expect(applied.normalNode).toBeUndefined();
    expect(applied.roughnessNode).toBeDefined();
    expect(applied.metalnessNode).toBeDefined();
    expect(mesh.frustumCulled).toBe(false);
    mesh.onBeforeRender({} as never, {} as never, {} as never, mesh.geometry, applied, {} as never);
    expect(bakedDiscolorationMapNode.value).toBe(bake);
  });

  test('dex packed-map toggles flatten roughness and metalness without dropping the bake', () => {
    const bake = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      name: 'Body_Body_Baked',
    });
    const mesh = uvMesh([main]);
    applyDiminishedSheetMaterials(mesh, COLORS);
    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial;

    expect(setPackedRoughnessEnabled(mesh, false)).toBe(1);
    expect(applied.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(0);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);
    expect(applied.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(bake);

    expect(setPackedMetalnessEnabled(mesh, false)).toBe(1);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(0);

    expect(setPackedRoughnessEnabled(mesh, true)).toBe(1);
    expect(setPackedMetalnessEnabled(mesh, true)).toBe(1);
    expect(applied.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(1);
    expect(applied.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);
  });

  test('a second apply keeps the weathered TSL graph (React Strict Mode remount)', () => {
    const bake = mapTex();
    const normal = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      name: 'Body_Body_Baked',
      normalMap: normal,
    });
    const mesh = uvMesh([main]);
    applyDiminishedSheetMaterials(mesh, COLORS);
    applyDiminishedSheetMaterials(mesh, COLORS);

    const applied = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as MeshStandardMaterial & {
      colorNode?: unknown;
      metalnessNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(applied.name).toBe('WeatheredMetal');
    expect(applied.colorNode).toBeDefined();
    expect(applied.roughnessNode).toBeDefined();
    expect(applied.metalnessNode).toBeDefined();
    expect(applied.normalMap).toBe(normal);
    expect(applied.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(bake);
    expect(applied.aoMap).toBe(bake);
  });

  test('feet and face pick their palette slots, brain gel stays transmissive', () => {
    const feet = new MeshStandardMaterial({ name: 'Body_Feet_Baked' });
    const face = new MeshStandardMaterial({ name: 'Body_Face_Baked' });
    const brain = new MeshStandardMaterial({ name: 'Brain' });
    const eyes = new MeshStandardMaterial({ name: 'Glowing Eyes' });
    const mesh = uvMesh([feet, face, brain, eyes]);

    applyDiminishedSheetMaterials(mesh, COLORS);

    const [nextFeet, nextFace, nextBrain, nextEyes] = mesh.material as MeshStandardMaterial[];
    expect(nextFeet.color.getHexString().toUpperCase()).toBe(
      LegoColor.Black.replace('#', '').toUpperCase()
    );
    expect(nextFace.color.getHexString().toUpperCase()).toBe(
      LegoColor.LightGray.replace('#', '').toUpperCase()
    );
    expect(nextBrain).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextBrain as MeshPhysicalMaterial).transmission).toBeGreaterThan(0);
    expect(nextEyes.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.TransNeonRed.replace('#', '').toUpperCase()
    );
  });
});
