import type { KitSocketAttachment } from '../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import type { Kit2004SocketAttachment } from '../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../nodes/kit2004Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import {
  MATORAN_KIT_PALETTE_BLACK,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_FACE,
  MATORAN_KIT_PALETTE_FEET,
} from '../palettes/matoranKitPlayerPalette';
import { KIT_PALETTE_BRAIN } from '../palettes/brainKitPalette';
import type { RigMaterialTarget } from '../../hooks/useRigMaterials';
import { LegoColor } from '../../../../types/Colors';
import { NUVA_KIT_METAL } from '../palettes/nuvaKitPlayerPalette';

/**
 * Socket keys match **runtime** `Object3D.name` on the loaded rig (after Draco /
 * export). Blender uses `KitName.Bone.Side`, but the loader strips `.` characters
 * — e.g. `MetruMatoranLimbPiston.LegLower.R` → `MetruMatoranLimbPistonLegLowerR`.
 * Do not use dotted Blender/GLB JSON names here.
 */

const METRU_LIMB_PISTON_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Face: { color: { kind: 'part', part: 'arms', slot: 'main' } },
  Main: { color: { kind: 'part', part: 'arms', slot: 'main' } },
  Metal: { color: { kind: 'part', part: 'arms', slot: 'metal' }, ...NUVA_KIT_METAL.Metal },
  Secondary: { kind: 'part', part: 'arms', slot: 'secondary' },
};

const METRU_LIMB_SHIN_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Main: { color: { kind: 'part', part: 'arms', slot: 'main' } },
  Secondary: { kind: 'part', part: 'arms', slot: 'secondary' },
};

const METRU_LEG_PISTON_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Face: { color: { kind: 'part', part: 'legs', slot: 'main' } },
  Main: { color: { kind: 'part', part: 'legs', slot: 'main' } },
  Metal: { color: { kind: 'part', part: 'legs', slot: 'metal' }, ...NUVA_KIT_METAL.Metal },
  Secondary: { kind: 'part', part: 'legs', slot: 'secondary' },
};

const METRU_LEG_SHIN_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Main: { color: { kind: 'part', part: 'legs', slot: 'main' } },
  Secondary: { kind: 'part', part: 'legs', slot: 'secondary' },
};

const PIN_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Metal: { color: { kind: 'lego', value: LegoColor.Blue } },
};

/** Shiny NUVA silver on the launcher — standard PBR, not the Mata weathered pass. */
const DISK_LAUNCHER_METAL = {
  ...NUVA_KIT_METAL.Metal,
  weathered: false as const,
};

/** Metru Matoran rig sockets filled from `kit_2004.glb`. */
export const METRU_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  MetruMatoranLimbPistonArmUpperL: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbPiston,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  MetruMatoranLimbPistonArmUpperR: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbPiston,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  MetruMatoranLimbPistonLegLowerL: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbPiston,
    materialColors: METRU_LEG_PISTON_MATERIAL_COLORS,
  },
  MetruMatoranLimbPistonLegLowerR: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbPiston,
    materialColors: METRU_LEG_PISTON_MATERIAL_COLORS,
  },
  MetruMatoranLimbShinArmLowerL: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbShin,
    materialColors: METRU_LIMB_SHIN_MATERIAL_COLORS,
  },
  MetruMatoranLimbShinArmLowerR: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbShin,
    materialColors: METRU_LIMB_SHIN_MATERIAL_COLORS,
  },
  MetruMatoranLimbShinLegUpperL: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbShin,
    materialColors: METRU_LEG_SHIN_MATERIAL_COLORS,
  },
  MetruMatoranLimbShinLegUpperR: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimbShin,
    materialColors: METRU_LEG_SHIN_MATERIAL_COLORS,
  },
  MetruMatoranTorsoBody: {
    kitNodeName: KIT_2004_NODES.MetruMatoranTorso,
    materialColors: MATORAN_KIT_PALETTE_BODY,
  },
};

/** Disk launcher shell — Great Disk matoran only (from `kit_2004.glb`). */
export const METRU_KIT_2004_DISK_LAUNCHER_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  Disk_LauncherWeapon_Holster: {
    kitNodeName: KIT_2004_NODES.DiskLauncher,
    materialColors: {
      Metal: DISK_LAUNCHER_METAL,
    },
  },
};

export function getMetruKit2004Attachments(
  hasDiskLauncher: boolean
): Record<string, Kit2004SocketAttachment> {
  if (!hasDiskLauncher) return METRU_KIT_2004_ATTACHMENTS;
  return { ...METRU_KIT_2004_ATTACHMENTS, ...METRU_KIT_2004_DISK_LAUNCHER_ATTACHMENTS };
}

/** Technic pins / face / hands from `kit_2001.glb`. */
export const METRU_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  AxleMod2LNeck: {
    kitNodeName: KIT_2001_NODES.AxleMod2L,
    materialColors: MATORAN_KIT_PALETTE_BLACK,
  },
  AxlePinHipL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinHipR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinNeck: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinShoulderL: {
    kitNodeName: KIT_2001_NODES.AxlePin,
    materialColors: PIN_MATERIAL_COLORS,
  },
  AxlePinShoulderR: {
    kitNodeName: KIT_2001_NODES.AxlePin,
    materialColors: PIN_MATERIAL_COLORS,
  },
  AxleSocket1LHead: {
    kitNodeName: KIT_2001_NODES.AxleSocket1L,
    materialColors: MATORAN_KIT_PALETTE_BLACK,
  },
  AxleSpacer1LNeck: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: MATORAN_KIT_PALETTE_BLACK,
  },
  MataBrainHead: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: {
      ...MATORAN_KIT_PALETTE_FACE,
      Brain: KIT_PALETTE_BRAIN.Brain,
    },
  },
  MataFaceHead: {
    kitNodeName: KIT_2001_NODES.MataFace,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  MataGlowingEyesHead: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: { 'Glowing Eyes': MATORAN_KIT_PALETTE_FACE['Glowing Eyes'] },
  },
  SocketHandL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  SocketHandR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  SocketHipL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  SocketHipR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  SocketShoulderL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
  SocketShoulderR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_PISTON_MATERIAL_COLORS,
  },
};

/** Bohrok feet from `kit_2003.glb` (all Metru matoran). */
export const METRU_KIT_2003_FOOT_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Bohrok_FootFootL: {
    kitNodeName: KIT_2003_NODES.BohrokFoot,
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
  Bohrok_FootFootR: {
    kitNodeName: KIT_2003_NODES.BohrokFoot,
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
};

/** Holster technic pin — Great Disk matoran only. */
export const METRU_KIT_2003_HOLSTER_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Pin3LWeapon_Holster: {
    kitNodeName: KIT_2003_NODES.Pin3L,
    materialColors: { Metal: { color: { kind: 'lego', value: LegoColor.Black } } },
  },
};

export function getMetruKit2003Attachments(
  hasDiskLauncher: boolean
): Record<string, KitSocketAttachment> {
  if (!hasDiskLauncher) return METRU_KIT_2003_FOOT_ATTACHMENTS;
  return { ...METRU_KIT_2003_FOOT_ATTACHMENTS, ...METRU_KIT_2003_HOLSTER_ATTACHMENTS };
}

/** Rig meshes tinted in place — all Metru matoran (currently none). */
export const METRU_RIG_MATERIALS_BASE: Record<string, RigMaterialTarget> = {};

export function getMetruRigMaterials(): Record<string, RigMaterialTarget> {
  return METRU_RIG_MATERIALS_BASE;
}
