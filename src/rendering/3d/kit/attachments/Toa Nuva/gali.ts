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
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from '../../palettes/technicKitPalette';

const GALI_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const GALI_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const GALI_NUVA_AQUA_AXE_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...GALI_NUVA_PALETTE_COLORS,
  Glow: {
    emissive: { kind: 'part', part: 'weapon', slot: 'glow' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const GALI_NUVA_PROPELLER_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...GALI_NUVA_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

const GALI_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/**
 * Gali Nuva — sockets on `Toa_Nuva/gali.glb` filled from `kit_2001.glb`.
 */
export const GALI_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConPin2: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: GALI_NUVA_BLACK },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxlePinL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxlePinR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleSocket1L: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  FootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: GALI_NUVA_PALETTE_COLORS },
  FootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: GALI_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: GALI_NUVA_PALETTE_COLORS },
  HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: GALI_NUVA_PALETTE_COLORS },
  HipL: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: GALI_NUVA_BLACK },
  HipR: { kitNodeName: KIT_2001_NODES.SocketModTop, materialColors: GALI_NUVA_BLACK },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KIT_BRAIN_SOCKET_MATERIAL_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: GALI_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: GALI_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: GALI_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: GALI_NUVA_PALETTE_COLORS },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  ShoulderJointL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: GALI_NUVA_BLACK },
  ShoulderJointR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: GALI_NUVA_BLACK },
};

/**
 * Gali Nuva — Nuva limbs, tools, and 2003 axles from `kit_2003.glb`.
 * Socket names on the rig use `.L` / `R`; kit nodes are unpaired.
 */
export const GALI_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  AquaAxeL: {
    kitNodeName: KIT_2003_NODES.AquaAxe,
    materialColors: GALI_NUVA_AQUA_AXE_PALETTE_COLORS,
  },
  AquaAxeR: {
    kitNodeName: KIT_2003_NODES.AquaAxe,
    materialColors: GALI_NUVA_AQUA_AXE_PALETTE_COLORS,
  },
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
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  AxleSpacer12R: {
    kitNodeName: KIT_2003_NODES.AxleSpacerHalf,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaBicepsL: { kitNodeName: KIT_2003_NODES.NuvaBiceps, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaBicepsR: { kitNodeName: KIT_2003_NODES.NuvaBiceps, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaForearmArmorL: {
    kitNodeName: KIT_2003_NODES.NuvaForearmArmor,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaForearmArmorR: {
    kitNodeName: KIT_2003_NODES.NuvaForearmArmor,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaForearmL: {
    kitNodeName: KIT_2003_NODES.NuvaForearm,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaForearmR: {
    kitNodeName: KIT_2003_NODES.NuvaForearm,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaTricepsL: {
    kitNodeName: KIT_2003_NODES.NuvaTriceps,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaTricepsR: {
    kitNodeName: KIT_2003_NODES.NuvaTriceps,
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  PropellerL: {
    kitNodeName: KIT_2003_NODES.Propeller,
    materialColors: GALI_NUVA_PROPELLER_PALETTE_COLORS,
  },
  PropellerR: {
    kitNodeName: KIT_2003_NODES.Propeller,
    materialColors: GALI_NUVA_PROPELLER_PALETTE_COLORS,
  },
};
