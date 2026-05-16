import type { KitMaterialSlotEntry } from '../types/KitParts';
import { LegoColor } from '../types/Colors';
import { MATA_KIT_PLAYER_PALETTE_BRAIN, mataKitPlayerPaletteGlow } from './mataKitPlayerPalette';

/** Technic pins / axles: fixed black. */
export const REBUILT_KIT_PALETTE_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};

/** Flat silver technic (spacers, gears). */
export const REBUILT_KIT_PALETTE_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

export const REBUILT_KIT_PALETTE_BODY: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'body', kind: 'palette' },
};

export const REBUILT_KIT_PALETTE_ARMS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'arms', kind: 'palette' },
};

export const REBUILT_KIT_PALETTE_FEET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'feet', kind: 'palette' },
};

export const REBUILT_KIT_PALETTE_FACE: Partial<Record<string, KitMaterialSlotEntry>> = {
  Face: { color: { key: 'face', kind: 'palette' }, weathered: false },
};

export const REBUILT_KIT_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
};

export const REBUILT_KIT_PALETTE_GLOW: Partial<Record<string, KitMaterialSlotEntry>> =
  mataKitPlayerPaletteGlow(50);
