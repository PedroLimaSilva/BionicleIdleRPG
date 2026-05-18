import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const GALI_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const GALI_HOOK_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...GALI_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Gali Mata (2001 kit): socket name on rig → kit node + per-material overrides.
 * Emissive / glow: set `emissive` + `emissiveIntensity` on a material slot (LegoColor or palette keys).
 */
export const GALI_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_L_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_R_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_Lower_L_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_R_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Axle2L: { kitNodeName: 'Axle2L', materialColors: GALI_PALETTE_COLORS },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: GALI_PALETTE_COLORS },
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: GALI_PALETTE_COLORS },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: GALI_PALETTE_COLORS },
  AxleShoulderL: { kitNodeName: 'AxleMod3L', materialColors: GALI_PALETTE_COLORS },
  AxleShoulderR: { kitNodeName: 'AxleMod3L', materialColors: GALI_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: GALI_PALETTE_COLORS },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L', materialColors: GALI_PALETTE_COLORS },
  AxleSpacer1L001: { kitNodeName: 'AxleSpacer1L', materialColors: GALI_PALETTE_COLORS },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: GALI_PALETTE_COLORS,
  },
  Face: { kitNodeName: 'MataFace', materialColors: GALI_PALETTE_COLORS },
  Gear_Big: { kitNodeName: 'GearB', materialColors: GALI_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: GALI_PALETTE_COLORS },
  GearMM: { kitNodeName: 'GearM', materialColors: GALI_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: GALI_PALETTE_COLORS },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: GALI_PALETTE_COLORS },
  Hand_L_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: GALI_PALETTE_COLORS.Secondary },
  },
  Hand_R_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: GALI_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinBackL: {
    kitNodeName: 'Pin2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinBackR: {
    kitNodeName: 'Pin2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinFrontL: {
    kitNodeName: 'Pin2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinFrontR: {
    kitNodeName: 'Pin2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HookL: { kitNodeName: 'Hook', materialColors: GALI_HOOK_PALETTE_COLORS },
  HookR: { kitNodeName: 'Hook', materialColors: GALI_HOOK_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: GALI_PALETTE_COLORS,
  },
  LegAnkleL: {
    kitNodeName: 'MataLegModShin',
    materialColors: GALI_PALETTE_COLORS,
  },
  LegAnkleR: {
    kitNodeName: 'MataLegModShin',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataAbdomen: {
    kitNodeName: 'MataAbdomen',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: 'MataChest',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataFootL: {
    kitNodeName: 'MataFoot',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataFootR: {
    kitNodeName: 'MataFoot',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: GALI_PALETTE_COLORS },
  ObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: GALI_PALETTE_COLORS },
  ObliqueTL: {
    kitNodeName: 'MataObliqueW',
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueTR: {
    kitNodeName: 'MataObliqueW',
    materialColors: GALI_PALETTE_COLORS,
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Socket: {
    kitNodeName: 'Socket',
    materialColors: GALI_PALETTE_COLORS,
  },
};
