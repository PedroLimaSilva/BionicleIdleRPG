import { FrontSide, MeshStandardMaterial, Texture } from 'three';
import { LegoColor } from '../../../types/Colors';
import { KANOHI_PAINT_METALNESS } from '../kit/palettes/metalPbr';
import {
  applyMaskMetallicPbr,
  cloneGreatMaskMaterial,
  maskHasBakedPbrAlpha,
  maskNeedsAlphaBlend,
  prepareClonedMaskMaterial,
} from './maskMaterial';
import { getBakedDiscolorationMap } from './bakedDiscoloration';

describe('maskNeedsAlphaBlend', () => {
  it('detects sub-1 opacity and trans-named masks', () => {
    expect(
      maskNeedsAlphaBlend(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 1 }))
    ).toBe(false);
    expect(
      maskNeedsAlphaBlend(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 0.5 }))
    ).toBe(true);
    expect(maskNeedsAlphaBlend(new MeshStandardMaterial({ name: 'Hau_baked', opacity: 0.5 }))).toBe(
      true
    );
    expect(maskNeedsAlphaBlend(new MeshStandardMaterial({ name: 'Hau_baked', opacity: 1 }))).toBe(
      false
    );
    expect(
      maskNeedsAlphaBlend(new MeshStandardMaterial({ name: 'Rau_trans_baked', opacity: 1 }))
    ).toBe(true);
  });
});

describe('prepareClonedMaskMaterial', () => {
  it('keeps opaque Hau in the opaque pass with FrontSide', () => {
    const mat = new MeshStandardMaterial({ metalness: 1, name: 'Hau_baked', roughness: 0.1 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(false);
    expect(mat.side).toBe(FrontSide);
    expect(mat.depthWrite).toBe(true);
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
    expect(mat.transparent).toBe(false);
    expect(mat.side).toBe(FrontSide);
    expect(mat.metalness).toBe(0.85);
    expect(mat.roughness).toBe(0.12);
    expect(mat.normalMap).toBeDefined();
    expect(mat.roughnessMap).toBeDefined();
  });

  it('keeps Nuva Kaukau opaque while Mata Kaukau blends', () => {
    const nuva = new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 1, roughness: 0.5 });
    prepareClonedMaskMaterial(nuva);
    expect(nuva.transparent).toBe(false);
    expect(nuva.side).toBe(FrontSide);
    expect(nuva.depthWrite).toBe(true);

    const mata = new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 0.5, roughness: 0.5 });
    prepareClonedMaskMaterial(mata);
    expect(mata.transparent).toBe(true);
  });

  it('leaves glow materials metallic for emissive lenses', () => {
    const mat = new MeshStandardMaterial({ metalness: 0.8, name: 'Kopaka Glow', roughness: 0.2 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.8);
    expect(mat.roughness).toBe(0.2);
  });

  it('adopts a baked emissiveMap as discoloration and keeps other PBR maps', () => {
    const bake = new Texture();
    const mat = new MeshStandardMaterial({
      emissiveMap: bake,
      metalness: 0.4,
      name: 'Hau_baked',
      normalMap: new Texture(),
      roughness: 0.3,
      roughnessMap: new Texture(),
    });
    prepareClonedMaskMaterial(mat);
    expect(mat.emissiveMap).toBeNull();
    expect(getBakedDiscolorationMap(mat)).toBe(bake);
    expect(mat.normalMap).toBeDefined();
    expect(mat.roughnessMap).toBeDefined();
    expect(mat.metalness).toBe(0.4);
    expect(mat.roughness).toBe(0.3);
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

  it('drops weak metalness maps on painted Kanohi and keeps roughness maps', () => {
    const metalnessMap = new Texture();
    const roughnessMap = new Texture();
    const mat = new MeshStandardMaterial({
      metalness: 1,
      metalnessMap,
      name: 'Hau_baked',
      roughness: 1,
      roughnessMap,
    });
    applyMaskMetallicPbr(mat, LegoColor.Red);
    expect(mat.metalnessMap).toBeNull();
    expect(mat.metalness).toBe(KANOHI_PAINT_METALNESS);
    expect(mat.roughness).toBe(1);
    expect(mat.roughnessMap).toBe(roughnessMap);
  });
});

describe('maskHasBakedPbrAlpha', () => {
  it('detects baked transmission maps on Great Rau', () => {
    const mat = new MeshStandardMaterial({
      name: 'Rau_baked',
      opacity: 1,
      roughness: 0.5,
    }) as MeshStandardMaterial & { transmissionMap: Texture | null };
    mat.transmissionMap = new Texture();
    expect(maskHasBakedPbrAlpha(mat)).toBe(true);
    expect(maskNeedsAlphaBlend(mat)).toBe(true);
  });
});

describe('syncMaskTransparencyState', () => {
  it('keeps baked-alpha Great Rau in the transparent pass at full opacity', () => {
    const mat = new MeshStandardMaterial({
      name: 'Rau_baked',
      opacity: 1,
      roughness: 0.5,
    }) as MeshStandardMaterial & { transmissionMap: Texture | null };
    mat.transmissionMap = new Texture();
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.opacity).toBe(1);
  });
});

describe('cloneGreatMaskMaterial', () => {
  it('clones gold Great Kanohi while keeping baked PBR maps', () => {
    const original = new MeshStandardMaterial({
      metalness: 0.2,
      metalnessMap: new Texture(),
      name: 'Hau_baked',
      normalMap: new Texture(),
      roughness: 0.8,
      roughnessMap: new Texture(),
    });
    const mat = cloneGreatMaskMaterial(original, LegoColor.FlatDarkGold);
    expect(mat.transparent).toBe(false);
    expect(mat.side).toBe(FrontSide);
    expect(mat.metalness).toBe(0.2);
    expect(mat.normalMap).toBeDefined();
    expect(mat.roughnessMap).toBeDefined();
    expect(mat.metalnessMap).toBeDefined();
    applyMaskMetallicPbr(mat, LegoColor.FlatDarkGold);
    expect(mat.metalnessMap).toBeNull();
    expect(mat.metalness).toBe(0.95);
    expect(mat.roughness).toBe(0.18);
    expect(mat.envMapIntensity).toBe(0.9);
  });

  it('clones non-gold materials with dielectric fallbacks', () => {
    const original = new MeshStandardMaterial({ metalness: 1, name: 'Huna_baked', roughness: 0.1 });
    const mat = cloneGreatMaskMaterial(original, LegoColor.Red);
    expect(mat.transparent).toBe(false);
    expect(mat.metalness).toBe(0);
    expect(mat.roughness).toBe(0.55);
  });

  it('clones glow materials without dielectric fallback', () => {
    const original = new MeshStandardMaterial({
      metalness: 0.8,
      name: 'Matatu Glow',
      roughness: 0.2,
    });
    const mat = cloneGreatMaskMaterial(original, LegoColor.FlatDarkGold);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.8);
    expect(mat.roughness).toBe(0.2);
  });
});
