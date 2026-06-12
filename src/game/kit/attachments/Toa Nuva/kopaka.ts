import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

const KOPAKA_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const KOPAKA_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const KOPAKA_NUVA_ICE_BLADE_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KOPAKA_NUVA_PALETTE_COLORS,
  Glow: {
    emissive: { key: 'weaponGlow', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const KOPAKA_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Kopaka Nuva — sockets on `Toa_Nuva/kopaka.glb` filled from `kit_2001.glb`.
 * Shield remains a unique mesh on the character GLB (not a kit part).
 */
export const KOPAKA_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  Arm_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  ArmLowerR: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  ArmUpperR: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleConPin2001: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: KOPAKA_NUVA_BLACK },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: KOPAKA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: KOPAKA_NUVA_BLACK },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: KIT_2001_NODES.AxleSocket1L, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  FootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: KIT_2001_NODES.MataAbdomen, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: KOPAKA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: KIT_2001_NODES.MataObliqueW, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: KIT_2001_NODES.MataObliqueW, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataSingleArmHand: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  MataSingleArmLower: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  MataSingleArmPistonLowerL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerR: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerR,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperR: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperR,
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmUpper: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  SocketModSideL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: KOPAKA_NUVA_BLACK },
  SocketModSideR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: KOPAKA_NUVA_BLACK },
  SocketModTopL: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: KOPAKA_NUVA_BLACK },
  SocketModTopR: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: KOPAKA_NUVA_BLACK },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: KOPAKA_NUVA_BLACK },
};

/**
 * Kopaka Nuva — Nuva limbs, ice blades, and 2003 axles from `kit_2003.glb`.
 */
export const KOPAKA_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Axle3LStudL: {
    kitNodeName: KIT_2003_NODES.Axle3LStud,
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  Axle3LStudR: {
    kitNodeName: KIT_2003_NODES.Axle3LStud,
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  AxleSpacer12L: { kitNodeName: KIT_2003_NODES.AxleSpacerHalf, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer12R: { kitNodeName: KIT_2003_NODES.AxleSpacerHalf, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  BladeL: { kitNodeName: KIT_2003_NODES.IceNuvaBlade, materialColors: KOPAKA_NUVA_ICE_BLADE_PALETTE_COLORS },
  BladeR: { kitNodeName: KIT_2003_NODES.IceNuvaBlade, materialColors: KOPAKA_NUVA_ICE_BLADE_PALETTE_COLORS },
  Leg_Lower_L_1: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Lower_R_1: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Upper_R_1: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: KIT_2003_NODES.NuvaPistonN, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: KIT_2003_NODES.NuvaPistonN, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: KIT_2003_NODES.NuvaPistonT, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: KIT_2003_NODES.NuvaPistonT, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: KOPAKA_NUVA_PALETTE_COLORS },
};
