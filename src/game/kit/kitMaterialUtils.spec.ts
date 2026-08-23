import { normalizeKitMaterialSlotEntry } from './kitMaterialUtils';
import { LegoColor } from '../../types/Colors';

describe('normalizeKitMaterialSlotEntry', () => {
  test('wraps lego, palette, and part shorthand sources as color', () => {
    expect(normalizeKitMaterialSlotEntry({ kind: 'lego', value: LegoColor.Red })).toEqual({
      color: { kind: 'lego', value: LegoColor.Red },
    });
    expect(normalizeKitMaterialSlotEntry({ key: 'mask', kind: 'palette' })).toEqual({
      color: { key: 'mask', kind: 'palette' },
    });
    expect(normalizeKitMaterialSlotEntry({ kind: 'part', part: 'arms', slot: 'main' })).toEqual({
      color: { kind: 'part', part: 'arms', slot: 'main' },
    });
  });

  test('leaves full slot overrides untouched', () => {
    const entry = {
      color: { kind: 'part' as const, part: 'body' as const, slot: 'metal' as const },
      metalness: 0.9,
    };
    expect(normalizeKitMaterialSlotEntry(entry)).toBe(entry);
  });
});
