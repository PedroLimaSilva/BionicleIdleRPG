import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import { METRU_WEATHERED } from './metruKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from './partSlots';

/** Metru-era Vahki — same weathering pass as Toa / Matoran Metru. */
export const VAHKI_WEATHERED = METRU_WEATHERED;

export const VAHKI_KIT_PALETTE_BODY = kitPartSlots('body', 'nuva');
export const VAHKI_KIT_PALETTE_ARMS = kitPartSlots('arms', 'mata');
export const VAHKI_KIT_PALETTE_LEGS = kitPartSlots('legs', 'nuva');
export const VAHKI_KIT_PALETTE_FEET = kitPartSlots('feet', 'mata');

export const VAHKI_KIT_PALETTE_WEAPON: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 8),
};

export const VAHKI_KIT_PALETTE_EYES: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...kitPartGlow('body', 35),
};

/**
 * Baked transmissive visor (`VahkiHood_baked`): keep maps / transmission, tint
 * both diffuse and emission from the hive's eye color.
 */
export const VAHKI_KIT_PALETTE_HOOD: Partial<Record<string, KitMaterialSlotEntry>> = {
  VahkiHood_baked: {
    color: { key: 'eyes', kind: 'palette' },
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 3,
    weathered: false,
  },
};

/** Technic pins / axles / gears on the Vahki chassis. */
export const VAHKI_KIT_PALETTE_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};
