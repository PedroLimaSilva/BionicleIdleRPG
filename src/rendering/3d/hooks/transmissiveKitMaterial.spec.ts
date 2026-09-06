import { MeshPhysicalMaterial } from 'three';
import {
  TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
  TRANSMISSIVE_KIT_CLEAR_ROUGHNESS,
  TRANSMISSIVE_KIT_CLEAR_TRANSMISSION,
  TRANSMISSIVE_KIT_CRYSTAL_ROUGHNESS,
  TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION,
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION,
  TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
  buildTransmissiveKitMaterial,
  resolveTransmissiveKitKind,
} from './transmissiveKitMaterial';

describe('transmissiveKitMaterial', () => {
  test('uses the explicit transmissive preset, including colorless slots', () => {
    expect(
      resolveTransmissiveKitKind('Brain', {
        emissive: { key: 'eyes', kind: 'palette' as const },
        transmissive: 'brain' as const,
      })
    ).toBe('brain');
    expect(
      resolveTransmissiveKitKind('VahkiHood', {
        emissive: { key: 'eyes', kind: 'palette' as const },
        transmissive: 'vahkiHood' as const,
      })
    ).toBe('vahkiHood');
    expect(
      resolveTransmissiveKitKind('Brain', {
        color: { key: 'eyes', kind: 'palette' as const },
        emissive: { key: 'eyes', kind: 'palette' as const },
        transmissive: 'mctoranFace' as const,
      })
    ).toBe('mctoranFace');
    expect(
      resolveTransmissiveKitKind('Brain', {
        color: { key: 'eyes', kind: 'palette' as const },
        emissive: { key: 'eyes', kind: 'palette' as const },
        transmissive: 'crystal' as const,
      })
    ).toBe('crystal');
    expect(resolveTransmissiveKitKind('CLEAR', { transmissive: 'clear', weathered: false })).toBe(
      'clear'
    );
    expect(resolveTransmissiveKitKind('Brain', { color: { key: 'eyes', kind: 'palette' } })).toBe(
      undefined
    );
    expect(
      resolveTransmissiveKitKind('Disk', {
        emissive: { key: 'eyes', kind: 'palette' as const },
      })
    ).toBe(undefined);
  });

  test('McToran face brain is clearer than Toa brain', () => {
    expect(TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION).toBeGreaterThan(
      TRANSMISSIVE_KIT_BRAIN_TRANSMISSION
    );
  });

  test('builds uniform transmission + IOR without maps', () => {
    const brain = buildTransmissiveKitMaterial('Brain', 'brain', '#F8F184', '#F8F184', 0.1);
    const crystal = buildTransmissiveKitMaterial('Brain', 'crystal', '#0055BF', '#0055BF', 0.1);
    const clear = buildTransmissiveKitMaterial('CLEAR', 'clear', '#ffffff', '#000000', 0);
    const mctoran = buildTransmissiveKitMaterial('Brain', 'mctoranFace', '#F8F184', '#F8F184', 0.1);
    const hood = buildTransmissiveKitMaterial('VahkiHood', 'vahkiHood', '#F8F184', '#F8F184', 0.1);
    expect(brain).toBeInstanceOf(MeshPhysicalMaterial);
    expect(brain.transmission).toBe(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION);
    expect(crystal.transmission).toBe(TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION);
    expect(clear.transmission).toBe(TRANSMISSIVE_KIT_CLEAR_TRANSMISSION);
    expect(clear.transmission).toBeLessThan(crystal.transmission);
    expect(clear.roughness).toBe(TRANSMISSIVE_KIT_CLEAR_ROUGHNESS);
    expect(crystal.roughness).toBe(TRANSMISSIVE_KIT_CRYSTAL_ROUGHNESS);
    expect(mctoran.transmission).toBe(TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION);
    expect(hood.transmission).toBe(TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION);
    expect(brain.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(brain.depthWrite).toBe(true);
    expect(brain.transparent).toBe(false);
    expect(brain.normalMap).toBeNull();
    expect(hood.transmissionMap).toBeNull();
    expect(
      (brain as MeshPhysicalMaterial & { transmissionNode?: unknown }).transmissionNode
    ).toBeDefined();
    expect((brain as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
    expect((crystal as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
    expect((clear as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeUndefined();
    expect((mctoran as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeUndefined();
    expect((hood as MeshPhysicalMaterial & { mrtNode?: unknown }).mrtNode).toBeUndefined();
  });
});
