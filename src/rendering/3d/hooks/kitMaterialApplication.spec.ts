import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { buildKitMaterialSlotLookup, buildKitMeshMaterials } from './kitMaterialApplication';
import { NUVA_METAL_PBR } from '../kit/palettes/metalPbr';
import { TRANSMISSIVE_KIT_IOR, TRANSMISSIVE_KIT_TRANSMISSION } from './transmissiveKitMaterial';
import type { WeatheredMetalOptions } from '../CharacterScene/WeatheredMetalMaterial';
import type { MatoranColors } from '../../../types/Matoran';
import { LegoColor } from '../../../types/Colors';

const PLASTIC_WEATHERED: WeatheredMetalOptions = { metalness: 0.05, roughness: 0.45 };

const COLORS: MatoranColors = {
  arms: { main: LegoColor.FlatDarkGold, metal: LegoColor.LightGray, secondary: LegoColor.DarkRed },
  body: { main: LegoColor.DarkRed, metal: LegoColor.LightGray, secondary: LegoColor.DarkRed },
  eyes: LegoColor.TransNeonGreen,
  face: LegoColor.DarkGray,
  feet: { main: LegoColor.FlatDarkGold, metal: LegoColor.LightGray },
  mask: LegoColor.FlatDarkGold,
};

function meshWithMaterialNamed(name: string): Mesh {
  return new Mesh(undefined, new MeshStandardMaterial({ metalness: 0.5, name, roughness: 0.5 }));
}

function buildSingle(
  materialName: string,
  materialColors: Parameters<typeof buildKitMaterialSlotLookup>[0],
  weathered: WeatheredMetalOptions | undefined = PLASTIC_WEATHERED
): MeshStandardMaterial {
  const mesh = meshWithMaterialNamed(materialName);
  const next = buildKitMeshMaterials(
    mesh,
    buildKitMaterialSlotLookup(materialColors),
    COLORS,
    weathered
  );
  return next as MeshStandardMaterial;
}

describe('buildKitMeshMaterials metallic colors', () => {
  test('a Main slot painted flat gold gets metal PBR instead of the plastic defaults', () => {
    const mat = buildSingle('Main', { Main: { kind: 'part', part: 'arms', slot: 'main' } });
    expect(mat.color.getHexString().toUpperCase()).toBe('B48455');
    expect(mat.metalness).toBe(NUVA_METAL_PBR.metalness);
    expect(mat.roughness).toBe(NUVA_METAL_PBR.roughness);
    expect(mat.envMapIntensity).toBe(NUVA_METAL_PBR.envMapIntensity);
  });

  test('a Main slot painted a plastic color keeps the character defaults', () => {
    const mat = buildSingle('Main', { Main: { kind: 'part', part: 'body', slot: 'main' } });
    expect(mat.metalness).toBe(PLASTIC_WEATHERED.metalness);
    expect(mat.roughness).toBe(PLASTIC_WEATHERED.roughness);
  });

  test('explicit slot PBR wins over the metallic default', () => {
    const mat = buildSingle('Main', {
      Main: { color: { kind: 'part', part: 'feet', slot: 'main' }, metalness: 0.2, roughness: 0.6 },
    });
    expect(mat.metalness).toBe(0.2);
    expect(mat.roughness).toBe(0.6);
  });

  test('gold still reads as metal on slots that opt out of weathering', () => {
    const mat = buildSingle('Main', {
      Main: { color: { kind: 'part', part: 'feet', slot: 'main' }, weathered: false },
    });
    expect(mat.metalness).toBe(NUVA_METAL_PBR.metalness);
    expect(mat.roughness).toBe(NUVA_METAL_PBR.roughness);
  });

  test('unmapped materials keep their GLB look', () => {
    const mat = buildSingle('Solid_Black', { Main: { kind: 'part', part: 'feet', slot: 'main' } });
    expect(mat.metalness).toBe(0.5);
    expect(mat.roughness).toBe(0.5);
  });

  test('baked PBR rig materials stay untouched even when a slot would match', () => {
    const mesh = meshWithMaterialNamed('Disk_Baked');
    const baked = mesh.material as MeshStandardMaterial;
    baked.normalMap = {} as MeshStandardMaterial['normalMap'];
    baked.metalnessMap = {} as MeshStandardMaterial['metalnessMap'];
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({ Main: { kind: 'part', part: 'weapon', slot: 'main' } }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next).toBe(baked);
    expect(next.metalness).toBe(0.5);
  });

  test('a matching slot builds uniform transmission for Mata brain (no baked maps)', () => {
    const mesh = meshWithMaterialNamed('MataBrain_baked');
    const baked = mesh.material as MeshStandardMaterial;
    baked.normalMap = {} as MeshStandardMaterial['normalMap'];
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        MataBrain_baked: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
          emissiveIntensity: 0.1,
          weathered: false,
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshPhysicalMaterial;
    expect(next).not.toBe(baked);
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.emissive.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.emissiveIntensity).toBe(0.1);
    expect(next.transmission).toBe(TRANSMISSIVE_KIT_TRANSMISSION);
    expect(next.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(next.normalMap).toBeNull();
  });

  test('a matching slot builds uniform transmission for Vahki hood (no baked maps)', () => {
    const mesh = meshWithMaterialNamed('VahkiHood_baked');
    const baked = mesh.material as MeshStandardMaterial;
    baked.normalMap = {} as MeshStandardMaterial['normalMap'];
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        VahkiHood_baked: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
          emissiveIntensity: 0.1,
          weathered: false,
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshPhysicalMaterial;
    expect(next).not.toBe(baked);
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.emissive.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.emissiveIntensity).toBe(0.1);
    expect(next.transmission).toBe(TRANSMISSIVE_KIT_TRANSMISSION);
    expect(next.normalMap).toBeNull();
  });

  test('opacity below 1 enables transparent blending on the cloned material', () => {
    const mat = buildSingle('Secondary', {
      Secondary: {
        color: { kind: 'part', part: 'weapon', slot: 'secondary' },
        opacity: 0.5,
        weathered: false,
      },
    });
    expect(mat.opacity).toBe(0.5);
    expect(mat.transparent).toBe(true);
  });

  test('unmapped Secondary inherits Main tint on the same mesh', () => {
    const mesh = new Mesh(undefined, [
      new MeshStandardMaterial({ color: '#ffffff', name: 'Main' }),
      new MeshStandardMaterial({ color: '#000000', name: 'Secondary' }),
    ]);
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({ Main: { kind: 'part', part: 'arms', slot: 'main' } }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial[];
    expect(next[0].color.getHexString().toUpperCase()).toBe('B48455');
    expect(next[1].color.getHexString().toUpperCase()).toBe('B48455');
  });

  test('explicit Secondary slot is not replaced by Main mirror', () => {
    const mesh = new Mesh(undefined, [
      new MeshStandardMaterial({ color: '#ffffff', name: 'Main' }),
      new MeshStandardMaterial({ color: '#000000', name: 'Secondary' }),
    ]);
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Main: { kind: 'part', part: 'arms', slot: 'main' },
        Secondary: { kind: 'part', part: 'arms', slot: 'secondary' },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial[];
    expect(next[0].color.getHexString().toUpperCase()).toBe('B48455');
    expect(next[1].color.getHexString().toUpperCase()).toBe('720E0F');
  });
});
