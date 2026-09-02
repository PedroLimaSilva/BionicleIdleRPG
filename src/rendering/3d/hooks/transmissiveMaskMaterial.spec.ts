import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial, Texture } from 'three';
import {
  TRANSMISSIVE_MASK_KAUKAU_OPACITY,
  TRANSMISSIVE_MASK_KAUKAU_ROUGHNESS,
  TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION,
  TRANSMISSIVE_MASK_RAU_ROUGHNESS,
  TRANSMISSIVE_MASK_RAU_TRANSMISSION,
  applyTransmissiveMaskMaterial,
  resolveTransmissiveMaskKind,
} from './transmissiveMaskMaterial';
import { TRANSMISSIVE_KIT_IOR } from './transmissiveKitMaterial';

describe('resolveTransmissiveMaskKind', () => {
  it('detects Mata Kaukau and Great Rau by material name', () => {
    expect(
      resolveTransmissiveMaskKind(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 0.5 }))
    ).toBe('kaukau');
    expect(
      resolveTransmissiveMaskKind(new MeshStandardMaterial({ name: 'Rau_baked', opacity: 1 }))
    ).toBe('rau');
  });

  it('skips opaque Nuva Kaukau', () => {
    expect(
      resolveTransmissiveMaskKind(new MeshStandardMaterial({ name: 'Kaukau_baked', opacity: 1 }))
    ).toBeUndefined();
  });
});

describe('applyTransmissiveMaskMaterial', () => {
  it('upgrades Mata Kaukau with softer transmission and less alpha', () => {
    const mat = new MeshStandardMaterial({
      metalness: 0.4,
      metalnessMap: new Texture(),
      name: 'Kaukau_baked',
      normalMap: new Texture(),
      opacity: 0.5,
      roughness: 0.8,
      roughnessMap: new Texture(),
    });
    const next = applyTransmissiveMaskMaterial(mat);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next!.transmission).toBe(TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION);
    expect(next!.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(next!.opacity).toBe(TRANSMISSIVE_MASK_KAUKAU_OPACITY);
    expect(next!.roughness).toBe(TRANSMISSIVE_MASK_KAUKAU_ROUGHNESS);
    expect(next!.metalness).toBe(0);
    expect(next!.metalnessMap).toBeNull();
    expect(next!.roughnessMap).toBeNull();
    expect(next!.envMapIntensity).toBe(0.35);
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
    expect(next!.side).toBe(FrontSide);
    expect(next!.normalMap).toBeDefined();
    expect(next!.transmissionMap).toBeNull();
  });

  it('upgrades Great Rau with matte dielectric transmission', () => {
    const mat = new MeshPhysicalMaterial({
      metalnessMap: new Texture(),
      name: 'Rau_baked',
      normalMap: new Texture(),
      opacity: 1,
      roughness: 0.1,
      roughnessMap: new Texture(),
      transmission: 0,
      transmissionMap: new Texture(),
    });
    const next = applyTransmissiveMaskMaterial(mat);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next!.transmission).toBe(TRANSMISSIVE_MASK_RAU_TRANSMISSION);
    expect(next!.roughness).toBe(TRANSMISSIVE_MASK_RAU_ROUGHNESS);
    expect(next!.metalness).toBe(0);
    expect(next!.metalnessMap).toBeNull();
    expect(next!.roughnessMap).toBeNull();
    expect(next!.transmissionMap).toBeNull();
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
  });
});
