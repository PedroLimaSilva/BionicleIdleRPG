import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../../game/mataKitPlayerPalette';

const ONUA_MATA_KIT_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

/**
 * Onua Mata (2001 kit): same `kitNodeName` / material layout as Kopaka; keys match `nodes` on onua.glb.
 * Claws use kit node `Claw` (see `kit_2001.glb`); sockets follow the paired-tool naming used by Gali/Pohatu.
 */
export const ONUA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L_Piston_Lower_L: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_R: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_L: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_L_Piston_Upper_R: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Lower_L_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_R_Piston_Lower_L: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_R: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleConPin1: {
    kitNodeName: 'AxleConPin1',
    materialColors: { Main: { kind: 'lego', value: LegoColor.LightGray } },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleModHips: { kitNodeName: 'AxleModHips' },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Body_1: { kitNodeName: 'MataHip', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  ClawL: { kitNodeName: 'Claw', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  ClawR: { kitNodeName: 'Claw', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Foot_L_1: { kitNodeName: 'MataFoot', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: 'MataFoot', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM' },
  GearML: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
  Hand_L_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Hand_R_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: ONUA_MATA_KIT_PALETTE_COLORS.Secondary },
  },
  Head_1: { kitNodeName: 'AxleSocket3L' },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Lower_L_1: { kitNodeName: 'MataLegModShin', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Lower_R_1: { kitNodeName: 'MataLegModShin', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: 'MataLegModThigh', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Leg_Upper_R_1: { kitNodeName: 'MataLegModThigh', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: ONUA_MATA_KIT_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace' },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_L_1: {
    kitNodeName: 'AxleMod3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_R_1: { kitNodeName: 'AxleMod3L' },
  Waist_Piston_Lower_L_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Lower_R_1: {
    kitNodeName: 'MataObliqueW',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_L_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
  Waist_Piston_Upper_R_1: {
    kitNodeName: 'MataObliqueN',
    materialColors: ONUA_MATA_KIT_PALETTE_COLORS,
  },
};
