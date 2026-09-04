import { ClampToEdgeWrapping, DataTexture, RepeatWrapping } from 'three';
import { getBakedDiscolorationMap } from '../hooks/bakedDiscoloration';
import { getWeatheredMetalMaterial } from './WeatheredMetalMaterial';

function mapTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
}

describe('getWeatheredMetalMaterial discoloration map cache', () => {
  test('clamps atlas wrap on discoloration and normal maps', () => {
    const discolor = mapTex();
    const normal = mapTex();
    discolor.wrapS = RepeatWrapping;
    discolor.wrapT = RepeatWrapping;
    normal.wrapS = RepeatWrapping;
    normal.wrapT = RepeatWrapping;
    const mat = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: discolor,
      metalness: 0.05,
      normalMap: normal,
    });
    expect(mat.normalMap).toBe(normal);
    expect(discolor.wrapS).toBe(ClampToEdgeWrapping);
    expect(discolor.wrapT).toBe(ClampToEdgeWrapping);
    expect(normal.wrapS).toBe(ClampToEdgeWrapping);
    expect(normal.wrapT).toBe(ClampToEdgeWrapping);
  });

  test('the same atlas maps share a weathered material across kit clones', () => {
    const atlas = mapTex();
    const a = getWeatheredMetalMaterial('#000000', {
      discolorationMap: atlas,
      metalness: 0.05,
      normalMap: atlas,
    });
    const b = getWeatheredMetalMaterial('#000000', {
      discolorationMap: atlas,
      metalness: 0.05,
      normalMap: atlas,
    });
    expect(a).toBe(b);
  });

  test('the same color with different normal maps does not share a material', () => {
    const a = mapTex();
    const b = mapTex();
    const withA = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: a });
    const withB = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: b });
    expect(withA).not.toBe(withB);
    expect(withA.normalMap).toBe(a);
    expect(withB.normalMap).toBe(b);
    expect(withA.roughnessMap).toBeNull();
    expect(withA.metalnessMap).toBeNull();
  });

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
