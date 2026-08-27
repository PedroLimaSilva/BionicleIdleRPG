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
    emissive: { kind: 'part', part: 'weapon', slot: 'glow' },
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
export const TAHU_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleConPin2: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: TAHU_NUVA_BLACK },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: TAHU_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: TAHU_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: TAHU_NUVA_BLACK },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  AxleSocket1L: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAHU_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: TAHU_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: TAHU_NUVA_PALETTE_COLORS },
  MataLegModPistonNL: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonNR: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTL: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModPistonTR: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModShinL: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModShinR: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModThighL: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataLegModThighR: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  SocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: TAHU_NUVA_PALETTE_COLORS },
  SocketModSideL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: TAHU_NUVA_BLACK },
  SocketModSideR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: TAHU_NUVA_BLACK },
  SocketModTopL: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: TAHU_NUVA_BLACK },
  SocketModTopR: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: TAHU_NUVA_BLACK },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: TAHU_NUVA_PALETTE_COLORS },
};

/**
 * Tahu Nuva — Nuva limbs and magma blade from `kit_2003.glb`.
 */
export const TAHU_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  MagmaBladeL: {
    kitNodeName: KIT_2003_NODES.MagmaBlade,
    materialColors: TAHU_NUVA_MAGMA_BLADE_PALETTE_COLORS,
  },
  MagmaBladeR: {
    kitNodeName: KIT_2003_NODES.MagmaBlade,
    materialColors: TAHU_NUVA_MAGMA_BLADE_PALETTE_COLORS,
  },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: TAHU_NUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: TAHU_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: TAHU_NUVA_PALETTE_COLORS },
};
