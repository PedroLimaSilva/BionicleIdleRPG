import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const TAHU_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonPink },
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.TransNeonPink },
    emissiveIntensity: 50,
    weathered: false,
  },
  Glow: {
    emissive: { kind: 'lego', value: LegoColor.DarkOrange },
    emissiveIntensity: 4,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.Red },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.Orange },
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
  BallJoint: { kitNodeName: 'BallJoint' },
  Arm_L_Piston_Lower_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_1: { kitNodeName: 'MataLegModPistonN' },
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
  Arm_R_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
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
  Axle6L: { kitNodeName: 'Axle6L' },
  Neck_1: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleModHips: { kitNodeName: 'AxleModHips' },
  Shoulder_L_1: { kitNodeName: 'AxleMod3L' },
  Shoulder_R_1: { kitNodeName: 'AxleMod3L' },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L' },
  Spacer1LB: { kitNodeName: 'AxleSpacer1L' },
  Spacer1LF: { kitNodeName: 'AxleSpacer1L' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Face: { kitNodeName: 'MataFace' },
  Foot_L_1: {
    kitNodeName: 'MataFoot',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Foot_R_1: {
    kitNodeName: 'MataFoot',
    materialColors: TAHU_PALETTE_COLORS,
  },
  GearB: { kitNodeName: 'GearB' },
  GearMM: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
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
  Waist_1_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Chest: {
    kitNodeName: 'MataChest',
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: TAHU_PALETTE_COLORS,
  },
  TahuSword: {
    kitNodeName: 'TahuSword',
    materialColors: TAHU_PALETTE_COLORS,
  },
  TahuSwordFlame: { kitNodeName: 'TahuSwordFlame', materialColors: TAHU_PALETTE_COLORS },
  Waist_Piston_Lower_L_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: TAHU_PALETTE_COLORS,
  },
  FingerB: { kitNodeName: 'Axle3L' },
  FingerF: { kitNodeName: 'Axle3L' },
  Waist_Piston_Upper_L_1: { kitNodeName: 'MataObliqueN' },
  Waist_Piston_Upper_R_1: { kitNodeName: 'MataObliqueN' },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
};
