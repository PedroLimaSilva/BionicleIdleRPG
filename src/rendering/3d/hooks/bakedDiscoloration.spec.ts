import { ClampToEdgeWrapping, Color, MeshStandardMaterial, Texture } from 'three';
import { LegoColor } from '../../../types/Colors';
import {
  DEFAULT_LEGO_DISCOLORATION,
  discolorationForColor,
} from '../kit/palettes/legoColorDiscoloration';
import { DUMMY_DISCOLORATION_MAP } from './dummyTextures';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  bakedDiscolorationAmountFromMaterial,
  bakedDiscolorationAmountNode,
  bakedDiscolorationMapNode,
  bindBakedDiscolorationMapNode,
  bindDiscolorationMapForSampling,
  createBakedDiscolorationUniforms,
  DISCOLORATION_MAP_USERDATA_KEY,
  ensureBakeSampleSlot,
  getBakedDiscolorationMap,
  writeBakedDiscolorationUserData,
} from './bakedDiscoloration';

describe('adoptBakedDiscolorationMap', () => {
  test('steals emissiveMap so it cannot glow, and is idempotent', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: map, name: 'Hau_baked' });
    expect(adoptBakedDiscolorationMap(mat)).toBe(map);
    expect(mat.emissiveMap).toBeNull();
    expect(mat.aoMap).toBe(map);
    expect(mat.aoMapIntensity).toBe(0);
    expect(getBakedDiscolorationMap(mat)).toBe(map);
    expect(adoptBakedDiscolorationMap(mat)).toBe(map);
  });

  test('leaves glow materials untouched', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: map, name: 'Glow' });
    expect(adoptBakedDiscolorationMap(mat, { isGlow: true })).toBeNull();
    expect(mat.emissiveMap).toBe(map);
  });

  test('returns null when there is no bake', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau_baked' });
    expect(adoptBakedDiscolorationMap(mat)).toBeNull();
    expect(mat.aoMap).toBeNull();
    expect(getBakedDiscolorationMap(mat)).toBeNull();
  });

  test('zeros emission and clamps atlas wrapping', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({
      emissive: 0xffffff,
      emissiveIntensity: 1,
      emissiveMap: map,
      name: 'Avohkii_baked',
    });
    adoptBakedDiscolorationMap(mat);
    expect(mat.emissive.getHex()).toBe(0);
    expect(mat.emissiveIntensity).toBe(0);
    expect(map.wrapS).toBe(ClampToEdgeWrapping);
    expect(map.wrapT).toBe(ClampToEdgeWrapping);
  });

  test('Material.copy keeps the bake on aoMap after userData JSON-clone drops Texture', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: map, name: 'Hau_baked' });
    adoptBakedDiscolorationMap(mat);
    const copy = mat.clone();
    expect(copy.userData[DISCOLORATION_MAP_USERDATA_KEY] instanceof Texture).toBe(false);
    expect(copy.aoMap).toBe(map);
    expect(copy.aoMapIntensity).toBe(0);
    expect(copy.aoMap?.isTexture).toBe(true);
    expect(getBakedDiscolorationMap(copy)).toBe(map);
  });

  test('writeBakedDiscolorationUserData does not put a dummy on aoMap', () => {
    const mat = new MeshStandardMaterial();
    writeBakedDiscolorationUserData(mat, null, LegoColor.Red);
    expect(mat.aoMap).toBeNull();
    expect(mat.aoMapIntensity).toBe(0);
    expect(getBakedDiscolorationMap(mat)).toBeNull();
  });
});

describe('baked discoloration uniforms', () => {
  test('uses the color-specific wear tint and ignores missing maps', () => {
    const uniforms = createBakedDiscolorationUniforms(null, LegoColor.Red);
    expect((uniforms.color.value as Color).getHexString()).toBe(
      new Color(DEFAULT_LEGO_DISCOLORATION.color).getHexString()
    );
    expect(uniforms.intensity.value).toBe(0);
    expect(uniforms.hasMap.value).toBe(0);
  });

  test('updates mix color when the tinted mask color changes', () => {
    const map = new Texture();
    const uniforms = createBakedDiscolorationUniforms(map, LegoColor.Red);
    expect(uniforms.intensity.value).toBe(DEFAULT_LEGO_DISCOLORATION.intensity);
    expect(uniforms.hasMap.value).toBe(1);

    applyBakedDiscolorationUniforms(uniforms, LegoColor.White, map);
    const whiteSpec = discolorationForColor(LegoColor.White);
    expect((uniforms.color.value as Color).getHexString()).toBe(
      new Color(whiteSpec.color).getHexString()
    );
    expect(uniforms.intensity.value).toBe(whiteSpec.intensity);
  });

  test('updates mix color when the uniform value lost Color.prototype', () => {
    const map = new Texture();
    const uniforms = createBakedDiscolorationUniforms(map, LegoColor.Red);
    uniforms.color.value = { b: 1, g: 1, r: 1 } as unknown as Color;

    applyBakedDiscolorationUniforms(uniforms, LegoColor.White, map);
    const whiteSpec = discolorationForColor(LegoColor.White);
    const white = new Color(whiteSpec.color);
    const plain = uniforms.color.value as { b: number; g: number; r: number };
    expect(plain.r).toBeCloseTo(white.r, 5);
    expect(plain.g).toBeCloseTo(white.g, 5);
    expect(plain.b).toBeCloseTo(white.b, 5);
  });
});

describe('baked discoloration amount', () => {
  test('samples the default mesh UV without throwing', () => {
    const map = new Texture();
    const uniforms = createBakedDiscolorationUniforms(map, LegoColor.Red);
    expect(() => bakedDiscolorationAmountNode(map, uniforms)).not.toThrow();
    expect(bakedDiscolorationAmountNode(null, uniforms)).toBeDefined();
  });

  test('shared material bake amount graph builds without throwing', () => {
    expect(() => bakedDiscolorationAmountFromMaterial()).not.toThrow();
  });
});

describe('bakedDiscolorationMapNode', () => {
  afterEach(() => {
    bindBakedDiscolorationMapNode(null);
  });

  test('compile seed is a real Texture, not texture(null)', () => {
    expect(bakedDiscolorationMapNode.value?.isTexture).toBe(true);
    expect(bakedDiscolorationMapNode.value).toBe(DUMMY_DISCOLORATION_MAP);
  });

  test('bindBakedDiscolorationMapNode follows aoMap and falls back to dummy', () => {
    const real = new Texture();
    bindBakedDiscolorationMapNode({ aoMap: real });
    expect(bakedDiscolorationMapNode.value).toBe(real);

    bindBakedDiscolorationMapNode({ aoMap: null });
    expect(bakedDiscolorationMapNode.value).toBe(DUMMY_DISCOLORATION_MAP);

    bindBakedDiscolorationMapNode({
      aoMap: { isTexture: false } as unknown as Texture,
    });
    expect(bakedDiscolorationMapNode.value).toBe(DUMMY_DISCOLORATION_MAP);
  });
});

describe('ensureBakeSampleSlot', () => {
  test('plants the dummy when aoMap is missing', () => {
    const mat = new MeshStandardMaterial();
    ensureBakeSampleSlot(mat);
    expect(mat.aoMap).toBe(DUMMY_DISCOLORATION_MAP);
    expect(mat.aoMapIntensity).toBe(0);
  });

  test('keeps a real bake map', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ aoMap: map, aoMapIntensity: 0 });
    ensureBakeSampleSlot(mat);
    expect(mat.aoMap).toBe(map);
  });
});

describe('bindDiscolorationMapForSampling', () => {
  test('binds duck-typed isTexture maps that fail instanceof Texture', () => {
    const duck = {
      colorSpace: 0,
      isTexture: true,
      uuid: 'duck-bake',
      wrapS: ClampToEdgeWrapping,
      wrapT: ClampToEdgeWrapping,
    };
    const mat = new MeshStandardMaterial();
    bindDiscolorationMapForSampling(mat, duck as unknown as Texture);
    expect(mat.aoMap).toBe(duck);
    expect(mat.aoMapIntensity).toBe(0);
  });
});
