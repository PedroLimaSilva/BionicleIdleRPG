import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const KOPAKA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const KOPAKA_SWORD_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KOPAKA_MATA_KIT_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5, 'eyes'),
};

/**
 * Kopaka Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on kopaka.glb.
 */
export const KOPAKA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_Piston_Lower_L_1: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: 'TechnicArmPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L001: {
    kitNodeName: 'AxleMod2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  AxlePin: {
    kitNodeName: 'AxlePin',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleSocket1L: {
    kitNodeName: 'AxleSocket1L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  BallJoint: { kitNodeName: 'BallJoint', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Body_1: { kitNodeName: 'MataHip', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: { kitNodeName: 'MataFoot', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: 'MataFoot', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  GearMM: { kitNodeName: 'GearM', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Hand_L_1: { kitNodeName: 'Socket', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  KopakaShield: { kitNodeName: 'KopakaShield', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  KopakaSword: { kitNodeName: 'KopakaSword', materialColors: KOPAKA_SWORD_PALETTE_COLORS },
  Leg_Lower_L_1: { kitNodeName: 'MataLegModThigh', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: { kitNodeName: 'MataLegModThigh', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: 'MataLegModShin', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: { kitNodeName: 'MataLegModShin', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace' },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmHand: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  MataSingleArmLower: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  MataSingleArmPistonLowerL: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL001: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL001: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmUpper: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: 'AxleMod2L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: 'AxleMod3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  TechnicArmJoint001: {
    kitNodeName: 'TechnicArmJoint',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  TechnicArmMain001: {
    kitNodeName: 'TechnicArmMain',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
};
