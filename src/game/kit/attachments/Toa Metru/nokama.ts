import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';

/**
 * Nokama sockets on `Toa_Metru/Nokama.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js sanitizes glTF node names at load: spaces → `_`, `.` removed.
 *
 * Hydroblades attach at `Hydroblade_L` / `Hydroblade_R`; each empty clones the
 * full tool so grips and blades tint from the weapon palette.
 */

const NOKAMA_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const NOKAMA_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const NOKAMA_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const NOKAMA_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const NOKAMA_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NOKAMA_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const NOKAMA_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NOKAMA_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const NOKAMA_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NOKAMA_BODY_COLORS,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const NOKAMA_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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

const NOKAMA_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...NOKAMA_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 10),
};

const NOKAMA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Nokama — sockets filled from `kit_2004.glb`. */
export const NOKAMA_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AxleArm3L_B: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: NOKAMA_BODY_COLORS },
  AxleArm3L_F: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: NOKAMA_BODY_COLORS },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: NOKAMA_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: NOKAMA_ARM_COLORS,
  },
  Hydroblade_L: { kitNodeName: KIT_2004_NODES.Hydroblade, materialColors: NOKAMA_WEAPON_COLORS },
  Hydroblade_R: { kitNodeName: KIT_2004_NODES.Hydroblade, materialColors: NOKAMA_WEAPON_COLORS },
  MetruArm_L: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: NOKAMA_ARM_COLORS },
  MetruArm_R: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: NOKAMA_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: NOKAMA_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: NOKAMA_BODY_COLORS,
  },
  MetruFoot_L: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: NOKAMA_FEET_COLORS },
  MetruFoot_R: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: NOKAMA_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: NOKAMA_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: NOKAMA_HEAD_COLORS },
  MetruHips: { kitNodeName: KIT_2004_NODES.MetruHips, materialColors: NOKAMA_BODY_COLORS },
  MetruLeg_LegLowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: NOKAMA_LEG_COLORS },
  MetruLeg_LegLowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: NOKAMA_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: NOKAMA_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: NOKAMA_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: NOKAMA_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: NOKAMA_ARM_COLORS,
  },
  MetruTorso: { kitNodeName: KIT_2004_NODES.MetruTorso, materialColors: NOKAMA_BODY_COLORS },
  SocketDouble1L_ArmL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NOKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NOKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_LegL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NOKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_LegR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: NOKAMA_SOCKET_COLORS,
  },
};

/** Nokama — Technic pins / axles / sockets from `kit_2001.glb`. */
export const NOKAMA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: NOKAMA_BLACK },
  Axle2L_Neck: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: NOKAMA_AXLE_COLORS },
  Axle3L_Hip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NOKAMA_AXLE_COLORS },
  Axle3L_Hip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NOKAMA_AXLE_COLORS },
  Axle3L_Hip3: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: NOKAMA_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: NOKAMA_AXLE_COLORS },
  AxleMod2L_L: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: NOKAMA_BODY_COLORS,
  },
  AxleMod2L_R: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: NOKAMA_BODY_COLORS,
  },
  Gear_Shoulder_R001: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NOKAMA_BLACK },
  Gear_Shoulder_R002: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NOKAMA_BLACK },
  GearM_B: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NOKAMA_AXLE_COLORS },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NOKAMA_BLACK },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: NOKAMA_BLACK },
  Pin2L_L: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NOKAMA_BLACK },
  Pin2L_R: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: NOKAMA_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NOKAMA_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NOKAMA_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NOKAMA_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NOKAMA_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: NOKAMA_SOCKET_COLORS },
};

/** Nokama — chest pins from `kit_2003.glb`. */
export const NOKAMA_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Pin3L_L: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: NOKAMA_BLACK },
  Pin3L_R: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: NOKAMA_BLACK },
};
