import { MeshPhysicalMaterial } from 'three';
import {
  TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION,
  TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
  buildTransmissiveKitMaterial,
  resolveTransmissiveKitKind,
} from './transmissiveKitMaterial';

describe('transmissiveKitMaterial', () => {
  test('uses explicit transmissive preset when the slot tints emissive', () => {
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
    const mctoran = buildTransmissiveKitMaterial('Brain', 'mctoranFace', '#F8F184', '#F8F184', 0.1);
    const hood = buildTransmissiveKitMaterial('VahkiHood', 'vahkiHood', '#F8F184', '#F8F184', 0.1);
    expect(brain).toBeInstanceOf(MeshPhysicalMaterial);
    expect(brain.transmission).toBe(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION);
    expect(mctoran.transmission).toBe(TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION);
    expect(hood.transmission).toBe(TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION);
    expect(brain.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(brain.depthWrite).toBe(false);
    expect(brain.normalMap).toBeNull();
    expect(hood.transmissionMap).toBeNull();
  });
});
