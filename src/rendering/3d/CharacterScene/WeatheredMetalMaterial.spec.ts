import { DataTexture, RepeatWrapping } from 'three';
import { getWeatheredMetalMaterial } from './WeatheredMetalMaterial';

function mapTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
}

describe('getWeatheredMetalMaterial', () => {
  test('ignores bake maps and shares materials by color and PBR', () => {
    const discolor = mapTex();
    discolor.wrapS = RepeatWrapping;
    discolor.wrapT = RepeatWrapping;
    const a = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: discolor,
      metalness: 0.05,
      normalMap: discolor,
    });
    const b = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: discolor,
      metalness: 0.05,
      normalMap: discolor,
    });
    expect(a).toBe(b);
    expect(a.color.getHexString()).toBe('c91a09');
    expect(a.normalMap).toBeNull();
    expect(a.map).toBeNull();
    expect(a.emissiveMap).toBeNull();
    expect(a.emissiveIntensity).toBe(0);
    expect(discolor.wrapS).toBe(RepeatWrapping);
  });

  test('the same color with unused normal maps still shares a material', () => {
    const a = mapTex();
    const b = mapTex();
    const withA = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: a });
    const withB = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: b });
    expect(withA).toBe(withB);
    expect(withA.normalMap).toBeNull();
  });

  test('red and gold do not share a material', () => {
    const red = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05 });
    const gold = getWeatheredMetalMaterial('#b48455', { metalness: 0.05 });
    expect(red).not.toBe(gold);
  });

  test('does not inject TSL nodes or onBeforeCompile', () => {
    const mat = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05 });
    expect(Object.hasOwn(mat, 'onBeforeCompile')).toBe(false);
    expect(mat.colorNode).toBeUndefined();
    expect(mat.roughnessNode).toBeUndefined();
    expect(mat.metalnessNode).toBeUndefined();
  });
});
