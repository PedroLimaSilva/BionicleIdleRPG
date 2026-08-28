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
 * Transmissive visor (`VahkiHood` kit material): runtime transmission + IOR, less clear
 * than brain gel. Tint diffuse / emission from hive eye color (`transmissiveKitMaterial`).
 */
export const VAHKI_HOOD_EMISSIVE_INTENSITY = 0.1;

export const VAHKI_KIT_PALETTE_HOOD: Partial<Record<string, KitMaterialSlotEntry>> = {
  VahkiHood: {
    color: { key: 'eyes', kind: 'palette' },
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: VAHKI_HOOD_EMISSIVE_INTENSITY,
    weathered: false,
  },
};

/** Technic pins / axles / gears on the Vahki chassis. */
export const VAHKI_KIT_PALETTE_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};

/** Shoulder sockets and double sockets — always DarkBluishGray, not hive body. */
export const VAHKI_KIT_PALETTE_SOCKET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.DarkBluishGray },
  Metal: { kind: 'lego', value: LegoColor.DarkBluishGray },
  Solid_Black: { kind: 'lego', value: LegoColor.DarkBluishGray },
  'Solid_Black.002': { kind: 'lego', value: LegoColor.DarkBluishGray },
};
