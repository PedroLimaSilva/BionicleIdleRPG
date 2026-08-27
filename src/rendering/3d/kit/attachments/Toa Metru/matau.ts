import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from '../../palettes/mataKitPlayerPalette';
import { kitPartGlow, kitPartSlots } from '../../palettes/partSlots';

/**
 * Matau sockets on `Toa_Metru/Matau.glb` are `{KitPart}_{qualifier}`.
 * The token before the first `_` is the kit node; the rest is optional.
 * Three.js strips `.` at runtime: `AxleMod2L_ArmUpper.L` → `AxleMod2L_ArmUpperL`.
 *
 * Aero Slicer wings and handles share one kit mesh (`AeroSlicer`); each empty
 * clones the full tool so wings and grips tint from the weapon palette.
 */

const MATAU_BODY_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('body', 'nuva'),
};

const MATAU_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('feet', 'nuva'),
};

const MATAU_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('arms', 'nuva'),
};

const MATAU_LEG_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...kitPartSlots('legs', 'nuva'),
};

const MATAU_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATAU_BODY_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const MATAU_SOCKET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATAU_BODY_COLORS,
  Main: { key: 'face', kind: 'palette' },
  'Solid_Black.002': { key: 'face', kind: 'palette' },
};

const MATAU_AXLE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATAU_BODY_COLORS,
  Solid_Black: { kind: 'lego', value: LegoColor.LightGray },
};

const MATAU_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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

const MATAU_WEAPON_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATAU_BODY_COLORS,
  ...kitPartSlots('weapon', 'nuva'),
  ...kitPartGlow('weapon', 5),
};

const MATAU_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Matau — sockets filled from `kit_2004.glb`. */
export const MATAU_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  AeroSlicer_WeaponHandleL: {
    kitNodeName: KIT_2004_NODES.AeroSlicer,
    materialColors: MATAU_WEAPON_COLORS,
  },
  AeroSlicer_WeaponHandleR: {
    kitNodeName: KIT_2004_NODES.AeroSlicer,
    materialColors: MATAU_WEAPON_COLORS,
  },
  AeroSlicer_WingL: { kitNodeName: KIT_2004_NODES.AeroSlicer, materialColors: MATAU_WEAPON_COLORS },
  AeroSlicer_WingR: { kitNodeName: KIT_2004_NODES.AeroSlicer, materialColors: MATAU_WEAPON_COLORS },
  AxleArm3L_B: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: MATAU_BODY_COLORS },
  AxleArm3L_F: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: MATAU_BODY_COLORS },
  DoubleSocketArmor_L: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: MATAU_ARM_COLORS,
  },
  DoubleSocketArmor_R: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: MATAU_ARM_COLORS,
  },
  MetruArm_ArmLowerL: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: MATAU_ARM_COLORS },
  MetruArm_ArmLowerR: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: MATAU_ARM_COLORS },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: MATAU_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: MATAU_BODY_COLORS,
  },
  MetruFoot_FootL: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: MATAU_FEET_COLORS },
  MetruFoot_FootR: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: MATAU_FEET_COLORS },
  MetruGlowingEyes001: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: MATAU_EYES_COLORS,
  },
  MetruHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: MATAU_HEAD_COLORS },
  MetruHips_Hip: {
    kitNodeName: KIT_2004_NODES.MetruHips,
    materialColors: MATAU_BODY_COLORS,
  },
  MetruLeg_LegLowerL: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: MATAU_LEG_COLORS },
  MetruLeg_LegLowerR: { kitNodeName: KIT_2004_NODES.MetruLeg, materialColors: MATAU_LEG_COLORS },
  MetruShoulderArmorBottom_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: MATAU_ARM_COLORS,
  },
  MetruShoulderArmorBottom_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: MATAU_ARM_COLORS,
  },
  MetruShoulderArmorTop_L: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: MATAU_ARM_COLORS,
  },
  MetruShoulderArmorTop_R: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: MATAU_ARM_COLORS,
  },
  MetruTorso_Torso: {
    kitNodeName: KIT_2004_NODES.MetruTorso,
    materialColors: MATAU_BODY_COLORS,
  },
  SocketDouble1L_LegUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  SocketDouble1L_LegUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  SocketDoubleL_ArmL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  SocketDoubleL_ArmR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  TechnicPinBush_L: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: MATAU_BLACK,
  },
  TechnicPinBush_R: {
    kitNodeName: KIT_2004_NODES.TechnicPinBush,
    materialColors: MATAU_BLACK,
  },
};

/** Matau — Technic pins / axles / sockets from `kit_2001.glb`. */
export const MATAU_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: MATAU_BLACK },
  Axle2L_Neck: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: MATAU_AXLE_COLORS },
  Axle3L_1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: MATAU_AXLE_COLORS },
  Axle3L_2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: MATAU_AXLE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: MATAU_AXLE_COLORS },
  AxleConnRidged: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: MATAU_BLACK,
  },
  AxleMod2L_ArmUpperL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: MATAU_BODY_COLORS,
  },
  AxleMod2L_ArmUpperR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: MATAU_BODY_COLORS,
  },
  AxlePin_WingL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: MATAU_BLACK },
  AxlePin_WingR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: MATAU_BLACK },
  AxleSocket3L_L: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  AxleSocket3L_R: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: MATAU_SOCKET_COLORS,
  },
  GearM_ShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: MATAU_BLACK },
  GearM_ShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: MATAU_BLACK },
  Pin2L_L: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: MATAU_BLACK },
  Pin2L_R: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: MATAU_BLACK },
  Socket_FootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATAU_SOCKET_COLORS },
  Socket_FootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATAU_SOCKET_COLORS },
  Socket_HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATAU_SOCKET_COLORS },
  Socket_HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATAU_SOCKET_COLORS },
  Socket_Neck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATAU_SOCKET_COLORS },
};
