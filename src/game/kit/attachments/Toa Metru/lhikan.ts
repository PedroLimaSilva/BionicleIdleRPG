import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../../nodes/kit2003Nodes';
import { KIT_2004_NODES } from '../../nodes/kit2004Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';
import { buildKitAttachmentsFromSocketNames } from '../../socketKitPart';

/**
 * Lhikan sockets are `{KitPart}(.{qualifier})*` — `AxleMod2L.ArmUpper.L`
 * clones `AxleMod2L`. Qualifiers are optional (`MetruBrain`).
 *
 * Aliases cover the two names that differ from the kit GLB:
 * `MetruHip` → `MetruHips`, `ArmLower` → `MetruArm`.
 */
export const LHIKAN_KIT_PART_ALIASES: Readonly<Record<string, string>> = {
  ArmLower: KIT_2004_NODES.MetruArm,
  MetruHip: KIT_2004_NODES.MetruHips,
};

/**
 * Kit sockets on `Toa_Metru/Lhikan.glb` (Blender names). Used to document the
 * rig and to seed unused-kit-node tests; the model also scans runtime nodes.
 */
export const LHIKAN_KIT_SOCKET_NAMES = [
  'ArmLower.L',
  'ArmLower.R',
  'Axle2L.Chest',
  'Axle2L.Head',
  'Axle3L.Hip.1',
  'Axle3L.Hip.2',
  'Axle3L.Hip.3',
  'Axle6L.001',
  'AxleArm3L.B',
  'AxleArm3L.F',
  'AxleMod2L.ArmUpper.L',
  'AxleMod2L.ArmUpper.R',
  'AxleSocket3L.L',
  'AxleSocket3L.R',
  'DoubleSocketArmor.L',
  'DoubleSocketArmor.R',
  'GearM.Hip.002',
  'GearM.Shoulder.L',
  'GearM.Shoulder.R',
  'LhikanSword.Weapon.L',
  'LhikanSword.Weapon.R',
  'MetruBrain',
  'MetruChestLid',
  'MetruFoot.Foot.L',
  'MetruFoot.Foot.R',
  'MetruGlowingEyes',
  'MetruHead.Head',
  'MetruHip.Hip',
  'MetruLeg.LegLower.L',
  'MetruLeg.LegLower.R',
  'MetruShoulderArmorBottom.L',
  'MetruShoulderArmorBottom.R',
  'MetruShoulderArmorTop.L',
  'MetruShoulderArmorTop.R',
  'MetruTorso.Chest',
  'Pin2L.Leg.L',
  'Pin2L.Leg.R',
  'Pin3L.Chest.L',
  'Pin3L.Chest.R',
  'Socket.Foot.L',
  'Socket.Foot.R',
  'Socket.Hand.L',
  'Socket.Hand.R',
  'Socket.Neck',
  'SocketDouble1L.ArmUpper.L',
  'SocketDouble1L.ArmUpper.R',
  'SocketDouble1L.LegUpper.L',
  'SocketDouble1L.LegUpper.R',
] as const;

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

const BLACK_KIT_PARTS = new Set<string>([
  KIT_2001_NODES.Axle2L,
  KIT_2001_NODES.Axle3L,
  KIT_2001_NODES.Pin2L,
  KIT_2003_NODES.Pin3L,
]);

export function lhikanMaterialColorsFor(
  kitNodeName: string
): Partial<Record<string, KitMaterialSlotEntry>> {
  if (kitNodeName === KIT_2004_NODES.MetruFoot) return LHIKAN_FEET_COLORS;
  if (kitNodeName === KIT_2004_NODES.MetruArm) return LHIKAN_ARM_COLORS;
  if (kitNodeName === KIT_2004_NODES.MetruHead || kitNodeName === KIT_2004_NODES.MetruBrain) {
    return LHIKAN_HEAD_COLORS;
  }
  if (kitNodeName === KIT_2004_NODES.MetruGlowingEyes) return LHIKAN_EYES_COLORS;
  if (kitNodeName === KIT_2004_NODES.LhikanSword) return LHIKAN_SWORD_COLORS;
  if (BLACK_KIT_PARTS.has(kitNodeName)) return LHIKAN_BLACK;
  return LHIKAN_PALETTE_COLORS;
}

export function buildLhikanKitAttachments(socketNames: readonly string[]) {
  return buildKitAttachmentsFromSocketNames(socketNames, {
    aliases: LHIKAN_KIT_PART_ALIASES,
    materialColorsFor: lhikanMaterialColorsFor,
  });
}

const lhikanAttachments = buildLhikanKitAttachments(LHIKAN_KIT_SOCKET_NAMES);

export const LHIKAN_KIT_2001_ATTACHMENTS = lhikanAttachments.kit2001;
export const LHIKAN_KIT_2003_ATTACHMENTS = lhikanAttachments.kit2003;
export const LHIKAN_KIT_2004_ATTACHMENTS = lhikanAttachments.kit2004;
