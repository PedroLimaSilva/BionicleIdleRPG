import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

const TAKANUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  Metal: {
    color: { kind: 'lego', value: LegoColor.FlatDarkGold },
    envMapIntensity: 0.9,
    fineScale: 22,
    grimeDarken: 0.15,
    grimeMetalnessReduce: 0.25,
    grimeRoughness: 0.12,
    metalness: 0.95,
    roughness: 0.18,
    weathered: true,
  },
};

const TAKANUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const TAKANUVA_GRAY: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { ...NUVA_KIT_METAL.Metal! },
  Solid_Black: { ...NUVA_KIT_METAL.Metal! },
};

const TAKANUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};

const TAKANUVA_LIGHT_SPEAR_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAKANUVA_PALETTE_COLORS,
  Glow: {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 10,
    weathered: false,
  },
  Main: { ...NUVA_KIT_METAL.Metal!, color: { kind: 'lego', value: LegoColor.FlatDarkGold } },
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.9,
    fineScale: 22,
    grimeDarken: 0.15,
    grimeMetalnessReduce: 0.25,
    grimeRoughness: 0.12,
    metalness: 0.95,
    roughness: 0.18,
    weathered: true,
  },
};

const TAKANUVA_LIMBS_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...TAKANUVA_PALETTE_COLORS,
  Glow: {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 10,
    weathered: false,
  },
  Main: { ...NUVA_KIT_METAL.Metal! },
  Metal: { ...NUVA_KIT_METAL.Metal!, color: { kind: 'lego', value: LegoColor.FlatDarkGold } },
  Secondary: { key: 'body', kind: 'palette' },
};

/**
 * Takanuva — sockets on `Toa_Nuva/takanuva.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const TAKANUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle3L: { kitNodeName: 'Axle3L', materialColors: TAKANUVA_BLACK },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: TAKANUVA_PALETTE_COLORS },
  AxleConnRidged: { kitNodeName: 'AxleConnRidged', materialColors: TAKANUVA_GRAY },
  AxleConPin2: { kitNodeName: 'AxleConPin2', materialColors: TAKANUVA_GRAY },
  AxleMod2L: { kitNodeName: 'AxleMod2L', materialColors: TAKANUVA_GRAY },
  AxleMod2LL: {
    kitNodeName: 'AxleMod2L',
    materialColors: { Solid_Black: { kind: 'lego', value: LegoColor.Blue } },
  },
  AxleMod3L: { kitNodeName: 'AxleMod3L', materialColors: TAKANUVA_GRAY },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: TAKANUVA_GRAY },
  AxlePin: { kitNodeName: 'AxlePin', materialColors: TAKANUVA_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L', materialColors: TAKANUVA_GRAY },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L', materialColors: TAKANUVA_GRAY },
  BallJoint: { kitNodeName: 'BallJoint', materialColors: TAKANUVA_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: TAKANUVA_GRAY },
  GearMB: { kitNodeName: 'GearM', materialColors: TAKANUVA_GRAY },
  GearMR: { kitNodeName: 'GearM', materialColors: TAKANUVA_GRAY },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: TAKANUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: TAKANUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: TAKANUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: 'MataFoot', materialColors: TAKANUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: 'MataFoot', materialColors: TAKANUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: TAKANUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: TAKANUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: TAKANUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: TAKANUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: TAKANUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketL: { kitNodeName: 'Socket', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketModSideL: { kitNodeName: 'SocketModSide', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketModSideR: { kitNodeName: 'SocketModSide', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketModTopL: { kitNodeName: 'SocketModTop', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketModTopR: { kitNodeName: 'SocketModTop', materialColors: TAKANUVA_PALETTE_COLORS },
  SocketR: { kitNodeName: 'Socket', materialColors: TAKANUVA_PALETTE_COLORS },
};

/**
 * Takanuva — Nuva limbs and light spear from `kit_2003.glb`.
 */
export const TAKANUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  LightSpear: { kitNodeName: 'LightSpear', materialColors: TAKANUVA_LIGHT_SPEAR_PALETTE_COLORS },
  NuvaBicepsL: { kitNodeName: 'NuvaBiceps', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaBicepsR: { kitNodeName: 'NuvaBiceps', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaForearmArmorL: {
    kitNodeName: 'NuvaForearmArmor',
    materialColors: TAKANUVA_LIMBS_PALETTE_COLORS,
  },
  NuvaForearmArmorR: {
    kitNodeName: 'NuvaForearmArmor',
    materialColors: TAKANUVA_LIMBS_PALETTE_COLORS,
  },
  NuvaForearmL: { kitNodeName: 'NuvaForearm', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaForearmR: { kitNodeName: 'NuvaForearm', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaTricepsL: { kitNodeName: 'NuvaTriceps', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
  NuvaTricepsR: { kitNodeName: 'NuvaTriceps', materialColors: TAKANUVA_LIMBS_PALETTE_COLORS },
};
