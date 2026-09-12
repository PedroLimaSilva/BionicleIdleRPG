import {
  BoxGeometry,
  ClampToEdgeWrapping,
  DataTexture,
  Group,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
} from 'three';
import { DISCOLORATION_MAP_USERDATA_KEY } from '../hooks/bakedDiscoloration';
import { applyWeatheredMetalToObject, getWeatheredMetalMaterial } from './WeatheredMetalMaterial';

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
    });
    const b = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: discolor,
      metalness: 0.05,
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

  test('authored normal maps are kept and do not share a material', () => {
    const a = mapTex();
    const b = mapTex();
    const withA = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: a });
    const withB = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05, normalMap: b });
    expect(withA).not.toBe(withB);
    expect(withA.normalMap).toBe(a);
    expect(withB.normalMap).toBe(b);
    expect((withA as MeshStandardMaterial & { normalNode?: unknown }).normalNode).toBeUndefined();
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
    expect(a.customProgramCacheKey?.()).toBe(b.customProgramCacheKey?.());
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

  test('high metalness still bumps, and shares a GPU program with plastic', () => {
    const plastic = getWeatheredMetalMaterial('#9ba19d', {
      metalness: 0.05,
    }) as MeshStandardMaterial & { normalNode?: unknown };
    const metal = getWeatheredMetalMaterial('#9ba19d', {
      metalness: 0.95,
    }) as MeshStandardMaterial & { normalNode?: unknown };
    expect(plastic).not.toBe(metal);
    expect(plastic.normalNode).toBeDefined();
    expect(metal.normalNode).toBeDefined();
    expect(plastic.customProgramCacheKey?.()).toBe(metal.customProgramCacheKey?.());
  });

  test('red and gold share a GPU program but not a material instance', () => {
    const red = getWeatheredMetalMaterial('#c91a09', { metalness: 0.05 });
    const gold = getWeatheredMetalMaterial('#b48455', { metalness: 0.05 });
    expect(red).not.toBe(gold);
    expect(red.customProgramCacheKey?.()).toBe(gold.customProgramCacheKey?.());
  });

  test('different discoloration maps share a GPU program but not a material', () => {
    const a = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      metalness: 0.05,
    });
    const b = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      metalness: 0.05,
    });
    expect(a).not.toBe(b);
    expect(a.customProgramCacheKey?.()).toBe(b.customProgramCacheKey?.());
  });

  test('no-bake plastics share a color graph that is not the bake-mix graph', () => {
    const red = getWeatheredMetalMaterial('#c91a09', {
      metalness: 0.05,
    }) as MeshStandardMaterial & {
      colorNode?: unknown;
    };
    const gold = getWeatheredMetalMaterial('#b48455', {
      metalness: 0.05,
    }) as MeshStandardMaterial & {
      colorNode?: unknown;
    };
    const baked = getWeatheredMetalMaterial('#c91a09', {
      discolorationMap: mapTex(),
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    expect(red.colorNode).toBe(gold.colorNode);
    expect(red.colorNode).not.toBe(baked.colorNode);
    expect(red.customProgramCacheKey?.()).not.toBe(baked.customProgramCacheKey?.());
  });

  test('mapped albedo uses a distinct shared color graph from unmapped plastic', () => {
    const unmapped = getWeatheredMetalMaterial('#c91a09', {
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    const mappedA = getWeatheredMetalMaterial('#c91a09', {
      map: mapTex(),
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    const mappedB = getWeatheredMetalMaterial('#b48455', {
      map: mapTex(),
      metalness: 0.05,
    }) as MeshStandardMaterial & { colorNode?: unknown };
    expect(mappedA.colorNode).toBe(mappedB.colorNode);
    expect(mappedA.colorNode).not.toBe(unmapped.colorNode);
    expect(mappedA.customProgramCacheKey?.()).toContain('alb');
    expect(unmapped.customProgramCacheKey?.()).not.toContain('alb');
  });
});

describe('applyWeatheredMetalToObject uniqueMaterials', () => {
  test('same color still gets a private material when uniqueMaterials is set', () => {
    const shared = new MeshStandardMaterial({ color: '#ffffff', name: 'Primary' });
    const a = new Group();
    a.add(new Mesh(new BoxGeometry(), shared));
    const b = new Group();
    b.add(new Mesh(new BoxGeometry(), shared));

    applyWeatheredMetalToObject(a, {
      materialColorMap: { Primary: '#c91a09' },
      uniqueMaterials: true,
    });
    applyWeatheredMetalToObject(b, {
      materialColorMap: { Primary: '#c91a09' },
      uniqueMaterials: true,
    });

    expect((a.children[0] as Mesh).material).not.toBe((b.children[0] as Mesh).material);
    expect(((a.children[0] as Mesh).material as MeshStandardMaterial).color.getHexString()).toBe(
      'c91a09'
    );
  });
});

describe('applyWeatheredMetalToObject PBR map preservation', () => {
  test('weathers mapped materials and keeps albedo, normal, and roughness maps', () => {
    const albedo = mapTex();
    const normal = mapTex();
    const mr = mapTex();
    const source = new MeshStandardMaterial({
      color: '#ffffff',
      map: albedo,
      metalness: 0.5,
      metalnessMap: mr,
      name: 'Back_baked',
      normalMap: normal,
      roughness: 1,
      roughnessMap: mr,
    });
    const mesh = new Mesh(new BoxGeometry(), source);
    applyWeatheredMetalToObject(new Group().add(mesh), {
      materialColorMap: { Back_baked: '#c91a09' },
      metalness: 0.05,
      roughness: 0.55,
      uniqueMaterials: true,
    });
    const next = mesh.material as MeshStandardMaterial & {
      colorNode?: unknown;
      metalnessNode?: unknown;
      normalNode?: unknown;
      roughnessNode?: unknown;
    };
    expect(next).not.toBe(source);
    expect(next.color.getHexString()).toBe('c91a09');
    expect(next.map).toBe(albedo);
    expect(next.normalMap).toBe(normal);
    expect(next.roughnessMap).toBe(mr);
    expect(next.metalnessMap).toBeNull();
    expect(next.metalness).toBe(0.05);
    expect(next.colorNode).toBeDefined();
    expect(next.normalNode).toBeUndefined();
    expect(next.roughnessNode).toBeUndefined();
    expect(next.metalnessNode).toBeDefined();
  });

  test('keeps authored metalness maps when weathering does not pass a metalness scalar', () => {
    const mr = mapTex();
    const source = new MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.5,
      metalnessMap: mr,
      name: 'Back_baked',
      roughness: 1,
      roughnessMap: mr,
    });
    const mesh = new Mesh(new BoxGeometry(), source);
    applyWeatheredMetalToObject(new Group().add(mesh), {
      materialColorMap: { Back_baked: '#c91a09' },
      uniqueMaterials: true,
    });
    const next = mesh.material as MeshStandardMaterial;
    expect(next.metalnessMap).toBe(mr);
    expect(next.metalness).toBe(0.5);
  });

  test('resolves meshName_baked when re-weatering an already-renamed WeatheredMetal slot', () => {
    const discolor = mapTex();
    const roughness = mapTex();
    const source = new MeshStandardMaterial({
      color: '#cccccc',
      emissive: '#ffffff',
      emissiveIntensity: 1,
      emissiveMap: discolor,
      metalnessMap: mapTex(),
      name: 'WeatheredMetal',
      normalMap: mapTex(),
      roughnessMap: roughness,
    });
    const mesh = new Mesh(new BoxGeometry(), source);
    mesh.name = 'RahkshiShoulders';

    applyWeatheredMetalToObject(mesh, {
      materialColorMap: { RahkshiShoulders_baked: '#6d6e5c' },
      uniqueMaterials: true,
    });

    const next = mesh.material as MeshStandardMaterial;
    expect(next).not.toBe(source);
    expect(next.color.getHexString()).toBe('6d6e5c');
    expect(next.normalMap).toBeDefined();
    expect(next.roughnessMap).toBe(roughness);
    expect(next.emissiveMap).toBeNull();
    expect(next.emissiveIntensity).toBe(0);
    expect(next.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(discolor);
  });
});
