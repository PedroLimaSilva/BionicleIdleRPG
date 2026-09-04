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
import { KIT_BRAIN_SOCKET_MATERIAL_COLORS } from '../../palettes/brainKitPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from '../../palettes/technicKitPalette';

const POHATU_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const POHATU_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const POHATU_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/** FootKick only exposes `Main`; match Nuva kit metal shininess. */
const POHATU_NUVA_FOOT_KICK_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: POHATU_NUVA_PALETTE_COLORS.Secondary,
  Secondary: NUVA_KIT_METAL.Metal!,
};

/**
 * Pohatu Nuva — sockets on `Toa_Nuva/pohatu.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const POHATU_NUVA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  Axle3LL: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: POHATU_NUVA_BLACK },
  Axle3LR: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: POHATU_NUVA_BLACK },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: KIT_TECHNIC_MAIN_BLACK },
  AxleConPin1: { kitNodeName: KIT_2001_NODES.AxleConPin1, materialColors: POHATU_NUVA_BLACK },
  AxleMod3LL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: POHATU_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: POHATU_NUVA_BLACK },
  AxleModHips: {
    kitNodeName: KIT_2001_NODES.AxleModHips,
    materialColors: KIT_TECHNIC_MAIN_BLACK,
  },
  AxlePinPerp3L: { kitNodeName: KIT_2001_NODES.AxlePinPerp3L, materialColors: POHATU_NUVA_BLACK },
  AxleSpacer1LB: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  AxleSpacer1LF: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: KIT_TECHNIC_MAIN_METAL,
  },
  FootKickL: {
    kitNodeName: KIT_2001_NODES.FootKick,
    materialColors: POHATU_NUVA_FOOT_KICK_PALETTE_COLORS,
  },
  FootKickR: {
    kitNodeName: KIT_2001_NODES.FootKick,
    materialColors: POHATU_NUVA_FOOT_KICK_PALETTE_COLORS,
  },
  GearB: { kitNodeName: KIT_2001_NODES.GearB, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: KIT_TECHNIC_MAIN_METAL },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  MataBrain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: KIT_BRAIN_SOCKET_MATERIAL_COLORS,
  },
  MataChest: { kitNodeName: KIT_2001_NODES.MataChest, materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: POHATU_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: KIT_2001_NODES.MataHip, materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataObliqueNL: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  MataObliqueNR: {
    kitNodeName: KIT_2001_NODES.MataObliqueN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  MataObliqueWL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  MataObliqueWR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  PerpendicularAxleJoint: {
    kitNodeName: KIT_2001_NODES.PerpendicularAxleJoint,
    materialColors: POHATU_NUVA_BLACK,
  },
  SocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: POHATU_NUVA_PALETTE_COLORS },
  SocketModSideAL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: POHATU_NUVA_BLACK },
  SocketModSideAR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: POHATU_NUVA_BLACK },
  SocketModSideHL: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: POHATU_NUVA_BLACK },
  SocketModSideHR: { kitNodeName: KIT_2001_NODES.SocketModSide, materialColors: POHATU_NUVA_BLACK },
  SocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmJointL: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmJointR: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmMainL: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmMainR: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonNL: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonNR: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonTL: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonTR: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
};

/**
 * Pohatu Nuva — Nuva limbs and climbing claws from `kit_2003.glb`.
 */
export const POHATU_NUVA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  NuvaCalfL: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: KIT_2003_NODES.NuvaCalf, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaPistonNL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonNR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonN,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTL: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  NuvaPistonTR: {
    kitNodeName: KIT_2003_NODES.NuvaPistonT,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  NuvaQuadL: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: KIT_2003_NODES.NuvaQuad, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: KIT_2003_NODES.NuvaShin, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: KIT_2003_NODES.NuvaThigh, materialColors: POHATU_NUVA_PALETTE_COLORS },
  PohatuClawL: {
    kitNodeName: KIT_2003_NODES.PohatuClaw,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  PohatuClawR: {
    kitNodeName: KIT_2003_NODES.PohatuClaw,
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
};
