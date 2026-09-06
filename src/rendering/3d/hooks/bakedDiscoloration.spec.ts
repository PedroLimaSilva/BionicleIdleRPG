import { ClampToEdgeWrapping, Color, MeshStandardMaterial, Texture } from 'three';
import { LegoColor } from '../../../types/Colors';
import {
  DEFAULT_LEGO_DISCOLORATION,
  discolorationForColor,
} from '../kit/palettes/legoColorDiscoloration';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  bakedDiscolorationAmountNode,
  createBakedDiscolorationUniforms,
  getBakedDiscolorationMap,
} from './bakedDiscoloration';

describe('adoptBakedDiscolorationMap', () => {
  test('steals emissiveMap so it cannot glow, and is idempotent', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: map, name: 'Hau_baked' });
    expect(adoptBakedDiscolorationMap(mat)).toBe(map);
    expect(mat.emissiveMap).toBeNull();
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
});

describe('baked discoloration amount', () => {
  test('samples the default mesh UV without throwing', () => {
    const map = new Texture();
    const uniforms = createBakedDiscolorationUniforms(map, LegoColor.Red);
    expect(() => bakedDiscolorationAmountNode(map, uniforms)).not.toThrow();
    expect(bakedDiscolorationAmountNode(null, uniforms)).toBeDefined();
  });
});
