import type { KitMaterialSlotEntry } from '../../../types/KitParts';
import { LegoColor } from '../../../types/Colors';
import { MATA_KIT_PLAYER_PALETTE_BRAIN, mataKitPlayerPaletteGlow } from './mataKitPlayerPalette';

/** Technic pins / axles: fixed black. */
export const MATORAN_KIT_PALETTE_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: { kind: 'lego', value: LegoColor.Black },
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};

/** Flat silver technic: exposed faces vs axle-style pieces (same LEGO gray, different PBR). */
export const MATORAN_KIT_PALETTE_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
  /** GLB material name; still light gray in kit data — duller, more handled/worn read. */
  Solid_Black: {
    cavityStrength: 0.55,
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.42,
    fineScale: 20,
    grimeMetalnessReduce: 0.58,
    grimeRoughness: 0.3,
    largeScale: 4.2,
    metalness: 0.74,
    roughness: 0.44,
  },
};

export const MATORAN_KIT_PALETTE_BODY: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'body', slot: 'main' },
};

export const MATORAN_KIT_PALETTE_ARMS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'arms', slot: 'main' },
};

export const MATORAN_KIT_PALETTE_FEET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'feet', slot: 'main' },
};

export const MATORAN_KIT_PALETTE_FACE: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...mataKitPlayerPaletteGlow(50),
  Brain: { color: { key: 'eyes', kind: 'palette' }, weathered: false },
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
};

export const MATORAN_KIT_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
};

export const MATORAN_KIT_PALETTE_GLOW: Partial<Record<string, KitMaterialSlotEntry>> =
  mataKitPlayerPaletteGlow(50);
