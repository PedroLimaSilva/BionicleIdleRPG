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
  applyTahuBattleMaterials,
  TAHU_BATTLE_SLOT_COLORS,
  TAHU_BATTLE_WEATHERED,
} from './tahuBattlePalette';

const COLORS: MatoranColors = {
  arms: { main: LegoColor.Red, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
  body: { main: LegoColor.Red, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
  eyes: LegoColor.TransNeonRed,
  face: LegoColor.LightGray,
  feet: { main: LegoColor.Red, metal: LegoColor.LightGray, secondary: LegoColor.Orange },
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

describe('tahu battle materials', () => {
  test('battle slot map covers every shipped Battle_Body / Battle_Brain name', () => {
    expect(Object.keys(TAHU_BATTLE_SLOT_COLORS).sort()).toEqual([
      'Battle_Body_Black_Baked',
      'Battle_Body_Main_Baked',
      'Battle_Body_Metal_Baked',
      'Battle_Body_Secondary_Baked',
      'Glow',
      'TRANS-DARK_PINK',
      'Tahu Eyes',
    ]);
    expect(TAHU_BATTLE_WEATHERED.authoredPbrMaps).toBe('noise');
  });

  test('keeps baked normals and discoloration, and uses noise for metalness / roughness', () => {
    const bake = mapTex();
    const normal = mapTex();
    const mr = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      metalnessMap: mr,
      name: 'Battle_Body_Main_Baked',
      normalMap: normal,
      roughnessMap: mr,
    });
    const mesh = uvMesh([main]);
    Object.assign(mesh, { frustumCulled: true, isSkinnedMesh: true });

    applyTahuBattleMaterials(mesh, COLORS);

    const next = mesh.material as MeshStandardMaterial & {
      metalnessNode?: unknown;
      normalNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(Array.isArray(mesh.material) ? mesh.material[0] : next).toBeDefined();
    const applied = (Array.isArray(mesh.material) ? mesh.material[0] : next) as typeof next;
    expect(applied.name).toBe('WeatheredMetal');
    expect(applied.color.getHexString().toUpperCase()).toBe(
      LegoColor.Red.replace('#', '').toUpperCase()
    );
    expect(applied.normalMap).toBe(normal);
    expect(applied.roughnessMap).toBeNull();
    expect(applied.metalnessMap).toBeNull();
    expect(applied.emissiveMap).toBeNull();
    expect(applied.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(bake);
    expect(applied.normalNode).toBeUndefined();
    expect(applied.roughnessNode).toBeDefined();
    expect(applied.metalnessNode).toBeDefined();
    expect(mesh.frustumCulled).toBe(false);
    mesh.onBeforeRender({} as never, {} as never, {} as never, mesh.geometry, applied, {} as never);
    expect(bakedDiscolorationMapNode.value).toBe(bake);
  });

  test('a second apply keeps the weathered TSL graph (React Strict Mode remount)', () => {
    const bake = mapTex();
    const normal = mapTex();
    const main = new MeshStandardMaterial({
      emissiveMap: bake,
      name: 'Battle_Body_Main_Baked',
      normalMap: normal,
    });
    const mesh = uvMesh([main]);
    applyTahuBattleMaterials(mesh, COLORS);
    applyTahuBattleMaterials(mesh, COLORS);

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

  test('Glow stays emissive and brain gel stays transmissive', () => {
    const glow = new MeshStandardMaterial({ name: 'Glow' });
    const brain = new MeshStandardMaterial({ name: 'TRANS-DARK_PINK' });
    const eyes = new MeshStandardMaterial({ name: 'Tahu Eyes' });
    const mesh = uvMesh([glow, brain, eyes]);

    applyTahuBattleMaterials(mesh, COLORS);

    const [nextGlow, nextBrain, nextEyes] = mesh.material as MeshStandardMaterial[];
    expect(nextGlow.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.Orange.replace('#', '').toUpperCase()
    );
    expect(nextBrain).toBeInstanceOf(MeshPhysicalMaterial);
    expect((nextBrain as MeshPhysicalMaterial).transmission).toBeGreaterThan(0);
    expect(nextEyes.emissive.getHexString().toUpperCase()).toBe(
      LegoColor.TransNeonRed.replace('#', '').toUpperCase()
    );
  });
});
