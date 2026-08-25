import { Mesh, MeshStandardMaterial } from 'three';
import { buildKitMaterialSlotLookup, buildKitMeshMaterials } from './kitMaterialApplication';
import { NUVA_METAL_PBR } from '../game/kit/palettes/metalPbr';
import type { WeatheredMetalOptions } from '../components/CharacterScene/WeatheredMetalMaterial';
import type { MatoranColors } from '../types/Matoran';
import { LegoColor } from '../types/Colors';

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
});
