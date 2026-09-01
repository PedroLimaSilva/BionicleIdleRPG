import {
  BufferAttribute,
  BufferGeometry,
  DataTexture,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three';
import { buildKitMaterialSlotLookup, buildKitMeshMaterials } from './kitMaterialApplication';
import { NUVA_METAL_PBR } from '../kit/palettes/metalPbr';
import {
  TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION,
  TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
} from './transmissiveKitMaterial';
import {
  getWeatheredBevelMap,
  type WeatheredMetalOptions,
} from '../CharacterScene/WeatheredMetalMaterial';
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

function bevelTex(): DataTexture {
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

  test('mapped PBR rig materials stay untouched even when a slot would match', () => {
    const mesh = meshWithMaterialNamed('Disk');
    const mapped = mesh.material as MeshStandardMaterial;
    mapped.normalMap = {} as MeshStandardMaterial['normalMap'];
    mapped.metalnessMap = {} as MeshStandardMaterial['metalnessMap'];
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({ Main: { kind: 'part', part: 'weapon', slot: 'main' } }),
      COLORS,
      PLASTIC_WEATHERED
    ) as MeshStandardMaterial;
    expect(next).toBe(mapped);
    expect(next.metalness).toBe(0.5);
  });

  test('McToran Face Brain slot is clearer than Toa brain', () => {
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
    ) as MeshPhysicalMaterial;
    expect(next.transmission).toBe(TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION);
    expect(next.transmission).toBeGreaterThan(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION);
  });

  test('Brain slot gets runtime transmission when slot tints emissive', () => {
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
    ) as MeshPhysicalMaterial;
    expect(next.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(next.transmission).toBe(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION);
    expect(next.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(next.normalMap).toBeNull();
  });

  test('VahkiHood slot uses the vahkiHood transmissive preset', () => {
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
    ) as MeshPhysicalMaterial;
    expect(next.transmission).toBe(TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION);
    expect(next.depthWrite).toBe(false);
    expect(next.normalMap).toBeNull();
  });

  test('Brain with color-only slot (Bohrok eyes) stays on the plastic path', () => {
    const mat = buildSingle('Brain', {
      Brain: { color: { key: 'eyes', kind: 'palette' }, weathered: false },
    });
    expect(mat).not.toBeInstanceOf(MeshPhysicalMaterial);
    expect(mat.metalness).toBe(0.5);
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

describe('buildKitMeshMaterials bevel atlas', () => {
  const atlas = bevelTex();
  const weatheredWithAtlas: WeatheredMetalOptions = {
    bevelMap: atlas,
    metalness: 0.05,
    roughness: 0.45,
  };

  test('Main and Secondary on one UV mesh share the kit atlas and keep different colors', () => {
    const mesh = meshWithUvAndSlots(['Main', 'Secondary']);
    const next = buildKitMeshMaterials(
      mesh,
      buildKitMaterialSlotLookup({
        Main: { kind: 'part', part: 'arms', slot: 'main' },
        Secondary: { kind: 'part', part: 'arms', slot: 'secondary' },
      }),
      COLORS,
      weatheredWithAtlas
    ) as MeshStandardMaterial[];
    expect(getWeatheredBevelMap(next[0])).toBe(atlas);
    expect(getWeatheredBevelMap(next[1])).toBe(atlas);
    expect(next[0].color.getHexString().toUpperCase()).toBe('B48455');
    expect(next[1].color.getHexString().toUpperCase()).toBe('720E0F');
    expect(next[0].metalness).toBe(NUVA_METAL_PBR.metalness);
    expect(next[1].metalness).toBe(weatheredWithAtlas.metalness);
  });

  test('glow slots skip weathering even when an atlas is present', () => {
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
      weatheredWithAtlas
    ) as MeshStandardMaterial;
    expect(getWeatheredBevelMap(next)).toBeNull();
    expect(next.emissive.getHexString().toUpperCase()).toBe('F8F184');
  });

  test('meshes without UVs keep the procedural weathered path', () => {
    const mat = buildSingle(
      'Main',
      { Main: { kind: 'part', part: 'body', slot: 'main' } },
      weatheredWithAtlas
    );
    expect(getWeatheredBevelMap(mat)).toBeNull();
    expect(mat.metalness).toBe(weatheredWithAtlas.metalness);
  });
});
