import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const TAHU_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const TAHU_WEAPON_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAHU_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Tahu Mata (2001 kit): same socket / kit node names as Gali; fire palette on plastics.
 */
export const TAHU_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Ankle_L: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Ankle_R: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: {
      Main: TAHU_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Arm_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: {
      Main: TAHU_PALETTE_COLORS.Secondary,
    },
  },
  ArmJointStopper: {
    kitNodeName: KIT_2001_NODES.PerpendicularAxleJoint,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: TAHU_PALETTE_COLORS },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: TAHU_PALETTE_COLORS },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: TAHU_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: KIT_2001_NODES.AxleSocket1L, materialColors: TAHU_PALETTE_COLORS },
  BallJoint: { kitNodeName: KIT_2001_NODES.BallJoint, materialColors: TAHU_PALETTE_COLORS },
  Brain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Chest: {
    kitNodeName: KIT_2001_NODES.MataChest,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Face: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: TAHU_PALETTE_COLORS },
  FingerB: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  FingerF: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Foot_L_1: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Foot_R_1: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: TAHU_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: TAHU_PALETTE_COLORS },
  GearMM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAHU_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAHU_PALETTE_COLORS },
  Glowing_Eyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: TAHU_PALETTE_COLORS,
  },
  HandL: {
    kitNodeName: KIT_2001_NODES.MataHand,
    materialColors: TAHU_PALETTE_COLORS,
  },
  HandR: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: TAHU_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: KIT_2001_NODES.MataHip,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Neck_1: {
    kitNodeName: KIT_2001_NODES.AxleConPin2,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
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
  Spacer1LB: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: TAHU_PALETTE_COLORS },
  Spacer1LF: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: TAHU_PALETTE_COLORS },
  TahuSword: {
    kitNodeName: KIT_2001_NODES.TahuSword,
    materialColors: TAHU_WEAPON_PALETTE_COLORS,
  },
  TahuSwordFlame: {
    kitNodeName: KIT_2001_NODES.TahuSwordFlame,
    materialColors: TAHU_WEAPON_PALETTE_COLORS,
  },
  Waist_1_1: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_PALETTE_COLORS,
  },
};
