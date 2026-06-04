import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

const TAHU_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const TAHU_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const TAHU_NUVA_MAGMA_BLADE_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAHU_NUVA_PALETTE_COLORS,
  Glow: {
    emissive: { key: 'weaponGlow', kind: 'palette' },
    emissiveIntensity: 10,
    weathered: false,
  },
};

const TAHU_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Tahu Nuva — sockets on `Toa_Nuva/tahu.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const TAHU_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle6L: { kitNodeName: 'Axle6L', materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleConPin2: { kitNodeName: 'AxleConPin2', materialColors: TAHU_NUVA_BLACK },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: 'AxleMod3L', materialColors: TAHU_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: 'AxleMod3L', materialColors: TAHU_NUVA_BLACK },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: 'MataFoot', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: 'MataFoot', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: TAHU_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataLegModPistonNL: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonNR: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTL: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTR: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModShinL: { kitNodeName: 'MataLegModShin', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataLegModShinR: { kitNodeName: 'MataLegModShin', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataLegModThighL: { kitNodeName: 'MataLegModThigh', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataLegModThighR: { kitNodeName: 'MataLegModThigh', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: TAHU_NUVA_PALETTE_COLORS },
  SocketL: { kitNodeName: 'Socket', materialColors: TAHU_NUVA_PALETTE_COLORS },
  SocketModSideL: { kitNodeName: 'SocketModSide', materialColors: TAHU_NUVA_BLACK },
  SocketModSideR: { kitNodeName: 'SocketModSide', materialColors: TAHU_NUVA_BLACK },
  SocketModTopL: { kitNodeName: 'SocketModTop', materialColors: TAHU_NUVA_BLACK },
  SocketModTopR: { kitNodeName: 'SocketModTop', materialColors: TAHU_NUVA_BLACK },
  SocketR: { kitNodeName: 'Socket', materialColors: TAHU_NUVA_PALETTE_COLORS },
};

/**
 * Tahu Nuva — Nuva limbs and magma blade from `kit_2003.glb`.
 */
export const TAHU_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  MagmaBladeL: {
    kitNodeName: 'MagmaBlade',
    materialColors: TAHU_NUVA_MAGMA_BLADE_PALETTE_COLORS,
  },
  MagmaBladeR: {
    kitNodeName: 'MagmaBlade',
    materialColors: TAHU_NUVA_MAGMA_BLADE_PALETTE_COLORS,
  },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: TAHU_NUVA_PALETTE_COLORS },
};
