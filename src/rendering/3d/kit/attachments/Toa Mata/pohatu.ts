import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from '../../palettes/technicKitPalette';

const POHATU_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

/**
 * Pohatu Mata (2001 kit): same `kitNodeName` / material layout as Tahu; keys match `nodes` on pohatu.glb.
 */
export const POHATU_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Axle2L: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  Axle3L: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Axle3L001: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Axle3L004: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Axle3L005: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Axle6L001: {
    kitNodeName: KIT_2001_NODES.Axle6L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleConPin1001: {
    kitNodeName: KIT_2001_NODES.AxleConPin1,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleMod3L: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleMod3L001: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxlePinPerp3L: {
    kitNodeName: KIT_2001_NODES.AxlePinPerp3L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleSpacer1L: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1L001: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  BallJoint: {
    kitNodeName: KIT_2001_NODES.BallJoint,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  BallJoint001: {
    kitNodeName: KIT_2001_NODES.BallJoint,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Body_1: { kitNodeName: KIT_2001_NODES.MataAbdomen, materialColors: POHATU_PALETTE_COLORS },
  Body_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Body_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Body_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Body_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Brain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Chest_1: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: POHATU_PALETTE_COLORS },
  Face: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: POHATU_PALETTE_COLORS },
  FootL: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: POHATU_PALETTE_COLORS,
  },
  FootR: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: POHATU_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  Glowing_Eyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Hand_L_1: {
    kitNodeName: KIT_2001_NODES.MataHand,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Hand_R_1: {
    kitNodeName: KIT_2001_NODES.MataHand,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Hip_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Hip_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  KickL: { kitNodeName: KIT_2001_NODES.FootKick, materialColors: POHATU_PALETTE_COLORS },
  KickR: { kitNodeName: KIT_2001_NODES.FootKick, materialColors: POHATU_PALETTE_COLORS },
  Leg_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Leg_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Leg_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Leg_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Lower_Leg_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Lower_Leg_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: POHATU_PALETTE_COLORS,
  },
  PerpendicularAxleJoint001: {
    kitNodeName: KIT_2001_NODES.PerpendicularAxleJoint,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Pin: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Pin001: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Pin002: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Pin003: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Shoulder_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Shoulder_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  Upper_Leg_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Upper_Leg_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Waist_1: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: POHATU_PALETTE_COLORS },
};
