import {
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Texture,
} from 'three';
import { LegoColor } from '../../../types/Colors';
import {
  DEFAULT_LEGO_DISCOLORATION,
  discolorationForColor,
} from '../kit/palettes/legoColorDiscoloration';
import { DUMMY_DISCOLORATION_MAP } from './dummyTextures';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  attachBakeSampleObjectUpdate,
  bakedDiscolorationAmountFromMaterial,
  bakedDiscolorationAmountNode,
  bakedDiscolorationMapNode,
  bakedPackedMetalnessFromMaterial,
  bakedPackedRoughnessFromMaterial,
  bindBakedDiscolorationMapNode,
  bindDiscolorationMapForSampling,
  createBakedDiscolorationUniforms,
  DISCOLORATION_MAP_USERDATA_KEY,
  DISCOLORATION_SMOOTHSTEP_HI,
  DISCOLORATION_SMOOTHSTEP_LO,
  ensureBakeSampleSlot,
  getBakedDiscolorationMap,
  setBakedDiscolorationEnabled,
  writeBakedDiscolorationUserData,
  type TextureNodeLike,
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
    expect(map.generateMipmaps).toBe(false);
    expect(map.minFilter).toBe(LinearFilter);
    expect(map.magFilter).toBe(LinearFilter);
    expect(map.channel).toBe(0);
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

describe('setBakedDiscolorationEnabled', () => {
  test('zeros the mix without dropping the bake texture, then restores it', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ color: LegoColor.Red, name: 'WeatheredMetal' });
    writeBakedDiscolorationUserData(mat, map, LegoColor.Red);
    const mesh = new Mesh();
    mesh.material = mat;
    const root = new Object3D();
    root.add(mesh);

    expect(setBakedDiscolorationEnabled(root, false)).toBe(1);
    expect(mat.aoMap).toBe(map);
    expect(mat.userData.discolorationHasMap).toBe(0);
    expect(mat.userData.discolorationIntensity).toBe(0);

    expect(setBakedDiscolorationEnabled(root, true)).toBe(1);
    expect(mat.aoMap).toBe(map);
    expect(mat.userData.discolorationHasMap).toBe(1);
    expect(mat.userData.discolorationIntensity).toBe(DEFAULT_LEGO_DISCOLORATION.intensity);
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
    expect(() => bakedDiscolorationAmountFromMaterial('b')).not.toThrow();
    expect(() => bakedPackedRoughnessFromMaterial()).not.toThrow();
    expect(() => bakedPackedMetalnessFromMaterial()).not.toThrow();
  });

  test('hairline gate reaches full mix below mid-gray', () => {
    expect(DISCOLORATION_SMOOTHSTEP_LO).toBe(0.04);
    expect(DISCOLORATION_SMOOTHSTEP_HI).toBe(0.28);
  });

  test('hairline gate reaches full mix below mid-gray', () => {
    expect(DISCOLORATION_SMOOTHSTEP_LO).toBe(0.04);
    expect(DISCOLORATION_SMOOTHSTEP_HI).toBe(0.28);
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

  test('TextureNode.setup cannot drop per-object bake rebinding', () => {
    const real = new Texture();
    const other = new Texture();
    const sample: TextureNodeLike = {
      setup(this: TextureNodeLike) {
        this.updateType = 'none';
        return 'compiled';
      },
      update() {
        return 'updated';
      },
      updateType: 'none',
      value: DUMMY_DISCOLORATION_MAP,
    };

    attachBakeSampleObjectUpdate(sample);
    expect(sample.updateType).toBe('object');
    expect(sample.getUpdateType?.()).toBe('object');
    expect(sample.setup({ material: { aoMap: real } })).toBe('compiled');
    expect(sample.updateType).toBe('object');
    expect(sample.getUpdateType?.()).toBe('object');
    expect(sample.value).toBe(real);

    sample.updateType = 'none';
    expect(sample.getUpdateType?.()).toBe('object');

    sample.update({ material: { aoMap: other } });
    expect(sample.value).toBe(other);

    sample.setup({ context: { material: { aoMap: real } } });
    expect(sample.updateType).toBe('object');
    expect(sample.value).toBe(real);

    sample.update({ material: { aoMap: null } });
    expect(sample.value).toBe(DUMMY_DISCOLORATION_MAP);
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
