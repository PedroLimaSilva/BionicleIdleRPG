import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';

const ONUA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

/**
 * Onua Mata (2001 kit): same `kitNodeName` / material layout as Kopaka; keys match `nodes` on onua.glb.
 * Claws use kit node `Claw` (see `kit_2001.glb`); sockets follow the paired-tool naming used by Gali/Pohatu.
 */
export const ONUA_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_L_Piston_Lower_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_R_Piston_Lower_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleConPin1: {
    kitNodeName: KIT_2001_NODES.AxleConPin1,
    materialColors: { Main: { kind: 'lego', value: LegoColor.LightGray } },
  },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Body_1: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  ClawL: { kitNodeName: KIT_2001_NODES.Claw, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  ClawR: { kitNodeName: KIT_2001_NODES.Claw, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Hand_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hand_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Head_1: { kitNodeName: KIT_2001_NODES.AxleSocket3L, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Hip_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_L_1: { kitNodeName: KIT_2001_NODES.MataLegModShin, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: { kitNodeName: KIT_2001_NODES.MataLegModShin, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: KIT_2001_NODES.MataLegModThigh, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: { kitNodeName: KIT_2001_NODES.MataLegModThigh, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: KIT_2001_NODES.MataAbdomen, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Shoulder_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Waist_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
};
