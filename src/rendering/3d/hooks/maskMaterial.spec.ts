import {
  BufferGeometry,
  FrontSide,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Texture,
} from 'three';
import { LegoColor } from '../../../types/Colors';
import { KANOHI_PAINT_METALNESS } from '../kit/palettes/metalPbr';
import {
  applyMaskGlowTint,
  applyMaskMetallicPbr,
  cloneGreatMaskMaterial,
  cloneMaskMeshMaterials,
  configureKaukauTransmission,
  isMaskGlowMaterialName,
  KAUKAU_IOR,
  KAUKAU_TRANSMISSION,
  MASK_LENS_GLOW_EMISSIVE_INTENSITY,
  maskHasBakedPbrAlpha,
  maskNeedsAlphaBlend,
  prepareClonedMaskMaterial,
  TRANSMISSIVE_KANOHI_SHELL_THICKNESS,
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

  it('promotes dual-mode Mata Kaukau to transmission-only rendering', () => {
    const nuva = new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 1, roughness: 0.5 });
    prepareClonedMaskMaterial(nuva);
    expect(nuva.transparent).toBe(false);
    expect(nuva.side).toBe(FrontSide);
    expect(nuva.depthWrite).toBe(true);

    const mata = new MeshPhysicalMaterial({
      name: 'Kaukau_baked',
      opacity: 0.75,
      roughness: 0.5,
      transmission: 0.75,
    });
    prepareClonedMaskMaterial(mata);
    expect(mata.transparent).toBe(true);
    expect(mata.opacity).toBe(1);
    expect(mata.transmission).toBe(KAUKAU_TRANSMISSION);
    expect(mata.ior).toBe(KAUKAU_IOR);
    expect(mata.thickness).toBe(TRANSMISSIVE_KANOHI_SHELL_THICKNESS);
    expect(mata.depthWrite).toBe(false);
    expect(mata.side).toBe(FrontSide);
  });

  it('forces Mata Kaukau sculpt onto transmission even without GLB alpha', () => {
    const body = new MeshPhysicalMaterial({ name: 'Kaukau_baked', opacity: 1, roughness: 0.5 });
    const geometry = new BufferGeometry();
    geometry.groups = [{ count: 10, materialIndex: 0, start: 0 }];
    const mesh = new Mesh(geometry, body);
    cloneMaskMeshMaterials(mesh, 'Kaukau');
    const mat = mesh.material as MeshPhysicalMaterial;
    expect(mat.transparent).toBe(true);
    expect(mat.opacity).toBe(1);
    expect(mat.transmission).toBe(KAUKAU_TRANSMISSION);
    expect(mat.ior).toBe(KAUKAU_IOR);
    expect(mat.thickness).toBe(TRANSMISSIVE_KANOHI_SHELL_THICKNESS);
  });

  it('configureKaukauTransmission keeps authored transmission when present', () => {
    const mata = new MeshPhysicalMaterial({
      ior: 1.6,
      name: 'Kaukau_baked',
      opacity: 0.75,
      roughness: 0.5,
      transmission: 0.6,
    });
    configureKaukauTransmission(mata);
    expect(mata.opacity).toBe(1);
    expect(mata.transmission).toBe(0.6);
    expect(mata.ior).toBe(KAUKAU_IOR);
  });

  it('strips physical transmission on opacity-only blended masks', () => {
    const faded = new MeshPhysicalMaterial({
      name: 'Hau_baked',
      opacity: 0.75,
      roughness: 0.5,
      transmission: 0,
    });
    prepareClonedMaskMaterial(faded);
    expect(faded.transparent).toBe(true);
    expect(faded.depthWrite).toBe(false);
    expect(faded.transmission).toBe(0);
    expect(faded.side).toBe(FrontSide);
  });

  it('treats lens material slots as glow', () => {
    expect(isMaskGlowMaterialName('Lens')).toBe(true);
    expect(isMaskGlowMaterialName('Akaku_Lens')).toBe(true);
    expect(isMaskGlowMaterialName('Glow')).toBe(true);
  });

  it('tints glow slots from eye color at Nuva lens intensity without white albedo', () => {
    const lens = new MeshStandardMaterial({ name: 'Glow', roughness: 0.5 });
    applyMaskGlowTint(lens, '#00aaff');
    expect(lens.emissive.getHexString()).toBe('00aaff');
    expect(lens.emissiveIntensity).toBe(MASK_LENS_GLOW_EMISSIVE_INTENSITY);
    expect(lens.color.getHexString()).toBe('000000');
  });

  it('splits Akaku scope lenses into a glow material slot', () => {
    const body = new MeshStandardMaterial({ name: 'Akaku_baked.001', roughness: 0.5 });
    const geometry = new BufferGeometry();
    geometry.groups = [
      { count: 10, materialIndex: 0, start: 0 },
      { count: 5, materialIndex: 0, start: 10 },
    ];
    const mesh = new Mesh(geometry, body);
    cloneMaskMeshMaterials(mesh, 'Akaku');
    expect(Array.isArray(mesh.material)).toBe(true);
    const mats = mesh.material as unknown as MeshStandardMaterial[];
    expect(mats).toHaveLength(2);
    expect(mats[1].name).toBe('Glow');
    expect(isMaskGlowMaterialName(mats[1].name)).toBe(true);
    expect(geometry.groups[1].materialIndex).toBe(1);
  });

  it('leaves glow materials metallic for emissive lenses', () => {
    const mat = new MeshStandardMaterial({ metalness: 0.8, name: 'Glow', roughness: 0.2 });
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
