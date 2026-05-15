import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlowFromSecondaryArms,
} from '../../../game/mataKitPlayerPalette';

const LEWA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const LEWA_AXE_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LEWA_MATA_KIT_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlowFromSecondaryArms(50),
};

/**
 * Lewa Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on lewa.glb.
 */
export const LEWA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Piston_Lower_L_1: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: 'TechnicArmPistonT',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_L_1: { kitNodeName: 'TechnicArmMain', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Arm_Upper_L001_1: {
    kitNodeName: 'TechnicArmJoint',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxleConnRidged: { kitNodeName: 'AxleConnRidged', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxleConnRidged001: {
    kitNodeName: 'AxleConnRidged',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxlePin: { kitNodeName: 'AxlePin', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxlePin001: { kitNodeName: 'AxlePin', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L' },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  BallJoint: { kitNodeName: 'BallJoint', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Body_1: { kitNodeName: 'MataHip', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: { kitNodeName: 'MataFoot', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: 'MataFoot', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB' },
  GearMB: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
  Hand_L: { kitNodeName: 'MataHand', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Hand_R_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_L_1: { kitNodeName: 'MataLegModThigh', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: { kitNodeName: 'MataLegModThigh', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: 'MataLegModShin', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: { kitNodeName: 'MataLegModShin', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  LewaAxe: { kitNodeName: 'LewaAxe', materialColors: LEWA_AXE_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace' },
  MataGlowingEyes: { kitNodeName: 'MataGlowingEyes', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataSingleArmPistonLowerL: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL001: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL001: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: { kitNodeName: 'AxleMod2L' },
  Shoulder_R_1: { kitNodeName: 'AxleMod3L' },
};
