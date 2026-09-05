import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  FrontSide,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three';
import { buildKitMaterialSlotLookup, buildKitMeshMaterials } from './kitMaterialApplication';
import { NUVA_METAL_PBR } from '../kit/palettes/metalPbr';
import { type WeatheredMetalOptions } from '../CharacterScene/WeatheredMetalMaterial';
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

function meshWithUvAndSlots(names: string[]): Mesh {
  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
  );
  geom.setAttribute('uv', new BufferAttribute(new Float32Array([0, 0, 1, 0, 0, 1]), 2));
  const mats = names.map(
    (name) => new MeshStandardMaterial({ color: '#ffffff', metalness: 0.5, name, roughness: 0.5 })
  );
  return new Mesh(geom, mats.length === 1 ? mats[0] : mats);
}

function discolorTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 128, 0, 255]), 1, 1);
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

  test('albedo-mapped materials keep the printed map and drop other PBR maps', () => {
    const mesh = meshWithMaterialNamed('Main');
    const mapped = mesh.material as MeshStandardMaterial;
    mapped.map = discolorTex();
    mapped.normalMap = discolorTex();
    mapped.metalnessMap = discolorTex();
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({ Main: { kind: 'part', part: 'weapon', slot: 'main' } }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.map).toBe(mapped.map);
    expect(next.metalnessMap).toBeNull();
    expect(next.normalMap).toBeNull();
    expect(next.emissiveIntensity).toBe(0);
  });

  test('Brain slot uses opaque eye color instead of transmission', () => {
    const mesh = meshWithMaterialNamed('Brain');
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Brain: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
          emissiveIntensity: 0.1,
          transmissive: 'brain',
          weathered: false,
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.name).toBe('WeatheredMetal');
    expect(next.emissiveIntensity).toBe(0);
    expect(next).not.toBeInstanceOf(MeshPhysicalMaterial);
  });

  test('McToran Face Brain slot is also opaque colored plastic', () => {
    const mesh = meshWithMaterialNamed('Brain');
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Brain: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
          emissiveIntensity: 0.1,
          transmissive: 'mctoranFace',
          weathered: false,
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next).not.toBeInstanceOf(MeshPhysicalMaterial);
  });

  test('VahkiHood slot uses opaque eye color', () => {
    const mesh = meshWithMaterialNamed('VahkiHood');
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        VahkiHood: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
          emissiveIntensity: 0.1,
          transmissive: 'vahkiHood',
          weathered: false,
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next).not.toBeInstanceOf(MeshPhysicalMaterial);
  });

  test('Brain with color-only slot (Bohrok eyes) stays on the plastic path', () => {
    const mat = buildSingle('Brain', {
      Brain: { color: { key: 'eyes', kind: 'palette' }, weathered: false },
    });
    expect(mat).not.toBeInstanceOf(MeshPhysicalMaterial);
    expect(mat.name).toBe('WeatheredMetal');
    expect(mat.metalness).toBe(PLASTIC_WEATHERED.metalness);
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

describe('buildKitMeshMaterials untextured slots', () => {
  test('baked kit slots drop maps and tint with the slot color', () => {
    const mesh = meshWithUvAndSlots(['Main_MataChest_baked']);
    const bake = discolorTex();
    const normal = discolorTex();
    const source = mesh.material as MeshStandardMaterial;
    source.emissiveMap = bake;
    source.normalMap = normal;
    source.roughnessMap = discolorTex();
    source.metalnessMap = discolorTex();
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Main: { kind: 'part', part: 'body', slot: 'main' },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.name).toBe('WeatheredMetal');
    expect(next.emissiveMap).toBeNull();
    expect(next.normalMap).toBeNull();
    expect(next.roughnessMap).toBeNull();
    expect(next.metalnessMap).toBeNull();
    expect(next.metalness).toBe(PLASTIC_WEATHERED.metalness);
    expect(next.roughness).toBe(PLASTIC_WEATHERED.roughness);
  });

  test('Blender duplicate Main.001 still takes the Main slot', () => {
    const mat = buildSingle('Main.001', { Main: { kind: 'part', part: 'body', slot: 'main' } });
    expect(mat.name).toBe('WeatheredMetal');
    expect(mat.color.getHexString().toUpperCase()).toBe('720E0F');
  });

  test('Main_MataChest_baked tints Main, Secondary_MataLegModShin_baked tints Secondary', () => {
    const mesh = new Mesh(undefined, [
      new MeshStandardMaterial({ color: '#ffffff', name: 'Main_MataChest_baked' }),
      new MeshStandardMaterial({ color: '#ffffff', name: 'Secondary_MataLegModShin_baked' }),
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

  test('unprefixed MataChest_baked does not guess Main', () => {
    const mat = buildSingle('MataChest_baked', {
      Main: { kind: 'part', part: 'body', slot: 'main' },
    });
    expect(mat.metalness).toBe(0.5);
    expect(mat.name).not.toBe('WeatheredMetal');
  });

  test('Face_MataFace_baked uses FrontSide without TSL nodes', () => {
    const mesh = meshWithUvAndSlots(['Face_MataFace_baked']);
    const bake = discolorTex();
    const source = mesh.material as MeshStandardMaterial;
    source.emissiveMap = bake;
    source.normalMap = discolorTex();
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial & { colorNode?: unknown };
    expect(next.name).toBe('WeatheredMetal');
    expect(next.side).toBe(FrontSide);
    expect(next.normalMap).toBeNull();
    expect(Object.hasOwn(next, 'onBeforeCompile')).toBe(false);
    expect(next.colorNode).toBeUndefined();
  });

  test('glow slots become colored plastic with no emission', () => {
    const mesh = meshWithUvAndSlots(['Glow']);
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Glow: {
          color: { key: 'eyes', kind: 'palette' },
          emissive: { key: 'eyes', kind: 'palette' },
        },
      }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next.name).toBe('WeatheredMetal');
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.emissiveIntensity).toBe(0);
    expect(next.emissiveMap).toBeNull();
  });
});
