import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';

/**
 * Vakama sockets on `Toa_Metru/Vakama.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js sanitizes glTF node names at load: spaces → `_`, `.` removed
 * (`AxleMod2L.ShoulderPivot.R` → `AxleMod2L_ShoulderPivotR`).
 *
 * Disk launcher handle and holster share one kit mesh (`VakamaDiskLauncher`);
 * each empty clones the full tool so grips tint from the weapon palette.
 */

const VAKAMA_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const VAKAMA_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const VAKAMA_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const VAKAMA_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const VAKAMA_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...VAKAMA_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const VAKAMA_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...VAKAMA_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const VAKAMA_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...VAKAMA_BODY_COLORS,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const VAKAMA_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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

const VAKAMA_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...VAKAMA_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 10),
};

const VAKAMA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Vakama — sockets filled from `kit_2004.glb`. */
export const VAKAMA_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AxleArm3L_B: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: VAKAMA_BODY_COLORS },
  AxleArm3L_F: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: VAKAMA_BODY_COLORS },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: VAKAMA_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: VAKAMA_ARM_COLORS,
  },
  MetruArm_ArmLowerL: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: VAKAMA_ARM_COLORS },
  MetruArm_ArmLowerR: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: VAKAMA_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: VAKAMA_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: VAKAMA_BODY_COLORS,
  },
  MetruFoot_L: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: VAKAMA_FEET_COLORS },
  MetruFoot_R: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: VAKAMA_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: VAKAMA_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: VAKAMA_HEAD_COLORS },
  MetruHips: { kitNodeName: KIT_2004_NODES.MetruHips, materialColors: VAKAMA_BODY_COLORS },
  MetruLeg_LegLowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: VAKAMA_LEG_COLORS },
  MetruLeg_LegLowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: VAKAMA_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: VAKAMA_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: VAKAMA_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: VAKAMA_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: VAKAMA_ARM_COLORS,
  },
  MetruTorso: { kitNodeName: KIT_2004_NODES.MetruTorso, materialColors: VAKAMA_BODY_COLORS },
  SocketDouble1L_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_ArmUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAKAMA_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAKAMA_SOCKET_COLORS,
  },
  TechnicPinBush_L: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: VAKAMA_BLACK,
  },
  TechnicPinBush_R: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: VAKAMA_BLACK,
  },
  VakamaDiskLauncher: {
    kitNodeName: KIT_2004_NODES.VakamaDiskLauncher,
    materialColors: VAKAMA_WEAPON_COLORS,
  },
  Weapon_Handle: {
    kitNodeName: KIT_2004_NODES.VakamaDiskLauncher,
    materialColors: VAKAMA_WEAPON_COLORS,
  },
};

/** Vakama — Technic pins / axles / sockets from `kit_2001.glb`. */
export const VAKAMA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: VAKAMA_BLACK },
  Axle2L_Neck: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: VAKAMA_AXLE_COLORS },
  Axle3L_Hip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: VAKAMA_AXLE_COLORS },
  Axle3L_Hip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: VAKAMA_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: VAKAMA_AXLE_COLORS },
  AxleConnRidged: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: VAKAMA_BLACK,
  },
  AxleMod2L_L: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: VAKAMA_BODY_COLORS,
  },
  AxleMod2L_ShoulderPivotR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: VAKAMA_BODY_COLORS,
  },
  AxlePin_BL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: VAKAMA_BLACK },
  AxlePin_BR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: VAKAMA_BLACK },
  AxlePin_HandL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: VAKAMA_BLACK },
  AxlePin_HandR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: VAKAMA_BLACK },
  AxleSocket3L_L: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: VAKAMA_SOCKET_COLORS,
  },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: VAKAMA_BLACK },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: VAKAMA_BLACK },
  Pin2L_L: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: VAKAMA_BLACK },
  Pin2L_R: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: VAKAMA_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: VAKAMA_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: VAKAMA_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: VAKAMA_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: VAKAMA_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: VAKAMA_SOCKET_COLORS },
};
