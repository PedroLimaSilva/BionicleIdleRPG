import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial, Texture } from 'three';
import {
  TRANSMISSIVE_MASK_KAUKAU_OPACITY,
  TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION,
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
    expect(next!.metalness).toBe(0.4);
    expect(next!.roughness).toBe(0.8);
    expect(next!.metalnessMap).toBe(metalnessMap);
    expect(next!.roughnessMap).toBe(roughnessMap);
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
    expect(next!.side).toBe(FrontSide);
    expect(next!.normalMap).toBeDefined();
  });

  it('upgrades Great Rau while keeping baked transmission and PBR maps', () => {
    const metalnessMap = new Texture();
    const roughnessMap = new Texture();
    const transmissionMap = new Texture();
    const mat = new MeshPhysicalMaterial({
      metalnessMap,
      name: 'Rau_baked',
      normalMap: new Texture(),
      opacity: 1,
      roughness: 0.1,
      roughnessMap,
      transmission: 0,
      transmissionMap,
    });
    const next = applyTransmissiveMaskMaterial(mat);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next!.transmission).toBe(TRANSMISSIVE_MASK_RAU_TRANSMISSION);
    expect(next!.metalnessMap).toBe(metalnessMap);
    expect(next!.roughnessMap).toBe(roughnessMap);
    expect(next!.transmissionMap).toBe(transmissionMap);
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
  });
});
