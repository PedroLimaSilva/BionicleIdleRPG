import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

const LEWA_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const LEWA_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const LEWA_NUVA_AIR_CUTTER_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LEWA_NUVA_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

const LEWA_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Lewa Nuva — sockets on `Toa_Nuva/lewa.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const LEWA_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle6L: { kitNodeName: 'Axle6L', materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleConPin2: { kitNodeName: 'AxleConPin2', materialColors: LEWA_NUVA_BLACK },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: 'AxleMod3L', materialColors: LEWA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: 'AxleMod3L', materialColors: LEWA_NUVA_BLACK },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: 'MataFoot', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: 'MataFoot', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: LEWA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataLegModPistonNL: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonNR: {
    kitNodeName: 'MataLegModPistonN',
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTL: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTR: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModShinL: { kitNodeName: 'MataLegModShin', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataLegModShinR: { kitNodeName: 'MataLegModShin', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataLegModThighL: { kitNodeName: 'MataLegModThigh', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataLegModThighR: { kitNodeName: 'MataLegModThigh', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: LEWA_NUVA_PALETTE_COLORS },
  SocketL: { kitNodeName: 'Socket', materialColors: LEWA_NUVA_PALETTE_COLORS },
  SocketModSideL: { kitNodeName: 'SocketModSide', materialColors: LEWA_NUVA_BLACK },
  SocketModSideR: { kitNodeName: 'SocketModSide', materialColors: LEWA_NUVA_BLACK },
  SocketModTopL: { kitNodeName: 'SocketModTop', materialColors: LEWA_NUVA_BLACK },
  SocketModTopR: { kitNodeName: 'SocketModTop', materialColors: LEWA_NUVA_BLACK },
  SocketR: { kitNodeName: 'Socket', materialColors: LEWA_NUVA_PALETTE_COLORS },
};

/**
 * Lewa Nuva — Nuva limbs and air cutters from `kit_2003.glb`.
 */
export const LEWA_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  AirCutterL: {
    kitNodeName: 'AirCutter',
    materialColors: LEWA_NUVA_AIR_CUTTER_PALETTE_COLORS,
  },
  AirCutterR: {
    kitNodeName: 'AirCutter',
    materialColors: LEWA_NUVA_AIR_CUTTER_PALETTE_COLORS,
  },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: LEWA_NUVA_PALETTE_COLORS },
};
