import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';

/**
 * Onewa sockets on `Toa_Metru/Onewa.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js sanitizes glTF node names at load: spaces → `_`, `.` removed.
 *
 * Proto piton segments share one kit mesh (`ProtoPiton`); each empty clones the
 * full tool so handles and tips tint from the weapon palette.
 */

const ONEWA_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const ONEWA_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const ONEWA_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const ONEWA_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const ONEWA_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...ONEWA_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const ONEWA_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...ONEWA_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const ONEWA_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...ONEWA_BODY_COLORS,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const ONEWA_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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

const ONEWA_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...ONEWA_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 10),
};

const ONEWA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Onewa — sockets filled from `kit_2004.glb`. */
export const ONEWA_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AxleArm3L_B: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: ONEWA_BODY_COLORS },
  AxleArm3L_F: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: ONEWA_BODY_COLORS },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: ONEWA_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: ONEWA_ARM_COLORS,
  },
  MetruArm_LowerL: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: ONEWA_ARM_COLORS },
  MetruArm_LowerR: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: ONEWA_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: ONEWA_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: ONEWA_BODY_COLORS,
  },
  MetruFoot_L: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: ONEWA_FEET_COLORS },
  MetruFoot_R: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: ONEWA_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: ONEWA_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: ONEWA_HEAD_COLORS },
  MetruHips: { kitNodeName: KIT_2004_NODES.MetruHips, materialColors: ONEWA_BODY_COLORS },
  MetruLeg_LowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: ONEWA_LEG_COLORS },
  MetruLeg_LowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: ONEWA_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: ONEWA_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: ONEWA_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: ONEWA_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: ONEWA_ARM_COLORS,
  },
  MetruTorso: { kitNodeName: KIT_2004_NODES.MetruTorso, materialColors: ONEWA_BODY_COLORS },
  ProtoPiton_L: { kitNodeName: KIT_2004_NODES.ProtoPiton, materialColors: ONEWA_WEAPON_COLORS },
  ProtoPiton_R: { kitNodeName: KIT_2004_NODES.ProtoPiton, materialColors: ONEWA_WEAPON_COLORS },
  SocketDouble1L_ArmL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: ONEWA_SOCKET_COLORS,
  },
  SocketDouble1L_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: ONEWA_SOCKET_COLORS,
  },
  TechnicPinBush_R: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: ONEWA_BLACK,
  },
};

/** Onewa — Technic pins / axles / sockets from `kit_2001.glb`. */
export const ONEWA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: ONEWA_BLACK },
  Axle2L_Neck: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: ONEWA_AXLE_COLORS },
  Axle3L_Hip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: ONEWA_AXLE_COLORS },
  Axle3L_Hip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: ONEWA_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: ONEWA_AXLE_COLORS },
  AxleMod2L_ArmUpperL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: ONEWA_BODY_COLORS,
  },
  AxleMod2L_ArmUpperR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: ONEWA_BODY_COLORS,
  },
  AxlePin_L: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: ONEWA_BLACK },
  AxlePin_R: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: ONEWA_BLACK },
  AxleSocket3L_L: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: ONEWA_SOCKET_COLORS,
  },
  AxleSocket3L_R: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: ONEWA_SOCKET_COLORS,
  },
  GearM_B: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONEWA_AXLE_COLORS },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONEWA_BLACK },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: ONEWA_BLACK },
  Pin2L_L: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: ONEWA_BLACK },
  Pin2L_R: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: ONEWA_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONEWA_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONEWA_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONEWA_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONEWA_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: ONEWA_SOCKET_COLORS },
};
