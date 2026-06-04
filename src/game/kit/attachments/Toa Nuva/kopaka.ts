import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
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
export const KOPAKA_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_Piston_Lower_R_1: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  Arm_Piston_Upper_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  ArmLowerR: {
    kitNodeName: 'MataLegModShin',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  ArmUpperR: {
    kitNodeName: 'MataLegModThigh',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleConPin2001: { kitNodeName: 'AxleConPin2', materialColors: KOPAKA_NUVA_BLACK },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: 'AxleMod3L', materialColors: KOPAKA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: 'AxleMod3L', materialColors: KOPAKA_NUVA_BLACK },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxlePin: { kitNodeName: 'AxlePin', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Foot_R_1: { kitNodeName: 'MataFoot', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  FootL: { kitNodeName: 'MataFoot', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: KOPAKA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  MataSingleArmHand: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  MataSingleArmLower: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  MataSingleArmPistonLowerL: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonLowerR: {
    kitNodeName: 'MataSingleArmPistonLowerR',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperL: {
    kitNodeName: 'MataSingleArmPistonUpperL',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmPistonUpperR: {
    kitNodeName: 'MataSingleArmPistonUpperR',
    materialColors: KOPAKA_NUVA_PALETTE_COLORS,
  },
  MataSingleArmUpper: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: { Main: KOPAKA_NUVA_PALETTE_COLORS.Secondary },
  },
  SocketModSideL: { kitNodeName: 'SocketModSide', materialColors: KOPAKA_NUVA_BLACK },
  SocketModSideR: { kitNodeName: 'SocketModSide', materialColors: KOPAKA_NUVA_BLACK },
  SocketModTopL: { kitNodeName: 'SocketModTop', materialColors: KOPAKA_NUVA_BLACK },
  SocketModTopR: { kitNodeName: 'SocketModTop', materialColors: KOPAKA_NUVA_BLACK },
  SocketR: { kitNodeName: 'Socket', materialColors: KOPAKA_NUVA_BLACK },
};

/**
 * Kopaka Nuva — Nuva limbs, ice blades, and 2003 axles from `kit_2003.glb`.
 */
export const KOPAKA_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle3LStudL: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  Axle3LStudR: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  AxleSpacer12L: { kitNodeName: 'AxleSpacer12', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  AxleSpacer12R: { kitNodeName: 'AxleSpacer12', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  BladeL: { kitNodeName: 'IceNuvaBlade', materialColors: KOPAKA_NUVA_ICE_BLADE_PALETTE_COLORS },
  BladeR: { kitNodeName: 'IceNuvaBlade', materialColors: KOPAKA_NUVA_ICE_BLADE_PALETTE_COLORS },
  Leg_Lower_L_1: { kitNodeName: 'NuvaShin', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Lower_R_1: { kitNodeName: 'NuvaShin', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Upper_L_1: { kitNodeName: 'NuvaQuad', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  Leg_Upper_R_1: { kitNodeName: 'NuvaQuad', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: KOPAKA_NUVA_PALETTE_COLORS },
};
