import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';

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
  Axle2L: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: POHATU_PALETTE_COLORS },
  Axle3L: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L001: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L004: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L005: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle6L001: {
    kitNodeName: KIT_2001_NODES.Axle6L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleConPin1001: {
    kitNodeName: KIT_2001_NODES.AxleConPin1,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod3L: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod3L001: {
    kitNodeName: KIT_2001_NODES.AxleMod3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: POHATU_PALETTE_COLORS },
  AxlePinPerp3L: {
    kitNodeName: KIT_2001_NODES.AxlePinPerp3L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleSpacer1L: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: POHATU_PALETTE_COLORS },
  AxleSpacer1L001: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: POHATU_PALETTE_COLORS,
  },
  BallJoint: {
    kitNodeName: KIT_2001_NODES.BallJoint,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  BallJoint001: {
    kitNodeName: KIT_2001_NODES.BallJoint,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
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
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: POHATU_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: POHATU_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: POHATU_PALETTE_COLORS },
  Glowing_Eyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: POHATU_PALETTE_COLORS,
  },
  Hand_L_1: {
    kitNodeName: KIT_2001_NODES.MataHand,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hand_R_1: {
    kitNodeName: KIT_2001_NODES.MataHand,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
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
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin001: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin002: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin003: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
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
