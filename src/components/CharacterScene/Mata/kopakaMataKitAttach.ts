import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const KOPAKA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonYellow },
    weathered: false,
  },
  Glow: {
    emissive: { kind: 'lego', value: LegoColor.MediumBlue },
    emissiveIntensity: 4,
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.MediumBlue },
    emissiveIntensity: 50,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.White },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.LightGray },
};

/**
 * Kopaka Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on kopaka.glb.
 */
export const KOPAKA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Leg_Lower_L: {
    kitNodeName: 'MataLegModThigh',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R: {
    kitNodeName: 'MataLegModThigh',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Lower_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L: { kitNodeName: 'MataLegModPistonN' },
  Arm_Upper_L002: {
    kitNodeName: 'MataLegModThigh',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Lower_R: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_2: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_2: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L001: {
    kitNodeName: 'MataLegModShin',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Object060: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Object240: { kitNodeName: 'Axle6L' },
  Object100: { kitNodeName: 'AxleMod2L' },
  Root: { kitNodeName: 'AxleModHips' },
  Head_1: { kitNodeName: 'AxleSocket1L' },
  Object216: { kitNodeName: 'BallJoint' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Object238: {
    kitNodeName: 'MataChest',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Object217: { kitNodeName: 'MataFace' },
  Object022: { kitNodeName: 'Axle3L' },
  Object023: { kitNodeName: 'Axle3L' },
  Foot_L: {
    kitNodeName: 'MataFoot',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Foot_R: {
    kitNodeName: 'MataFoot',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Object241: { kitNodeName: 'GearB' },
  Object244: { kitNodeName: 'GearM' },
  Object245: { kitNodeName: 'GearM' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Object052: {
    kitNodeName: 'MataHand',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Hand_R: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_Piston_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R: {
    kitNodeName: 'MataLegModShin',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Body: {
    kitNodeName: 'MataHip',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Neck: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_L: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L: { kitNodeName: 'AxleMod3L' },
  Shoulder_R: { kitNodeName: 'AxleMod3L' },
  Object042: { kitNodeName: 'AxleSpacer1L' },
  Object043: { kitNodeName: 'AxleSpacer1L' },
  Waist_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L: {
    kitNodeName: 'MataObliqueW',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R: {
    kitNodeName: 'MataObliqueW',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L: { kitNodeName: 'MataObliqueN' },
  Waist_Piston_Upper_R: { kitNodeName: 'MataObliqueN' },
};
