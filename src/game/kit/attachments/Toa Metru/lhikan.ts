import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import type { Kit2003SocketAttachment } from '../../nodes/kit2003Nodes';
import type { Kit2004SocketAttachment } from '../../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

/**
 * Lhikan sockets on `Toa_Metru/Lhikan.glb` are `{KitPart}(.{qualifier})*`.
 * The token before the first `.` is the kit node; the rest is optional.
 * Three.js strips `.` at runtime: `AxleMod2L.ArmUpper.L` → `AxleMod2LArmUpperL`.
 *
 * Exceptions: `ArmLower.L` / `R` (duplicate empties `ArmLowerL_1` / `R_1`) clone
 * `MetruArm`; `MetruHip.Hip` clones kit `MetruHips`; `LhikanSword` clones
 * `Lhikan_Sword`.
 */

const LHIKAN_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const LHIKAN_FEET_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LHIKAN_PALETTE_COLORS,
  Main: { key: 'feet', kind: 'palette' },
};

const LHIKAN_ARM_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LHIKAN_PALETTE_COLORS,
  Main: { key: 'arms', kind: 'palette' },
};

const LHIKAN_HEAD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LHIKAN_PALETTE_COLORS,
  Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
  Main: { key: 'face', kind: 'palette' },
};

const LHIKAN_EYES_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
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

const LHIKAN_SWORD_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...LHIKAN_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(10),
  Main: { color: { kind: 'lego', value: LegoColor.FlatDarkGold } },
};

const LHIKAN_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
  Metal: { kind: 'lego', value: LegoColor.Black },
};

/** Lhikan — sockets filled from `kit_2004.glb`. */
export const LHIKAN_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  ArmLowerL_1: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: LHIKAN_ARM_COLORS },
  ArmLowerR_1: { kitNodeName: KIT_2004_NODES.MetruArm, materialColors: LHIKAN_ARM_COLORS },
  AxleArm3LB: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: LHIKAN_PALETTE_COLORS },
  AxleArm3LF: { kitNodeName: KIT_2004_NODES.AxleArm3L, materialColors: LHIKAN_PALETTE_COLORS },
  DoubleSocketArmorL: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  DoubleSocketArmorR: {
    kitNodeName: KIT_2004_NODES.DoubleSocketArmor,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  LhikanSwordWeaponL: {
    kitNodeName: KIT_2004_NODES.LhikanSword,
    materialColors: LHIKAN_SWORD_COLORS,
  },
  LhikanSwordWeaponR: {
    kitNodeName: KIT_2004_NODES.LhikanSword,
    materialColors: LHIKAN_SWORD_COLORS,
  },
  MetruBrain: { kitNodeName: KIT_2004_NODES.MetruBrain, materialColors: LHIKAN_HEAD_COLORS },
  MetruChestLid: {
    kitNodeName: KIT_2004_NODES.MetruChestLid,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruFootFootL: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: LHIKAN_FEET_COLORS },
  MetruFootFootR: { kitNodeName: KIT_2004_NODES.MetruFoot, materialColors: LHIKAN_FEET_COLORS },
  MetruGlowingEyes: {
    kitNodeName: KIT_2004_NODES.MetruGlowingEyes,
    materialColors: LHIKAN_EYES_COLORS,
  },
  MetruHeadHead: { kitNodeName: KIT_2004_NODES.MetruHead, materialColors: LHIKAN_HEAD_COLORS },
  MetruHipHip: { kitNodeName: KIT_2004_NODES.MetruHips, materialColors: LHIKAN_PALETTE_COLORS },
  MetruLegLegLowerL: {
    kitNodeName: KIT_2004_NODES.MetruLeg,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruLegLegLowerR: {
    kitNodeName: KIT_2004_NODES.MetruLeg,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruShoulderArmorBottomL: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruShoulderArmorBottomR: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorBottom,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruShoulderArmorTopL: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruShoulderArmorTopR: {
    kitNodeName: KIT_2004_NODES.MetruShoulderArmorTop,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  MetruTorsoChest: {
    kitNodeName: KIT_2004_NODES.MetruTorso,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  SocketDouble1LArmUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  SocketDouble1LArmUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  SocketDouble1LLegUpperL: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  SocketDouble1LLegUpperR: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
};

/** Lhikan — Technic pins / axles / sockets from `kit_2001.glb`. */
export const LHIKAN_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2LChest: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: LHIKAN_BLACK },
  Axle2LHead: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: LHIKAN_BLACK },
  Axle3LHip1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: LHIKAN_BLACK },
  Axle3LHip2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: LHIKAN_BLACK },
  Axle3LHip3: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: LHIKAN_BLACK },
  Axle6L001: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: LHIKAN_PALETTE_COLORS },
  AxleMod2LArmUpperL: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  AxleMod2LArmUpperR: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  AxleSocket3LL: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  AxleSocket3LR: {
    kitNodeName: KIT_2001_NODES.AxleSocket3L,
    materialColors: LHIKAN_PALETTE_COLORS,
  },
  GearMHip002: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LHIKAN_PALETTE_COLORS },
  GearMShoulderL: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LHIKAN_PALETTE_COLORS },
  GearMShoulderR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: LHIKAN_PALETTE_COLORS },
  Pin2LLegL: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: LHIKAN_BLACK },
  Pin2LLegR: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: LHIKAN_BLACK },
  SocketFootL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LHIKAN_PALETTE_COLORS },
  SocketFootR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LHIKAN_PALETTE_COLORS },
  SocketHandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LHIKAN_PALETTE_COLORS },
  SocketHandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LHIKAN_PALETTE_COLORS },
  SocketNeck: { kitNodeName: KIT_2001_NODES.Socket, materialColors: LHIKAN_PALETTE_COLORS },
};

/** Lhikan — chest pins from `kit_2003.glb`. */
export const LHIKAN_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Pin3LChestL: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: LHIKAN_BLACK },
  Pin3LChestR: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: LHIKAN_BLACK },
};
