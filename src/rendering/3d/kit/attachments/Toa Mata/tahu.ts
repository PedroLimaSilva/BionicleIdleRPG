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

const TAHU_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const TAHU_WEAPON_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAHU_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

const TAHU_SECONDARY_MAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: TAHU_PALETTE_COLORS.Secondary,
};

const TAHU_BLACK_MAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Tahu Mata kit sockets — **not used at runtime**. The character sheet and
 * combat both draw the packed skinned `Battle_*` body. This map stays so
 * `collectKitNodeUsage` still counts the shared 2001 pieces other Mata clone.
 *
 * Sockets on `Toa_Mata/tahu.glb` are named after the kit node they would
 * receive (same pattern as Gali / Onua). Right-arm single-arm pieces tint
 * Main as Secondary.
 */
export const TAHU_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle3L_Hand1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: TAHU_BLACK_MAIN },
  Axle3L_Hand2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: TAHU_BLACK_MAIN },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConPin2: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: TAHU_BLACK_MAIN },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleMod3L_L: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: TAHU_BLACK_MAIN },
  AxleMod3L_R: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: TAHU_BLACK_MAIN },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleSocket1L: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleSpacer1L_B: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1L_F: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  BallJoint: { kitNodeName: KIT_2001_NODES.BallJoint, materialColors: KIT_TECHNIC_MAIN_BLACK },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearM_B: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearM_R: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: KIT_2001_NODES.MataChest,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: TAHU_PALETTE_COLORS },
  MataFootHeel_L: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAHU_PALETTE_COLORS },
  MataFootHeel_R: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAHU_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataHand: { kitNodeName: KIT_2001_NODES.MataHand, materialColors: TAHU_PALETTE_COLORS },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: TAHU_PALETTE_COLORS },
  MataLegModPistonN_Arm: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModPistonN_L: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModPistonN_R: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModPistonT_Arm: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModPistonT_L: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModPistonT_R: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModShin_ArmL: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModShin_L: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModShin_R: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModThigh_ArmL: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModThigh_L: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataLegModThigh_R: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataObliqueN_L: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataObliqueN_R: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataObliqueW_L: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataObliqueW_R: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataSingleArmHand: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: TAHU_SECONDARY_MAIN,
  },
  MataSingleArmLower: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: TAHU_SECONDARY_MAIN,
  },
  MataSingleArmPistonLowerL_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerL_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: TAHU_PALETTE_COLORS,
  },
  MataSingleArmUpper: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: TAHU_SECONDARY_MAIN,
  },
  PerpendicularAxleJoint: {
    kitNodeName: KIT_2001_NODES.PerpendicularAxleJoint,
    materialColors: TAHU_BLACK_MAIN,
  },
  SocketModSide_L: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: TAHU_BLACK_MAIN,
  },
  SocketModSide_R: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: TAHU_BLACK_MAIN,
  },
  SocketModTop_L: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: TAHU_BLACK_MAIN,
  },
  SocketModTop_R: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: TAHU_BLACK_MAIN,
  },
  TahuSword: {
    kitNodeName: KIT_2001_NODES.TahuSword,
    materialColors: TAHU_WEAPON_PALETTE_COLORS,
  },
};
