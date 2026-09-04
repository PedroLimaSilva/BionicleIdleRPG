import { LegoColor } from '../../../../../types/Colors';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { KIT_BRAIN_SOCKET_MATERIAL_COLORS } from '../../palettes/brainKitPalette';
import { kitPartGlow, kitPartMainAsMetal, kitPartSlots } from '../../palettes/partSlots';
import { KIT_TECHNIC_MAIN_BLACK } from '../../palettes/technicKitPalette';

const TAKANUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const TAKANUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const TAKANUVA_GRAY: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: kitPartMainAsMetal('arms'),
  Solid_Black: kitPartMainAsMetal('arms'),
};

const TAKANUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Solid_Black: { kind: 'lego', value: LegoColor.Black },
};

const TAKANUVA_LIGHT_SPEAR_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...kitPartGlow('weapon', 10),
  ...kitPartSlots('weapon', 'nuva'),
  Main: kitPartMainAsMetal('weapon'),
};

const TAKANUVA_ARM_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...kitPartGlow('arms', 10),
  ...kitPartSlots('arms', 'nuva'),
  Main: kitPartMainAsMetal('arms'),
};

const TAKANUVA_LEG_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...kitPartGlow('legs', 10),
  ...kitPartSlots('legs', 'nuva'),
  Main: kitPartMainAsMetal('legs'),
};

/**
 * Takanuva — sockets on `Toa_Nuva/takanuva.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const TAKANUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle3L: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: TAKANUVA_BLACK },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConnRidged: { kitNodeName: KIT_2001_NODES.AxleConnRidged, materialColors: TAKANUVA_GRAY },
  AxleConPin2: { kitNodeName: KIT_2001_NODES.AxleConPin2, materialColors: TAKANUVA_GRAY },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: TAKANUVA_GRAY },
  AxleMod2LL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: { Solid_Black: { kind: 'lego', value: LegoColor.Blue } },
  },
  AxleMod3L: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: TAKANUVA_GRAY },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: TAKANUVA_GRAY },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleSocket1L: { kitNodeName: KIT_2001_NODES.AxleSocket1L, materialColors: TAKANUVA_GRAY },
  AxleSpacer1L: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: TAKANUVA_GRAY },
  BallJoint: { kitNodeName: KIT_2001_NODES.BallJoint, materialColors: KIT_TECHNIC_MAIN_BLACK },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: TAKANUVA_GRAY },
  GearMB: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAKANUVA_GRAY },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: TAKANUVA_GRAY },
  MataAbdomen: { kitNodeName: KIT_2001_NODES.MataAbdomen, materialColors: TAKANUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KIT_BRAIN_SOCKET_MATERIAL_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: TAKANUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: TAKANUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAKANUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: TAKANUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: TAKANUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: TAKANUVA_PALETTE_COLORS },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  SocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: TAKANUVA_PALETTE_COLORS },
  SocketModSideL: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  SocketModSideR: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  SocketModTopL: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  SocketModTopR: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: TAKANUVA_PALETTE_COLORS },
};

/**
 * Takanuva — Nuva limbs and light spear from `kit_2003.glb`.
 */
export const TAKANUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  LightSpear: {
    kitNodeName: KIT_2003_NODES.LightSpear,
    materialColors: TAKANUVA_LIGHT_SPEAR_PALETTE_COLORS,
  },
  NuvaBicepsL: { kitNodeName: KIT_2003_NODES.NuvaBiceps, materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaBicepsR: { kitNodeName: KIT_2003_NODES.NuvaBiceps, materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaCalfL: {
    kitNodeName: KIT_2003_NODES.NuvaCalf,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaCalfR: {
    kitNodeName: KIT_2003_NODES.NuvaCalf,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaForearmArmorL: {
    kitNodeName: KIT_2003_NODES.NuvaForearmArmor,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
  NuvaForearmArmorR: {
    kitNodeName: KIT_2003_NODES.NuvaForearmArmor,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
  NuvaForearmL: {
    kitNodeName: KIT_2003_NODES.NuvaForearm,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
  NuvaForearmR: {
    kitNodeName: KIT_2003_NODES.NuvaForearm,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: TAKANUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: TAKANUVA_PALETTE_COLORS },
  NuvaShinL: {
    kitNodeName: KIT_2003_NODES.NuvaShin,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaShinR: {
    kitNodeName: KIT_2003_NODES.NuvaShin,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaThighL: {
    kitNodeName: KIT_2003_NODES.NuvaThigh,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaThighR: {
    kitNodeName: KIT_2003_NODES.NuvaThigh,
    materialColors: TAKANUVA_LEG_PALETTE_COLORS,
  },
  NuvaTricepsL: {
    kitNodeName: KIT_2003_NODES.NuvaTriceps,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
  NuvaTricepsR: {
    kitNodeName: KIT_2003_NODES.NuvaTriceps,
    materialColors: TAKANUVA_ARM_PALETTE_COLORS,
  },
};
