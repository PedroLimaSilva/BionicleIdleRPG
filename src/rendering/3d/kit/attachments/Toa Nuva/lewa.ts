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
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';
import { KIT_BRAIN_SOCKET_MATERIAL_COLORS } from '../../palettes/brainKitPalette';
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
export const LEWA_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleConPin2: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: LEWA_NUVA_BLACK },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: LEWA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: LEWA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: LEWA_NUVA_BLACK },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  AxleSocket1L: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LEWA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KIT_BRAIN_SOCKET_MATERIAL_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: LEWA_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: LEWA_NUVA_PALETTE_COLORS },
  MataLegModPistonNL: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonNR: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTL: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTR: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModShinL: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModShinR: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModThighL: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataLegModThighR: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  SocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LEWA_NUVA_PALETTE_COLORS },
  SocketModSideL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: LEWA_NUVA_BLACK },
  SocketModSideR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: LEWA_NUVA_BLACK },
  SocketModTopL: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: LEWA_NUVA_BLACK },
  SocketModTopR: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: LEWA_NUVA_BLACK },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LEWA_NUVA_PALETTE_COLORS },
};

/**
 * Lewa Nuva — Nuva limbs and air cutters from `kit_2003.glb`.
 */
export const LEWA_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  AirCutterL: {
    kitNodeName: KIT_2003_NODES.AirCutter,
    materialColors: LEWA_NUVA_AIR_CUTTER_PALETTE_COLORS,
  },
  AirCutterR: {
    kitNodeName: KIT_2003_NODES.AirCutter,
    materialColors: LEWA_NUVA_AIR_CUTTER_PALETTE_COLORS,
  },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: LEWA_NUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: LEWA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: LEWA_NUVA_PALETTE_COLORS },
};
