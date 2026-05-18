import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const TAHU_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const TAHU_WEAPON_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAHU_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Tahu Mata (2001 kit): same socket / kit node names as Gali; fire palette on plastics.
 */
export const TAHU_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Ankle_L: {
    kitNodeName: 'MataLegModThigh',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Ankle_R: {
    kitNodeName: 'MataLegModThigh',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Lower_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: TAHU_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_R_1: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: 'MataLegModShin',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: TAHU_PALETTE_COLORS.Secondary,
    },
  },
  ArmJointStopper: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: TAHU_PALETTE_COLORS },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: TAHU_PALETTE_COLORS },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: TAHU_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: TAHU_PALETTE_COLORS },
  BallJoint: { kitNodeName: 'BallJoint', materialColors: TAHU_PALETTE_COLORS },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Chest: {
    kitNodeName: 'MataChest',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Face: { kitNodeName: 'MataFace' },
  FingerB: {
    kitNodeName: 'Axle3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  FingerF: {
    kitNodeName: 'Axle3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Foot_L_1: {
    kitNodeName: 'MataFoot',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Foot_R_1: {
    kitNodeName: 'MataFoot',
    materialColors: TAHU_PALETTE_COLORS,
  },
  GearB: { kitNodeName: 'GearB', materialColors: TAHU_PALETTE_COLORS },
  GearMM: { kitNodeName: 'GearM', materialColors: TAHU_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: TAHU_PALETTE_COLORS },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: TAHU_PALETTE_COLORS },
  HandL: {
    kitNodeName: 'MataHand',
    materialColors: TAHU_PALETTE_COLORS,
  },
  HandR: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: TAHU_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: 'MataLegModShin',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: 'MataLegModShin',
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Neck_1: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: 'AxleMod3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: 'AxleMod3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Spacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: TAHU_PALETTE_COLORS },
  Spacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: TAHU_PALETTE_COLORS },
  TahuSword: {
    kitNodeName: 'TahuSword',
    materialColors: TAHU_WEAPON_PALETTE_COLORS,
  },
  TahuSwordFlame: {
    kitNodeName: 'TahuSwordFlame',
    materialColors: TAHU_WEAPON_PALETTE_COLORS,
  },
  Waist_1_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: TAHU_PALETTE_COLORS,
  },
};
