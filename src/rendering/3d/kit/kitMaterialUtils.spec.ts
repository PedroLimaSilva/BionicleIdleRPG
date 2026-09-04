import { canonicalKitSlotName, normalizeKitMaterialSlotEntry } from './kitMaterialUtils';
import { LegoColor } from '../../../types/Colors';

describe('canonicalKitSlotName', () => {
  test('keeps unbaked slot names and strips Blender indices', () => {
    expect(canonicalKitSlotName('Main')).toBe('main');
    expect(canonicalKitSlotName('Main.001')).toBe('main');
    expect(canonicalKitSlotName('Secondary.002')).toBe('secondary');
  });

  test('reads the slot prefix from bake names', () => {
    expect(canonicalKitSlotName('Main_baked')).toBe('main');
    expect(canonicalKitSlotName('Main_MataChest_baked')).toBe('main');
    expect(canonicalKitSlotName('Secondary_MataLegModShin_baked')).toBe('secondary');
    expect(canonicalKitSlotName('Secondary_MataLegModShin_baked.001')).toBe('secondary');
    expect(canonicalKitSlotName('Metal_MataLegModThigh_baked')).toBe('metal');
  });

  test('does not guess Main for unprefixed bake names', () => {
    expect(canonicalKitSlotName('MataChest_baked')).toBe('matachest_baked');
  });

  test('leaves non-slot kit materials unchanged', () => {
    expect(canonicalKitSlotName('Solid_Black')).toBe('solid_black');
    expect(canonicalKitSlotName('Lewa Green02')).toBe('lewa green02');
  });
});

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
