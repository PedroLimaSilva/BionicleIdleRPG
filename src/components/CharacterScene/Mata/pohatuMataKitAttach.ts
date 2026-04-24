import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';

const POHATU_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonOrange },
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.TransNeonOrange },
    emissiveIntensity: 50,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.Brown },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.DarkOrange },
};

/**
 * Pohatu Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on pohatu.glb.
 */
export const POHATU_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Lower_Leg_L: {
    kitNodeName: 'MataLegModThigh',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Lower_Leg_R: {
    kitNodeName: 'MataLegModThigh',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Lower_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L: { kitNodeName: 'MataLegModPistonN' },
  Arm_Lower_L: {
    kitNodeName: 'MataLegModThigh',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R002: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: POHATU_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Arm_Piston_Lower_R: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Object036: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_R: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Object037: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: POHATU_MATA_KIT_PALETTE_COLORS.Secondary,
    },
  },
  Chest: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Object046: { kitNodeName: 'Axle6L' },
  Head_1: { kitNodeName: 'AxleMod2L' },
  Body_1: { kitNodeName: 'AxleModHips' },
  Object007: { kitNodeName: 'AxleSocket1L' },
  Object001: { kitNodeName: 'BallJoint' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Chest_1: {
    kitNodeName: 'MataChest',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Object005: { kitNodeName: 'MataFace' },
  Object008: { kitNodeName: 'Axle3L' },
  Object009: { kitNodeName: 'Axle3L' },
  Foot_L: {
    kitNodeName: 'MataFoot',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Foot_R: {
    kitNodeName: 'MataFoot',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Object047: { kitNodeName: 'GearB' },
  Object048: { kitNodeName: 'GearM' },
  Object049: { kitNodeName: 'GearM' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: POHATU_MATA_KIT_PALETTE_COLORS },
  Hand_L: {
    kitNodeName: 'MataHand',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Hand_R: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: POHATU_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hip_L: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_R: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Piston_Lower_L: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Piston_Lower_R: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Upper_Leg_L: {
    kitNodeName: 'MataLegModShin',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Piston_Upper_L: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Piston_Upper_R: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Upper_Leg_R: {
    kitNodeName: 'MataLegModShin',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Body: {
    kitNodeName: 'MataHip',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Head: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Object038: { kitNodeName: 'AxleMod3L' },
  Object039: { kitNodeName: 'AxleMod3L' },
  Object050: { kitNodeName: 'AxleSpacer1L' },
  Object051: { kitNodeName: 'AxleSpacer1L' },
  Waist_1: {
    kitNodeName: 'MataAbdomen',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Body_Piston_Lower_L: {
    kitNodeName: 'MataObliqueW',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Body_Piston_Lower_R: {
    kitNodeName: 'MataObliqueW',
    materialColors: POHATU_MATA_KIT_PALETTE_COLORS,
  },
  Body_Piston_Upper_L: { kitNodeName: 'MataObliqueN' },
  Body_Piston_Upper_R: { kitNodeName: 'MataObliqueN' },
};
