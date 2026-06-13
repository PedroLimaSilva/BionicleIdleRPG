import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

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
export const ONUA_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle6L: { kitNodeName: 'Axle6L', materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: 'AxleMod3L', materialColors: ONUA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: 'AxleMod3L', materialColors: ONUA_NUVA_BLACK },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxlePin: { kitNodeName: 'AxlePin', materialColors: { Metal: ONUA_NUVA_BLACK.Main } },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: 'MataFoot', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: 'MataFoot', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: ONUA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: ONUA_NUVA_PALETTE_COLORS },
  SocketL: { kitNodeName: 'Socket', materialColors: ONUA_NUVA_PALETTE_COLORS },
  SocketModSideAL: { kitNodeName: 'SocketModSide', materialColors: ONUA_NUVA_BLACK },
  SocketModSideAR: { kitNodeName: 'SocketModSide', materialColors: ONUA_NUVA_BLACK },
  SocketModSideHL: { kitNodeName: 'SocketModSide', materialColors: ONUA_NUVA_BLACK },
  SocketModSideHR: { kitNodeName: 'SocketModSide', materialColors: ONUA_NUVA_BLACK },
  SocketR: { kitNodeName: 'Socket', materialColors: ONUA_NUVA_PALETTE_COLORS },
};

/**
 * Onua Nuva — Nuva limbs, quake breakers, and Bohrok arms from `kit_2003.glb`.
 */
export const ONUA_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle3LStudL: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  Axle3LStudR: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  AxleSpacer12L: { kitNodeName: 'AxleSpacer12', materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxleSpacer12R: { kitNodeName: 'AxleSpacer12', materialColors: ONUA_NUVA_PALETTE_COLORS },
  BohrokArmL: {
    kitNodeName: 'BohrokArm',
    materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary },
  },
  BohrokArmR: {
    kitNodeName: 'BohrokArm',
    materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary },
  },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: ONUA_NUVA_PALETTE_COLORS },
  QuakeBreakerL: { kitNodeName: 'QuakeBreaker', materialColors: ONUA_NUVA_PALETTE_COLORS },
  QuakeBreakerR: { kitNodeName: 'QuakeBreaker', materialColors: ONUA_NUVA_PALETTE_COLORS },
};
