import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';

/**
 * Whenua sockets on `Toa_Metru/Whenua.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js sanitizes glTF node names at load: spaces → `_`, `.` removed.
 *
 * Earthshock drill blades and handles share one kit mesh (`EarthshockDrill`);
 * each empty clones the full tool so grips and spikes tint from the weapon palette.
 */

const WHENUA_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const WHENUA_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const WHENUA_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const WHENUA_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const WHENUA_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...WHENUA_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const WHENUA_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...WHENUA_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const WHENUA_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...WHENUA_BODY_COLORS,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const WHENUA_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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
};

const WHENUA_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...WHENUA_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 1),
};

const WHENUA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Whenua — sockets filled from `kit_2004.glb`. */
export const WHENUA_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AxleArm3L_B: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: WHENUA_BODY_COLORS },
  AxleArm3L_F: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: WHENUA_BODY_COLORS },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: WHENUA_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: WHENUA_ARM_COLORS,
  },
  EarthShockDrill_L: {
    kitNodeName: KIT_2004_NODES.EarthshockDrill,
    materialColors: WHENUA_WEAPON_COLORS,
  },
  EarthshockDrill_R: {
    kitNodeName: KIT_2004_NODES.EarthshockDrill,
    materialColors: WHENUA_WEAPON_COLORS,
  },
  MetruArm_ArmLowerL: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: WHENUA_ARM_COLORS },
  MetruArm_ArmLowerR: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: WHENUA_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: WHENUA_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: WHENUA_BODY_COLORS,
  },
  MetruFoot_FootL: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: WHENUA_FEET_COLORS },
  MetruFoot_FootR: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: WHENUA_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: WHENUA_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: WHENUA_HEAD_COLORS },
  MetruHips_Hip: {
    kitNodeName: KIT_2004_NODES.MetruHips,
    materialColors: WHENUA_BODY_COLORS,
  },
  MetruLeg_LegLowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: WHENUA_LEG_COLORS },
  MetruLeg_LegLowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: WHENUA_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: WHENUA_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: WHENUA_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: WHENUA_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: WHENUA_ARM_COLORS,
  },
  MetruTorso_Chest: {
    kitNodeName: KIT_2004_NODES.MetruTorso,
    materialColors: WHENUA_BODY_COLORS,
  },
  SocketDouble1L_ArmL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  SocketDouble1L_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  TechnicPinBush_L: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: WHENUA_BLACK,
  },
  TechnicPinBush_R: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: WHENUA_BLACK,
  },
};

/** Whenua — Technic pins / axles / sockets from `kit_2001.glb`. */
export const WHENUA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: WHENUA_BLACK },
  Axle2L_Neck: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: WHENUA_AXLE_COLORS },
  Axle3L_Hip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: WHENUA_AXLE_COLORS },
  Axle3L_Hip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: WHENUA_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: WHENUA_AXLE_COLORS },
  AxleMod2L_ArmUpperL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: WHENUA_BODY_COLORS,
  },
  AxleMod2L_ArmUpperR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: WHENUA_BODY_COLORS,
  },
  AxlePin_L: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: WHENUA_BLACK },
  AxlePin_R: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: WHENUA_BLACK },
  AxleSocket3L_L: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  AxleSocket3L_R: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: WHENUA_SOCKET_COLORS,
  },
  GearM_B: { kitNodeName: KIT_2001_NODES.GearM, materialColors: WHENUA_AXLE_COLORS },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: WHENUA_BLACK },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: WHENUA_BLACK },
  Pin2L_LegL: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: WHENUA_BLACK },
  Pin2L_LegR: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: WHENUA_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: WHENUA_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: WHENUA_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: WHENUA_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: WHENUA_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: WHENUA_SOCKET_COLORS },
};
