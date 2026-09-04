import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';
import { KIT_TECHNIC_MAIN_AXLE_GRAY } from '../../palettes/technicKitPalette';

/**
 * Nuju sockets on `Toa_Metru/Nuju.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js sanitizes glTF node names at load: spaces → `_`, `.` removed
 * (`CrystalSpike_Weapon L` → `CrystalSpike_Weapon_L`, `Pin3L_Chest.L` → `Pin3L_ChestL`).
 *
 * Crystal Spike blades and handles share one kit mesh (`CrystalSpike`); each empty
 * clones the full tool so grips and spikes tint from the weapon palette.
 */

const NUJU_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const NUJU_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const NUJU_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const NUJU_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const NUJU_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NUJU_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const NUJU_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NUJU_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const NUJU_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...KIT_TECHNIC_MAIN_AXLE_GRAY,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const NUJU_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Glow: {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
  'Nuju Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const NUJU_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NUJU_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 10),
  Secondary: {
    color: { kind: 'part', part: 'weapon', slot: 'secondary' },
    metalness: 0,
    opacity: 0.5,
    roughness: 0.2,
    weathered: false,
  },
};

const NUJU_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Nuju — sockets filled from `kit_2004.glb`. */
export const NUJU_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AxleArm3LB: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: NUJU_BODY_COLORS },
  AxleArm3LF: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: NUJU_BODY_COLORS },
  CrystalSpike_Weapon_L: {
    kitNodeName: KIT_2004_NODES.CrystalSpike,
    materialColors: NUJU_WEAPON_COLORS,
  },
  CrystalSpike_Weapon_R: {
    kitNodeName: KIT_2004_NODES.CrystalSpike,
    materialColors: NUJU_WEAPON_COLORS,
  },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: NUJU_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: NUJU_ARM_COLORS,
  },
  MetruArm_ArmLowerL: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: NUJU_ARM_COLORS },
  MetruArm_ArmLowerR: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: NUJU_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: NUJU_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: NUJU_BODY_COLORS,
  },
  MetruFoot_FootL: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: NUJU_FEET_COLORS },
  MetruFoot_FootR: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: NUJU_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: NUJU_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: NUJU_HEAD_COLORS },
  MetruHips_Hip: {
    kitNodeName: KIT_2004_NODES.MetruHips,
    materialColors: NUJU_BODY_COLORS,
  },
  MetruLeg_LegLowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: NUJU_LEG_COLORS },
  MetruLeg_LegLowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: NUJU_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: NUJU_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: NUJU_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: NUJU_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: NUJU_ARM_COLORS,
  },
  MetruTorso_Chest: {
    kitNodeName: KIT_2004_NODES.MetruTorso,
    materialColors: NUJU_BODY_COLORS,
  },
  SocketDouble1L_ArmL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NUJU_SOCKET_COLORS,
  },
  SocketDouble1L_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NUJU_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NUJU_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NUJU_SOCKET_COLORS,
  },
};

/** Nuju — Technic pins / axles / sockets from `kit_2001.glb`. */
export const NUJU_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Chest: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: NUJU_BLACK },
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: NUJU_BLACK },
  Axle3L_Hip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NUJU_AXLE_COLORS },
  Axle3L_Hip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NUJU_AXLE_COLORS },
  Axle3L_Hip3: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NUJU_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: NUJU_AXLE_COLORS },
  AxleMod2L_ArmUpperL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: NUJU_BODY_COLORS,
  },
  AxleMod2L_ArmUpperR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: NUJU_BODY_COLORS,
  },
  AxleSocket3L_ShoulderL: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: NUJU_SOCKET_COLORS,
  },
  AxleSocket3L_ShoulderR: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: NUJU_SOCKET_COLORS,
  },
  GearM_Hip: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NUJU_AXLE_COLORS },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NUJU_AXLE_COLORS },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NUJU_AXLE_COLORS },
  Pin2L_L: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Pin2L_R: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Pin2L_WL1: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Pin2L_WL2: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Pin2L_WR1: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Pin2L_WR2: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NUJU_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NUJU_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NUJU_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NUJU_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NUJU_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NUJU_SOCKET_COLORS },
};

/** Nuju — chest pins from `kit_2003.glb`. */
export const NUJU_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Pin3L_ChestL: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: NUJU_BLACK },
  Pin3L_ChestR: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: NUJU_BLACK },
};
