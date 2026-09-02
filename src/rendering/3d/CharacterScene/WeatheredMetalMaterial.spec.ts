import { DataTexture, MeshStandardMaterial } from 'three';
import { getWeatheredBevelMap, getWeatheredMetalMaterial } from './WeatheredMetalMaterial';

function mapTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
}

describe('getWeatheredMetalMaterial bevel map cache', () => {
  test('the same color with different maps does not share a material', () => {
    const a = mapTex();
    const b = mapTex();
    const withA = getWeatheredMetalMaterial('#ffffff', { bevelMap: a, metalness: 0.05 });
    const withB = getWeatheredMetalMaterial('#ffffff', { bevelMap: b, metalness: 0.05 });
    const without = getWeatheredMetalMaterial('#ffffff', { metalness: 0.05 });
    expect(withA).not.toBe(withB);
    expect(withA).not.toBe(without);
    expect(getWeatheredBevelMap(withA)).toBe(a);
    expect(getWeatheredBevelMap(withB)).toBe(b);
    expect(getWeatheredBevelMap(without)).toBeNull();
    expect(getWeatheredMetalMaterial('#ffffff', { bevelMap: a, metalness: 0.05 })).toBe(withA);
  });

  test('runtime bevel does not share a cache entry with the baked-map material', () => {
    const a = mapTex();
    const baked = getWeatheredMetalMaterial('#ffffff', { bevelMap: a, metalness: 0.05 });
    const runtime = getWeatheredMetalMaterial('#ffffff', { metalness: 0.05, runtimeBevel: true });
    expect(runtime).not.toBe(baked);
    expect(getWeatheredBevelMap(runtime)).toBeNull();
  });

  test('non-weathered materials report no map', () => {
    expect(getWeatheredBevelMap(new MeshStandardMaterial())).toBeNull();
  });
});
