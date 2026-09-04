import { ClampToEdgeWrapping, MeshStandardMaterial, RepeatWrapping, Texture } from 'three';
import {
  adoptBakedDiscolorationMap,
  configureBakedAtlasMap,
  getBakedDiscolorationMap,
  glslUvAttributeForTextureChannel,
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
    map.channel = 1;
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
    expect(map.channel).toBe(1);
  });
});

describe('configureBakedAtlasMap', () => {
  test('clamps wrap so atlas islands do not repeat', () => {
    const map = new Texture();
    map.wrapS = RepeatWrapping;
    map.wrapT = RepeatWrapping;
    configureBakedAtlasMap(map);
    expect(map.wrapS).toBe(ClampToEdgeWrapping);
    expect(map.wrapT).toBe(ClampToEdgeWrapping);
  });
});

describe('glslUvAttributeForTextureChannel', () => {
  test('maps glTF texCoord / Three channel to the GLSL attribute', () => {
    expect(glslUvAttributeForTextureChannel(undefined)).toBe('uv');
    expect(glslUvAttributeForTextureChannel(0)).toBe('uv');
    expect(glslUvAttributeForTextureChannel(1)).toBe('uv1');
    expect(glslUvAttributeForTextureChannel(2)).toBe('uv2');
  });
});
