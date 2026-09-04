import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { KIT_BRAIN_SOCKET_MATERIAL_COLORS } from '../../palettes/brainKitPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from '../../palettes/technicKitPalette';

const ONUA_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(10),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const ONUA_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 10,
    weathered: false,
  },
};

const ONUA_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Onua Nuva — sockets on `Toa_Nuva/onua.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 * Part 6553 (`Object.539`) remains a unique mesh on the character GLB (not a kit part).
 */
export const ONUA_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: ONUA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: ONUA_NUVA_BLACK },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KIT_BRAIN_SOCKET_MATERIAL_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: ONUA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  SocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONUA_NUVA_PALETTE_COLORS },
  SocketModSideAL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: ONUA_NUVA_BLACK },
  SocketModSideAR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: ONUA_NUVA_BLACK },
  SocketModSideHL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: ONUA_NUVA_BLACK },
  SocketModSideHR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: ONUA_NUVA_BLACK },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONUA_NUVA_PALETTE_COLORS },
};

/**
 * Onua Nuva — Nuva limbs, quake breakers, and Bohrok arms from `kit_2003.glb`.
 */
export const ONUA_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Axle3LStudL: {
    kitNodeName: KIT_2003_NODES.Axle3LStud,
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  Axle3LStudR: {
    kitNodeName: KIT_2003_NODES.Axle3LStud,
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  AxleSpacer12L: {
    kitNodeName: KIT_2003_NODES.AxleSpacerHalf,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  AxleSpacer12R: {
    kitNodeName: KIT_2003_NODES.AxleSpacerHalf,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  BohrokArmL: {
    kitNodeName: KIT_2003_NODES.BohrokArm,
    materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary },
  },
  BohrokArmR: {
    kitNodeName: KIT_2003_NODES.BohrokArm,
    materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary },
  },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: ONUA_NUVA_PALETTE_COLORS },
  QuakeBreakerL: {
    kitNodeName: KIT_2003_NODES.QuakeBreaker,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
  QuakeBreakerR: {
    kitNodeName: KIT_2003_NODES.QuakeBreaker,
    materialColors: ONUA_NUVA_PALETTE_COLORS,
  },
};
