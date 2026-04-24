import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const LEWA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonGreen },
    weathered: false,
  },
  Glow: {
    emissive: { kind: 'lego', value: LegoColor.Lime },
    emissiveIntensity: 4,
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.TransNeonGreen },
    emissiveIntensity: 50,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.Green },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.Lime },
};

/**
 * Lewa Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on lewa.glb.
 */
export const LEWA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Leg_Lower_L001: {
    kitNodeName: 'MataLegModThigh',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R: {
    kitNodeName: 'MataLegModThigh',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Lower_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L: { kitNodeName: 'MataLegModPistonN' },
  Arm_Upper_L002: {
    kitNodeName: 'MataLegModThigh',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Lower_R: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_2: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_2: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L001: {
    kitNodeName: 'MataLegModShin',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Object213: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Object210: { kitNodeName: 'Axle6L' },
  Object166: { kitNodeName: 'AxleMod2L' },
  Object141: { kitNodeName: 'AxleModHips' },
  Object158: { kitNodeName: 'AxleSocket1L' },
  Object153: { kitNodeName: 'BallJoint' },
  Object203: {
    kitNodeName: 'MataBrain',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Object157: {
    kitNodeName: 'MataChest',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Object204: { kitNodeName: 'MataFace' },
  Object065: { kitNodeName: 'Axle3L' },
  Object066: { kitNodeName: 'Axle3L' },
  Foot_L: {
    kitNodeName: 'MataFoot',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Foot_R: {
    kitNodeName: 'MataFoot',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Object212: { kitNodeName: 'GearB' },
  Object159: { kitNodeName: 'GearM' },
  Object160: { kitNodeName: 'GearM' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Lewa_Hand_L: {
    kitNodeName: 'MataHand',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Hand_R: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
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
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R: {
    kitNodeName: 'MataLegModShin',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Body: {
    kitNodeName: 'MataHip',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
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
  Object088: { kitNodeName: 'AxleSpacer1L' },
  Object089: { kitNodeName: 'AxleSpacer1L' },
  Waist_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L: {
    kitNodeName: 'MataObliqueW',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R: {
    kitNodeName: 'MataObliqueW',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L: { kitNodeName: 'MataObliqueN' },
  Waist_Piston_Upper_R: { kitNodeName: 'MataObliqueN' },
};
