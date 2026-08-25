import { MeshStandardMaterial, Texture } from 'three';
import { isWeatheredMetalMaterial } from '../components/CharacterScene/WeatheredMetalMaterial';
import { LegoColor } from '../types/Colors';
import {
  applyMaskMetallicPbr,
  cloneGreatMaskMaterial,
  prepareClonedMaskMaterial,
} from './maskMaterial';

describe('prepareClonedMaskMaterial', () => {
  it('forces dielectric shading on non-glow mask materials without PBR maps', () => {
    const mat = new MeshStandardMaterial({ metalness: 1, name: 'Hau_baked', roughness: 0.1 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0);
    expect(mat.roughness).toBe(0.55);
  });

  it('keeps GLB PBR scalars and maps when normal/roughness/metalness maps are present', () => {
    const mat = new MeshStandardMaterial({
      metalness: 0.85,
      name: 'Akaku_baked',
      normalMap: new Texture(),
      roughness: 0.12,
      roughnessMap: new Texture(),
    });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.85);
    expect(mat.roughness).toBe(0.12);
    expect(mat.normalMap).toBeDefined();
    expect(mat.roughnessMap).toBeDefined();
  });

  it('leaves glow materials metallic for emissive lenses', () => {
    const mat = new MeshStandardMaterial({ metalness: 0.8, name: 'Kopaka Glow', roughness: 0.2 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.8);
    expect(mat.roughness).toBe(0.2);
  });

  it('boosts gold mask colors beyond baked PBR map metalness', () => {
    const metalnessMap = new Texture();
    const mat = new MeshStandardMaterial({
      metalness: 0.2,
      metalnessMap,
      name: 'Hau_baked.001',
      roughness: 0.8,
      roughnessMap: new Texture(),
    });
    applyMaskMetallicPbr(mat, LegoColor.FlatDarkGold);
    expect(mat.metalnessMap).toBeNull();
    expect(mat.metalness).toBe(0.95);
    expect(mat.roughness).toBe(0.18);
    expect(mat.envMapIntensity).toBe(0.9);
    expect(mat.roughnessMap).toBeDefined();
  });
});

describe('cloneGreatMaskMaterial', () => {
  it('uses weathered metal for gold Great Kanohi', () => {
    const original = new MeshStandardMaterial({
      metalness: 0.2,
      metalnessMap: new Texture(),
      name: 'Hau_baked',
      roughness: 0.8,
    });
    const mat = cloneGreatMaskMaterial(original, LegoColor.FlatDarkGold);
    expect(isWeatheredMetalMaterial(mat)).toBe(true);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.95);
    expect(mat.roughness).toBe(0.18);
    expect(mat.envMapIntensity).toBe(0.9);
  });

  it('clones non-gold materials with dielectric fallbacks', () => {
    const original = new MeshStandardMaterial({ metalness: 1, name: 'Huna_baked', roughness: 0.1 });
    const mat = cloneGreatMaskMaterial(original, LegoColor.Red);
    expect(isWeatheredMetalMaterial(mat)).toBe(false);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0);
    expect(mat.roughness).toBe(0.55);
  });

  it('clones glow materials without weathered metal', () => {
    const original = new MeshStandardMaterial({
      metalness: 0.8,
      name: 'Matatu Glow',
      roughness: 0.2,
    });
    const mat = cloneGreatMaskMaterial(original, LegoColor.FlatDarkGold);
    expect(isWeatheredMetalMaterial(mat)).toBe(false);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.8);
    expect(mat.roughness).toBe(0.2);
  });
});
