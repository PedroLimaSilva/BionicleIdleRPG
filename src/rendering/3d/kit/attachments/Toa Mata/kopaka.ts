import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from '../../palettes/technicKitPalette';

const KOPAKA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const KOPAKA_SWORD_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KOPAKA_MATA_KIT_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Kopaka Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on kopaka.glb.
 */
export const KOPAKA_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConPin2: {
    kitNodeName: KIT_2001_NODES.AxleConPin2,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L001: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxlePin: {
    kitNodeName: KIT_2001_NODES.AxlePin,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleSocket1L: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  BallJoint: {
    kitNodeName: KIT_2001_NODES.BallJoint,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Body_1: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Foot_R_1: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  Hand_L_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS },
  Hip_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  KopakaShield: {
    kitNodeName: KIT_2001_NODES.KopakaShield,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  KopakaSword: {
    kitNodeName: KIT_2001_NODES.KopakaSword,
    materialColors: KOPAKA_SWORD_PALETTE_COLORS,
  },
  Leg_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: KIT_2001_NODES.MataChest,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataFace: {
    kitNodeName: KIT_2001_NODES.MataFace,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmHand: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  MataSingleArmLower: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  MataSingleArmPistonLowerL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL001: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL001: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmUpper: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: { Main: KOPAKA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  TechnicArmJoint001: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  TechnicArmMain001: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: KOPAKA_MATA_KIT_PALETTE_COLORS,
  },
};
