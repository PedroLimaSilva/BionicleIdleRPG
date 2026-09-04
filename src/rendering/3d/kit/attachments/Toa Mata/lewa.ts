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

const LEWA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const LEWA_AXE_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LEWA_MATA_KIT_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Lewa Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on lewa.glb.
 */
export const LEWA_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_L001_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConnRidged: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleConnRidged001: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleConPin2: {
    kitNodeName: KIT_2001_NODES.AxleConPin2,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxlePin001: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
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
  Body_1: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  Hand_L: { kitNodeName: KIT_2001_NODES.MataHand, materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  Hand_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: LEWA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  LewaAxe: { kitNodeName: KIT_2001_NODES.LewaAxe, materialColors: LEWA_AXE_PALETTE_COLORS },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: KIT_2001_NODES.MataChest,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: LEWA_MATA_KIT_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL001: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL001: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: LEWA_MATA_KIT_PALETTE_COLORS,
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
};
