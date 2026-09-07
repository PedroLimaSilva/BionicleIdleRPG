import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { MatoranColors } from '../../../../types/Matoran';
import type { RahkshiArmorColors } from '../../../../data/rahkshiArmorColors';
import type { WeatheredMetalOptions } from '../../CharacterScene/WeatheredMetalMaterial';
import { kitPartSlots } from './partSlots';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from './technicKitPalette';

/** Same weathering as the baked Rahkshi meshes in `Rahkshi.tsx`. */
export const RAHKSHI_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 1,
  debugGrimeAsColor: false,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18.0,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  largeScale: 3.5,
  metalness: 0.05,
  roughness: 0.55,
};

const DARK_BLUISH_GRAY: KitMaterialSlotEntry = {
  kind: 'lego',
  value: LegoColor.DarkBluishGray,
};

/** Shoulders, torso shell, legs, limbs, and technic arm main/joint. */
export const RAHKSHI_KIT_PALETTE_CHASSIS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: DARK_BLUISH_GRAY,
  Metal: DARK_BLUISH_GRAY,
  Secondary: DARK_BLUISH_GRAY,
  Solid_Black: DARK_BLUISH_GRAY,
};

/** Limb ball sockets — same color as the feet (joint / gold-yellow on Chameleon). */
export const RAHKSHI_KIT_PALETTE_LIMB_SOCKET = kitPartSlots('feet', 'mata');

/** Shoulder sockets `Socket_SL` / `Socket_SR` — same color as the spine armor. */
export const RAHKSHI_KIT_PALETTE_SPINE_SOCKET = kitPartSlots('body', 'mata');

/**
 * Head socket `Socket_Head` — emissive like baked `Eyes`, no bloom halo.
 * `Rahkshi.tsx` syncs emissive on/off with the kraata glow, without copying bloom.
 */
export const RAHKSHI_KIT_PALETTE_HEAD_SOCKET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: {
    color: { kind: 'lego', value: LegoColor.Black },
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 1,
    weathered: false,
  },
};

export const RAHKSHI_KIT_PALETTE_FEET = kitPartSlots('feet', 'mata');

/** `TechnicArmPistonN` only has a Metal slot — tint it with the feet main color. */
export const RAHKSHI_KIT_PALETTE_PISTON_N: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'feet', slot: 'main' },
  Metal: { kind: 'part', part: 'feet', slot: 'main' },
};

export const RAHKSHI_KIT_PALETTE_TAN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Tan },
};

export const RAHKSHI_KIT_PALETTE_BLACK = KIT_TECHNIC_MAIN_BLACK;
export const RAHKSHI_KIT_PALETTE_METAL = KIT_TECHNIC_MAIN_METAL;

/** Map lore armor/joint hex onto kit part slots (`useKitAttachments` colors). */
export function rahkshiKitColors(dex: RahkshiArmorColors): MatoranColors {
  const armor = dex.armor as LegoColor;
  const joint = dex.joint as LegoColor;
  const metal = LegoColor.LightGray;
  const feet: MatoranColors['body'] = {
    glow: joint,
    main: joint,
    metal,
    secondary: armor,
  };
  return {
    arms: feet,
    body: { glow: armor, main: armor, metal, secondary: armor },
    eyes: LegoColor.Orange,
    face: armor,
    feet,
    legs: feet,
    mask: armor,
  };
}
