import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const ONUA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonGreen },
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.TransNeonGreen },
    emissiveIntensity: 50,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.DarkGray },
};

/**
 * Onua Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on onua.glb.
 */
export const ONUA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Leg_Lower_L004: {
    kitNodeName: 'MataLegModThigh',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R: {
    kitNodeName: 'MataLegModThigh',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_1_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_1_L: { kitNodeName: 'MataLegModPistonN' },
  Arm_Lower_L: {
    kitNodeName: 'MataLegModThigh',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Lower_R: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_1_R: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_2_R: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_1_R: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_2_R: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Waist_2: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Object369: { kitNodeName: 'Axle6L' },
  Object104: { kitNodeName: 'AxleMod2L' },
  Body: { kitNodeName: 'AxleModHips' },
  Head_1: { kitNodeName: 'AxleSocket1L' },
  Object324: { kitNodeName: 'BallJoint' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Object370: {
    kitNodeName: 'MataChest',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Face: { kitNodeName: 'MataFace' },
  Object371: { kitNodeName: 'Axle3L' },
  Object372: { kitNodeName: 'Axle3L' },
  Foot_L002: {
    kitNodeName: 'MataFoot',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Foot_R: {
    kitNodeName: 'MataFoot',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Object373: { kitNodeName: 'GearB' },
  Object374: { kitNodeName: 'GearM' },
  Object376: { kitNodeName: 'GearM' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Hand_L: {
    kitNodeName: 'MataHand',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Hand_R: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
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
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R: {
    kitNodeName: 'MataLegModShin',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Object083: {
    kitNodeName: 'MataHip',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Head: {
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
  Object377: { kitNodeName: 'AxleSpacer1L' },
  Object379: { kitNodeName: 'AxleSpacer1L' },
  Waist_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L: {
    kitNodeName: 'MataObliqueW',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R: {
    kitNodeName: 'MataObliqueW',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L: { kitNodeName: 'MataObliqueN' },
  Waist_Piston_Upper_R: { kitNodeName: 'MataObliqueN' },
};
