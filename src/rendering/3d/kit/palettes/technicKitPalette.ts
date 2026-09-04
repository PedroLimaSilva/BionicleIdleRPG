import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';

const TECHNIC_BLACK: KitMaterialSlotEntry = { kind: 'lego', value: LegoColor.Black };

const TECHNIC_METAL_FACE: KitMaterialSlotEntry = {
  color: { kind: 'lego', value: LegoColor.LightGray },
  envMapIntensity: 0.52,
  fineScale: 26,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  metalness: 0.9,
  roughness: 0.3,
};

const TECHNIC_AXLE_GRAY: KitMaterialSlotEntry = {
  cavityStrength: 0.55,
  color: { kind: 'lego', value: LegoColor.LightGray },
  envMapIntensity: 0.42,
  fineScale: 20,
  grimeMetalnessReduce: 0.58,
  grimeRoughness: 0.3,
  largeScale: 4.2,
  metalness: 0.74,
  roughness: 0.44,
};

/**
 * kit_2001 technic that exported only `Solid_Black` — now a single `Main` slot
 * (BallJoint, axles, pins, etc.).
 */
export const KIT_TECHNIC_MAIN_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: TECHNIC_BLACK,
};

/**
 * kit_2001 technic that exported only `Metal` — now a single `Main` slot
 * (gears, spacers, etc.).
 */
export const KIT_TECHNIC_MAIN_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: TECHNIC_METAL_FACE,
};

/** Exposed axle / pin technic — light gray, slightly duller than gear faces. */
export const KIT_TECHNIC_MAIN_AXLE_GRAY: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: TECHNIC_AXLE_GRAY,
};
/** Legacy `Metal` / `Solid_Black` keys for dual-slot kit meshes. */
export const KIT_TECHNIC_LEGACY_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: TECHNIC_BLACK,
  Solid_Black: TECHNIC_BLACK,
};

export const KIT_TECHNIC_LEGACY_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: TECHNIC_METAL_FACE,
  Solid_Black: TECHNIC_AXLE_GRAY,
};
