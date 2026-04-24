import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const GALI_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Blue },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.MediumBlue },
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonYellow },
    weathered: false,
  },
};

/**
 * Gali Mata (2001 kit): socket name on rig → kit node + per-material overrides.
 * Emissive / glow: set `emissive` + `emissiveIntensity` on a material slot (LegoColor or palette keys).
 */
export const GALI_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  MataFootL: {
    kitNodeName: 'MataFoot',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataFootR: {
    kitNodeName: 'MataFoot',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: 'MataChest',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_L_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  HipPinBackL: { kitNodeName: 'Pin2L' },
  HipPinBackR: { kitNodeName: 'Pin2L' },
  HipPinFrontL: { kitNodeName: 'Pin2L' },
  HipPinFrontR: { kitNodeName: 'Pin2L' },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L' },
  Face: { kitNodeName: 'MataFace' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataAbdomen: {
    kitNodeName: 'MataAbdomen',
    materialColors: GALI_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: 'MataHip',
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
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleSpacer1L001: { kitNodeName: 'AxleSpacer1L' },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L' },
  AxleModHips: { kitNodeName: 'AxleModHips' },
  AxleShoulderL: { kitNodeName: 'AxleMod3L' },
  AxleShoulderR: { kitNodeName: 'AxleMod3L' },
  Gear_Big: { kitNodeName: 'GearB' },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Lower_Piston_L_1: { kitNodeName: 'MataLegModPistonN' },
  Leg_Lower_Piston_R_1: { kitNodeName: 'MataLegModPistonN' },
  Axle2L: { kitNodeName: 'Axle2L' },
  Axle6L: { kitNodeName: 'Axle6L' },
  GearML: { kitNodeName: 'GearM' },
  GearMM: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
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
  HookL: { kitNodeName: 'Hook', materialColors: GALI_PALETTE_COLORS },
  HookR: { kitNodeName: 'Hook', materialColors: GALI_PALETTE_COLORS },
  LegAnkleL: {
    kitNodeName: 'MataLegModShin',
    materialColors: GALI_PALETTE_COLORS,
  },
  LegAnkleR: {
    kitNodeName: 'MataLegModShin',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueNL: { kitNodeName: 'MataObliqueN' },
  ObliqueNR: { kitNodeName: 'MataObliqueN' },
  ObliqueTL: {
    kitNodeName: 'MataObliqueW',
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueTR: {
    kitNodeName: 'MataObliqueW',
    materialColors: GALI_PALETTE_COLORS,
  },
  Socket: {
    kitNodeName: 'Socket',
    materialColors: GALI_PALETTE_COLORS,
  },
};
