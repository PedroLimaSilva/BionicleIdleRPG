import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import { KIT_PALETTE_BRAIN, MCTORAN_FACE_BRAIN_SLOT } from './brainKitPalette';
import { mataKitPlayerPaletteGlow } from './mataKitPlayerPalette';
import {
  KIT_TECHNIC_LEGACY_BLACK,
  KIT_TECHNIC_LEGACY_METAL,
  KIT_TECHNIC_MAIN_BLACK,
  KIT_TECHNIC_MAIN_METAL,
} from './technicKitPalette';

/** Technic pins / axles: fixed black (`Main` on single-slot kit meshes). */
export const MATORAN_KIT_PALETTE_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KIT_TECHNIC_MAIN_BLACK,
  ...KIT_TECHNIC_LEGACY_BLACK,
};

/** Flat silver technic: exposed faces vs axle-style pieces (same LEGO gray, different PBR). */
export const MATORAN_KIT_PALETTE_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KIT_TECHNIC_MAIN_METAL,
  ...KIT_TECHNIC_LEGACY_METAL,
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
  Brain: MCTORAN_FACE_BRAIN_SLOT,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
};

export const MATORAN_KIT_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> =
  KIT_PALETTE_BRAIN;

export const MATORAN_KIT_PALETTE_GLOW: Partial<Record<string, KitMaterialSlotEntry>> =
  mataKitPlayerPaletteGlow(50);
