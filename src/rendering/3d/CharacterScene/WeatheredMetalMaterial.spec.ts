import { DataTexture, MeshStandardMaterial } from 'three';
import { getBakedDiscolorationMap } from '../hooks/bakedDiscoloration';
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

describe('getWeatheredMetalMaterial discoloration map cache', () => {
  test('the same color with different discoloration maps does not share a material', () => {
    const a = mapTex();
    const b = mapTex();
    const withA = getWeatheredMetalMaterial('#c91a09', { discolorationMap: a, metalness: 0.05 });
    const withB = getWeatheredMetalMaterial('#c91a09', { discolorationMap: b, metalness: 0.05 });
    expect(withA).not.toBe(withB);
    expect(getBakedDiscolorationMap(withA)).toBe(a);
    expect(getBakedDiscolorationMap(withB)).toBe(b);
    expect(getWeatheredMetalMaterial('#c91a09', { discolorationMap: a, metalness: 0.05 })).toBe(
      withA
    );
  });

  test('red and gold with the same bake do not share a material', () => {
    const map = mapTex();
    const red = getWeatheredMetalMaterial('#c91a09', { discolorationMap: map, metalness: 0.05 });
    const gold = getWeatheredMetalMaterial('#b48455', { discolorationMap: map, metalness: 0.05 });
    expect(red).not.toBe(gold);
    expect(getBakedDiscolorationMap(red)).toBe(map);
    expect(getBakedDiscolorationMap(gold)).toBe(map);
  });
});
