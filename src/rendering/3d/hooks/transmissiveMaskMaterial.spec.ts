import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial, Texture } from 'three';
import {
  TRANSMISSIVE_MASK_KAUKAU_OPACITY,
  TRANSMISSIVE_MASK_KAUKAU_ROUGHNESS,
  TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION,
  applyTransmissiveMaskMaterial,
  isKaukauTransmissiveMask,
} from './transmissiveMaskMaterial';
import {
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS,
} from './transmissiveKitMaterial';

describe('isKaukauTransmissiveMask', () => {
  it('detects Mata Kaukau by material name and sub-1 opacity', () => {
    expect(
      isKaukauTransmissiveMask(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 0.5 }))
    ).toBe(true);
  });

  it('skips opaque Nuva Kaukau and baked Great Rau', () => {
    expect(
      isKaukauTransmissiveMask(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 1 }))
    ).toBe(false);
    expect(
      isKaukauTransmissiveMask(new MeshPhysicalMaterial({ name: 'Rau_baked', opacity: 1 }))
    ).toBe(false);
  });
});

describe('applyTransmissiveMaskMaterial', () => {
  it('upgrades Mata Kaukau while keeping baked PBR maps', () => {
    const metalnessMap = new Texture();
    const roughnessMap = new Texture();
    const mat = new MeshStandardMaterial({
      metalness: 0.4,
      metalnessMap,
      name: 'Kaukau_baked',
      normalMap: new Texture(),
      opacity: 0.5,
      roughness: 0.8,
      roughnessMap,
    });
    const next = applyTransmissiveMaskMaterial(mat);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next!.transmission).toBe(TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION);
    expect(next!.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(next!.opacity).toBe(TRANSMISSIVE_MASK_KAUKAU_OPACITY);
    expect(next!.roughness).toBe(TRANSMISSIVE_MASK_KAUKAU_ROUGHNESS);
    expect(next!.roughness).toBeLessThan(TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS);
    expect(next!.metalnessMap).toBe(metalnessMap);
    expect(next!.roughnessMap).toBe(roughnessMap);
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
    expect(next!.side).toBe(FrontSide);
    expect(next!.normalMap).toBeDefined();
  });

  it('leaves Great Rau to GLB baked transmission and alpha maps', () => {
    const transmissionMap = new Texture();
    const mat = new MeshPhysicalMaterial({
      name: 'Rau_baked',
      opacity: 1,
      transmission: 1,
      transmissionMap,
    });
    expect(applyTransmissiveMaskMaterial(mat)).toBeUndefined();
  });
});
