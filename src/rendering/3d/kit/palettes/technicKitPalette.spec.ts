import { LegoColor } from '../../../../types/Colors';
import { normalizeKitMaterialSlotEntry } from '../kitMaterialUtils';
import {
  KIT_TECHNIC_MAIN_AXLE_GRAY,
  KIT_TECHNIC_MAIN_BLACK,
  KIT_TECHNIC_MAIN_METAL,
} from './technicKitPalette';

describe('technicKitPalette', () => {
  test('single-slot technic palettes target Main', () => {
    expect(KIT_TECHNIC_MAIN_BLACK.Main).toEqual({ kind: 'lego', value: LegoColor.Black });
    const metal = normalizeKitMaterialSlotEntry(KIT_TECHNIC_MAIN_METAL.Main!);
    const axle = normalizeKitMaterialSlotEntry(KIT_TECHNIC_MAIN_AXLE_GRAY.Main!);
    expect(metal.metalness).toBe(0.9);
    expect(axle.roughness).toBe(0.44);
  });
});
