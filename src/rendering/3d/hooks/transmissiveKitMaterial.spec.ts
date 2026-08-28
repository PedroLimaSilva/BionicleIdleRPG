import { MeshPhysicalMaterial } from 'three';
import {
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_ROUGHNESS,
  TRANSMISSIVE_KIT_THICKNESS,
  TRANSMISSIVE_KIT_TRANSMISSION,
  buildTransmissiveKitMaterial,
  isTransmissiveKitMaterialName,
} from './transmissiveKitMaterial';

describe('transmissiveKitMaterial', () => {
  test('recognizes brain and Vahki hood kit slots', () => {
    expect(isTransmissiveKitMaterialName('MataBrain_baked')).toBe(true);
    expect(isTransmissiveKitMaterialName('MetruBrain')).toBe(true);
    expect(isTransmissiveKitMaterialName('VahkiHood_baked')).toBe(true);
    expect(isTransmissiveKitMaterialName('Disk_Baked')).toBe(false);
  });

  test('builds uniform transmission + IOR without maps', () => {
    const mat = buildTransmissiveKitMaterial('MataBrain_baked', '#F8F184', '#F8F184', 0.1);
    expect(mat).toBeInstanceOf(MeshPhysicalMaterial);
    expect(mat.color.getHexString().toUpperCase()).toBe('F8F184');
    expect(mat.emissive.getHexString().toUpperCase()).toBe('F8F184');
    expect(mat.emissiveIntensity).toBe(0.1);
    expect(mat.transmission).toBe(TRANSMISSIVE_KIT_TRANSMISSION);
    expect(mat.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(mat.roughness).toBe(TRANSMISSIVE_KIT_ROUGHNESS);
    expect(mat.thickness).toBe(TRANSMISSIVE_KIT_THICKNESS);
    expect(mat.metalness).toBe(0);
    expect(mat.opacity).toBe(1);
    expect(mat.transparent).toBe(true);
    expect(mat.normalMap).toBeNull();
    expect(mat.transmissionMap).toBeNull();
  });
});
