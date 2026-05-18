import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
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
export const POHATU_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_Lower_L_1: { kitNodeName: 'TechnicArmMain', materialColors: POHATU_PALETTE_COLORS },
  Arm_Lower_R_1: { kitNodeName: 'TechnicArmMain', materialColors: POHATU_PALETTE_COLORS },
  Arm_Piston_Lower_L_1: { kitNodeName: 'TechnicArmPistonT', materialColors: POHATU_PALETTE_COLORS },
  Arm_Piston_Lower_R_1: {
    kitNodeName: 'TechnicArmPistonT',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Upper_L_1: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Piston_Upper_R_1: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Arm_Upper_L_1: { kitNodeName: 'TechnicArmJoint', materialColors: POHATU_PALETTE_COLORS },
  Arm_Upper_R_1: { kitNodeName: 'TechnicArmJoint', materialColors: POHATU_PALETTE_COLORS },
  Axle2L: { kitNodeName: 'Axle2L', materialColors: POHATU_PALETTE_COLORS },
  Axle3L: {
    kitNodeName: 'Axle3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L001: {
    kitNodeName: 'Axle3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L004: {
    kitNodeName: 'Axle3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3L005: {
    kitNodeName: 'Axle3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle6L001: {
    kitNodeName: 'Axle6L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleConPin1001: {
    kitNodeName: 'AxleConPin1',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod3L: {
    kitNodeName: 'AxleMod3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod3L001: {
    kitNodeName: 'AxleMod3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: POHATU_PALETTE_COLORS },
  AxlePinPerp3L: {
    kitNodeName: 'AxlePinPerp3L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L', materialColors: POHATU_PALETTE_COLORS },
  AxleSpacer1L001: {
    kitNodeName: 'AxleSpacer1L',
    materialColors: POHATU_PALETTE_COLORS,
  },
  BallJoint: {
    kitNodeName: 'BallJoint',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  BallJoint001: {
    kitNodeName: 'BallJoint',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Body_1: { kitNodeName: 'MataAbdomen', materialColors: POHATU_PALETTE_COLORS },
  Body_Piston_Lower_L_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Body_Piston_Lower_R_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Body_Piston_Upper_L_1: { kitNodeName: 'MataObliqueW', materialColors: POHATU_PALETTE_COLORS },
  Body_Piston_Upper_R_1: { kitNodeName: 'MataObliqueW', materialColors: POHATU_PALETTE_COLORS },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Chest_1: { kitNodeName: 'MataHip', materialColors: POHATU_PALETTE_COLORS },
  Face: { kitNodeName: 'MataFace' },
  FootL: {
    kitNodeName: 'MataFoot',
    materialColors: POHATU_PALETTE_COLORS,
  },
  FootR: {
    kitNodeName: 'MataFoot',
    materialColors: POHATU_PALETTE_COLORS,
  },
  GearB: { kitNodeName: 'GearB', materialColors: POHATU_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: POHATU_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: POHATU_PALETTE_COLORS },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes', materialColors: POHATU_PALETTE_COLORS },
  Hand_L_1: {
    kitNodeName: 'MataHand',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hand_R_1: {
    kitNodeName: 'MataHand',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  KickL: { kitNodeName: 'FootKick', materialColors: POHATU_PALETTE_COLORS },
  KickR: { kitNodeName: 'FootKick', materialColors: POHATU_PALETTE_COLORS },
  Leg_Piston_Lower_L_1: { kitNodeName: 'MataLegModPistonT', materialColors: POHATU_PALETTE_COLORS },
  Leg_Piston_Lower_R_1: { kitNodeName: 'MataLegModPistonT', materialColors: POHATU_PALETTE_COLORS },
  Leg_Piston_Upper_L_1: { kitNodeName: 'MataLegModPistonN', materialColors: POHATU_PALETTE_COLORS },
  Leg_Piston_Upper_R_1: { kitNodeName: 'MataLegModPistonN', materialColors: POHATU_PALETTE_COLORS },
  Lower_Leg_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Lower_Leg_R_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: POHATU_PALETTE_COLORS,
  },
  PerpendicularAxleJoint001: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin: {
    kitNodeName: 'Pin2L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin001: {
    kitNodeName: 'Pin2L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin002: {
    kitNodeName: 'Pin2L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Pin003: {
    kitNodeName: 'Pin2L',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { main: { kind: 'lego', value: LegoColor.Black } },
  },
  Upper_Leg_L_1: {
    kitNodeName: 'MataLegModShin',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Upper_Leg_R_1: {
    kitNodeName: 'MataLegModShin',
    materialColors: POHATU_PALETTE_COLORS,
  },
  Waist_1: { kitNodeName: 'MataChest', materialColors: POHATU_PALETTE_COLORS },
};
