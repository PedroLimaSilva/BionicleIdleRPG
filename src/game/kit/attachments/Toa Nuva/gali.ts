import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const GALI_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
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
    emissive: { key: 'weaponGlow', kind: 'palette' },
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
export const GALI_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle6L: { kitNodeName: 'Axle6L', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleConPin2: { kitNodeName: 'AxleConPin2', materialColors: GALI_NUVA_BLACK },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxlePinL: { kitNodeName: 'AxlePin', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxlePinR: { kitNodeName: 'AxlePin', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: GALI_NUVA_PALETTE_COLORS },
  FootL: { kitNodeName: 'MataFoot', materialColors: GALI_NUVA_PALETTE_COLORS },
  FootR: { kitNodeName: 'MataFoot', materialColors: GALI_NUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: GALI_NUVA_PALETTE_COLORS },
  GearMB: { kitNodeName: 'GearM', materialColors: GALI_NUVA_PALETTE_COLORS },
  GearML: { kitNodeName: 'GearM', materialColors: GALI_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: GALI_NUVA_PALETTE_COLORS },
  HandL: { kitNodeName: 'Socket', materialColors: GALI_NUVA_PALETTE_COLORS },
  HandR: { kitNodeName: 'Socket', materialColors: GALI_NUVA_PALETTE_COLORS },
  HipL: { kitNodeName: 'SocketModTop', materialColors: GALI_NUVA_BLACK },
  HipR: { kitNodeName: 'SocketModTop', materialColors: GALI_NUVA_BLACK },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: GALI_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: GALI_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: GALI_NUVA_PALETTE_COLORS },
  ShoulderJointL: { kitNodeName: 'SocketModSide', materialColors: GALI_NUVA_BLACK },
  ShoulderJointR: { kitNodeName: 'SocketModSide', materialColors: GALI_NUVA_BLACK },
};

/**
 * Gali Nuva — Nuva limbs, tools, and 2003 axles from `kit_2003.glb`.
 * Socket names on the rig use `.L` / `R`; kit nodes are unpaired.
 */
export const GALI_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  AquaAxeL: { kitNodeName: 'AquaAxe', materialColors: GALI_NUVA_AQUA_AXE_PALETTE_COLORS },
  AquaAxeR: { kitNodeName: 'AquaAxe', materialColors: GALI_NUVA_AQUA_AXE_PALETTE_COLORS },
  Axle3LStudL: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  Axle3LStudR: {
    kitNodeName: 'Axle3LStud',
    materialColors: { Main: { kind: 'lego', value: LegoColor.DarkGray } },
  },
  AxleSpacer12L: { kitNodeName: 'AxleSpacer12', materialColors: GALI_NUVA_PALETTE_COLORS },
  AxleSpacer12R: { kitNodeName: 'AxleSpacer12', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaBicepsL: { kitNodeName: 'NuvaBiceps', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaBicepsR: { kitNodeName: 'NuvaBiceps', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaForearmArmorL: {
    kitNodeName: 'NuvaForearmArmor',
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaForearmArmorR: {
    kitNodeName: 'NuvaForearmArmor',
    materialColors: GALI_NUVA_PALETTE_COLORS,
  },
  NuvaForearmL: { kitNodeName: 'NuvaForearm', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaForearmR: { kitNodeName: 'NuvaForearm', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaTricepsL: { kitNodeName: 'NuvaTriceps', materialColors: GALI_NUVA_PALETTE_COLORS },
  NuvaTricepsR: { kitNodeName: 'NuvaTriceps', materialColors: GALI_NUVA_PALETTE_COLORS },
  PropellerL: { kitNodeName: 'Propeller', materialColors: GALI_NUVA_PROPELLER_PALETTE_COLORS },
  PropellerR: { kitNodeName: 'Propeller', materialColors: GALI_NUVA_PROPELLER_PALETTE_COLORS },
};
