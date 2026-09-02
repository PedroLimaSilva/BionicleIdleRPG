import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial, Texture } from 'three';
import {
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
  it('upgrades Mata Kaukau to runtime transmission while keeping opacity', () => {
    const mat = new MeshStandardMaterial({
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
    expect(next!.opacity).toBe(0.5);
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
    expect(next!.side).toBe(FrontSide);
    expect(next!.normalMap).toBeDefined();
    expect(next!.transmissionMap).toBeNull();
  });

  it('upgrades Great Rau and drops baked transmission maps', () => {
    const mat = new MeshPhysicalMaterial({
      name: 'Rau_baked',
      normalMap: new Texture(),
      opacity: 1,
      roughness: 0.5,
      transmission: 0,
      transmissionMap: new Texture(),
    });
    const next = applyTransmissiveMaskMaterial(mat);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next!.transmission).toBe(TRANSMISSIVE_MASK_RAU_TRANSMISSION);
    expect(next!.transmissionMap).toBeNull();
    expect(next!.transparent).toBe(true);
    expect(next!.depthWrite).toBe(false);
  });
});
