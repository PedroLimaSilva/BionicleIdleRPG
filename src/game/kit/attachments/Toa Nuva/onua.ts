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
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: ONUA_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: ONUA_NUVA_BLACK },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: { Metal: ONUA_NUVA_BLACK.Main } },
  AxleSpacer1LB: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: ONUA_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: KIT_2001_NODES.MataAbdomen, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
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
  MataObliqueNL: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: KIT_2001_NODES.MataObliqueW, materialColors: ONUA_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: KIT_2001_NODES.MataObliqueW, materialColors: ONUA_NUVA_PALETTE_COLORS },
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
  'AxleSpacer12L': { kitNodeName: KIT_2003_NODES.AxleSpacerHalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  'AxleSpacer12R': { kitNodeName: KIT_2003_NODES.AxleSpacerHalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  BohrokArmL: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary } },
  BohrokArmR: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: { Main: ONUA_NUVA_PALETTE_COLORS.Secondary } },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: KIT_2003_NODES.NuvaPistonN, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: KIT_2003_NODES.NuvaPistonN, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: KIT_2003_NODES.NuvaPistonT, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: KIT_2003_NODES.NuvaPistonT, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: ONUA_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: ONUA_NUVA_PALETTE_COLORS },
  QuakeBreakerL: { kitNodeName: KIT_2003_NODES.QuakeBreaker, materialColors: ONUA_NUVA_PALETTE_COLORS },
  QuakeBreakerR: { kitNodeName: KIT_2003_NODES.QuakeBreaker, materialColors: ONUA_NUVA_PALETTE_COLORS },
};
