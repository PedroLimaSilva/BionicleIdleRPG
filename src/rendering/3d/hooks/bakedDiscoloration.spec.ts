import { MeshStandardMaterial, Texture } from 'three';
import { adoptBakedDiscolorationMap, getBakedDiscolorationMap } from './bakedDiscoloration';

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
    const mat = new MeshStandardMaterial({ emissiveMap: map, name: 'Kopaka Glow' });
    expect(adoptBakedDiscolorationMap(mat, { isGlow: true })).toBeNull();
    expect(mat.emissiveMap).toBe(map);
  });

  test('returns null when there is no bake', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau_baked' });
    expect(adoptBakedDiscolorationMap(mat)).toBeNull();
    expect(getBakedDiscolorationMap(mat)).toBeNull();
  });
});
