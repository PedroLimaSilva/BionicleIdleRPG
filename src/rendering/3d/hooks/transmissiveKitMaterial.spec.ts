import { MeshPhysicalMaterial } from 'three';
import {
  TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
  TRANSMISSIVE_KIT_IOR,
  TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
  buildTransmissiveKitMaterial,
  resolveTransmissiveKitKind,
} from './transmissiveKitMaterial';

describe('transmissiveKitMaterial', () => {
  test('recognizes Brain and VahkiHood when the slot tints emissive', () => {
    const spec = { emissive: { key: 'eyes', kind: 'palette' as const } };
    expect(resolveTransmissiveKitKind('Brain', spec)).toBe('brain');
    expect(resolveTransmissiveKitKind('VahkiHood', spec)).toBe('vahkiHood');
    expect(
      resolveTransmissiveKitKind('Brain', {
        color: { key: 'eyes', kind: 'palette' },
      } as { emissive?: unknown })
    ).toBe(undefined);
    expect(resolveTransmissiveKitKind('Disk_Baked', spec)).toBe(undefined);
  });

  test('brain is clearer than Vahki hood (higher transmission)', () => {
    expect(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION).toBeGreaterThan(
      TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION
    );
  });

  test('builds uniform transmission + IOR without maps', () => {
    const brain = buildTransmissiveKitMaterial('Brain', 'brain', '#F8F184', '#F8F184', 0.1);
    const hood = buildTransmissiveKitMaterial('VahkiHood', 'vahkiHood', '#F8F184', '#F8F184', 0.1);
    expect(brain).toBeInstanceOf(MeshPhysicalMaterial);
    expect(brain.transmission).toBe(TRANSMISSIVE_KIT_BRAIN_TRANSMISSION);
    expect(hood.transmission).toBe(TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION);
    expect(brain.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(hood.ior).toBe(TRANSMISSIVE_KIT_IOR);
    expect(brain.normalMap).toBeNull();
    expect(hood.transmissionMap).toBeNull();
  });
});
