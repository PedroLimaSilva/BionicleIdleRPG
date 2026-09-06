import { ClampToEdgeWrapping, DataTexture, MeshStandardMaterial, RepeatWrapping } from 'three';
import { DISCOLORATION_MAP_USERDATA_KEY } from '../hooks/bakedDiscoloration';
import { getWeatheredMetalMaterial } from './WeatheredMetalMaterial';

function mapTex(): DataTexture {
  return new DataTexture(new Uint8Array([255, 0, 0, 255]), 1, 1);
}

describe('getWeatheredMetalMaterial', () => {
  test('adopts bake maps into userData and shares materials by color and bake uuid', () => {
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
    expect(a.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(discolor);
    expect(discolor.wrapS).toBe(ClampToEdgeWrapping);
    expect((a as MeshStandardMaterial & { colorNode?: unknown }).colorNode).toBeDefined();
  });

  test('baked discoloration still mixes when grimeDarken is 0', () => {
    const mat = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      grimeDarken: 0,
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    expect(mat.colorNode).toBeDefined();
    expect(mat.emissiveMap).toBeNull();
    expect(mat.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBeDefined();
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

  test('object-space FBM darkens albedo, bumps normals, and shifts PBR in the same patches', () => {
    const mat = getWeatheredMetalMaterial('#c91a09', {
      fineScale: 18,
      grimeDarken: 0.9,
      grimeMetalnessReduce: 0.9,
      grimeRoughness: 0.2,
      largeScale: 3.5,
      metalness: 0.05,
    }) as MeshStandardMaterial & {
      colorNode?: unknown;
      metalnessNode?: unknown;
      normalNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(Object.hasOwn(mat, 'onBeforeCompile')).toBe(false);
    expect(mat.colorNode).toBeDefined();
    expect(mat.metalnessNode).toBeDefined();
    expect(mat.normalNode).toBeDefined();
    expect(mat.roughnessNode).toBeDefined();
    expect(mat.metalness).toBe(0.05);
    expect(mat.color.getHexString()).toBe('c91a09');
  });

  test('grimeDarken 0 leaves albedo as a scalar color', () => {
    const mat = getWeatheredMetalMaterial('#c91a09', {
      grimeDarken: 0,
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    expect(mat.colorNode).toBeUndefined();
    expect(mat.color.getHexString()).toBe('c91a09');
  });

  test('different roughness-noise scales do not share a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', { fineScale: 18, metalness: 0.05 });
    const b = getWeatheredMetalMaterial('#c91a09', { fineScale: 26, metalness: 0.05 });
    expect(a).not.toBe(b);
  });

  test('different metalness-reduce amounts do not share a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', { grimeMetalnessReduce: 0.25, metalness: 0.05 });
    const b = getWeatheredMetalMaterial('#c91a09', { grimeMetalnessReduce: 0.7, metalness: 0.05 });
    expect(a).not.toBe(b);
  });

  test('different albedo-darken amounts do not share a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', { grimeDarken: 0.2, metalness: 0.05 });
    const b = getWeatheredMetalMaterial('#c91a09', { grimeDarken: 0.6, metalness: 0.05 });
    expect(a).not.toBe(b);
  });

  test('different dent strengths do not share a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', { dentStrength: 0.8, metalness: 0.05 });
    const b = getWeatheredMetalMaterial('#c91a09', { dentStrength: 2.4, metalness: 0.05 });
    expect(a).not.toBe(b);
  });

  test('dentStrength 0 leaves the geometric normal', () => {
    const mat = getWeatheredMetalMaterial('#c91a09', {
      dentStrength: 0,
      metalness: 0.05,
    }) as MeshStandardMaterial & { normalNode?: unknown };
    expect(mat.normalNode).toBeUndefined();
  });

  test('high metalness still bumps, but with a different program than plastic', () => {
    const plastic = getWeatheredMetalMaterial('#9ba19d', {
      metalness: 0.05,
    }) as MeshStandardMaterial & { normalNode?: unknown };
    const metal = getWeatheredMetalMaterial('#9ba19d', {
      metalness: 0.95,
    }) as MeshStandardMaterial & { normalNode?: unknown };
    expect(plastic).not.toBe(metal);
    expect(plastic.normalNode).toBeDefined();
    expect(metal.normalNode).toBeDefined();
    expect(plastic.customProgramCacheKey?.()).not.toBe(metal.customProgramCacheKey?.());
  });

  test('different discoloration maps do not share a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      metalness: 0.05,
    });
    const b = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      metalness: 0.05,
    });
    expect(a).not.toBe(b);
  });
});
