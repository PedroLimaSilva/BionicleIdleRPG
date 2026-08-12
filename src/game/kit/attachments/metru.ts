import type { KitSocketAttachment } from '../../../types/KitParts';
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
import type { RigMaterialTarget } from '../../../hooks/useRigMaterials';
import { LegoColor } from '../../../types/Colors';
import { NUVA_KIT_METAL } from '../palettes/nuvaKitPlayerPalette';

/**
 * Socket keys match **runtime** `Object3D.name` on the loaded rig (after Draco /
 * export). Colons and spaces from Blender (`KitPart:Parent_Side`, `Disk Launcher`)
 * are stripped — e.g. `MetruMatoranLimb:Arm_L` → `MetruMatoranLimbArm_L`.
 * Do not use raw GLB JSON names here.
 */

const METRU_LIMB_MATERIAL_COLORS: Kit2004SocketAttachment['materialColors'] = {
  Face: { color: { kind: 'lego', value: LegoColor.DarkGray } },
  Main: { color: { kind: 'lego', value: LegoColor.DarkGray } },
  Metal: NUVA_KIT_METAL.Metal,
  Secondary: MATORAN_KIT_PALETTE_BODY.Main,
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
  MetruMatoranLimbArm_L: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimb,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
  MetruMatoranLimbArm_R: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimb,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
  MetruMatoranLimbLeg_L: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimb,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
  MetruMatoranLimbLeg_R: {
    kitNodeName: KIT_2004_NODES.MetruMatoranLimb,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
};

/** Technic pins / face / hands from `kit_2001.glb`. */
export const METRU_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  AxlePinHip_L: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinHip_R: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinNeck: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: PIN_MATERIAL_COLORS },
  AxlePinShoulder_L: {
    kitNodeName: KIT_2001_NODES.AxlePin,
    materialColors: PIN_MATERIAL_COLORS,
  },
  AxlePinShoulder_R: {
    kitNodeName: KIT_2001_NODES.AxlePin,
    materialColors: PIN_MATERIAL_COLORS,
  },
  MataBrainHead: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: MATORAN_KIT_PALETTE_FACE,
  },
  MataFaceHead: {
    kitNodeName: KIT_2001_NODES.MataFace,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
  MataGlowingEyesHead: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: { 'Glowing Eyes': MATORAN_KIT_PALETTE_FACE['Glowing Eyes'] },
  },
  SocketHand_L: { kitNodeName: KIT_2001_NODES.Socket, materialColors: METRU_LIMB_MATERIAL_COLORS },
  SocketHand_R: { kitNodeName: KIT_2001_NODES.Socket, materialColors: METRU_LIMB_MATERIAL_COLORS },
  SocketHip_L: { kitNodeName: KIT_2001_NODES.Socket, materialColors: METRU_LIMB_MATERIAL_COLORS },
  SocketHip_R: { kitNodeName: KIT_2001_NODES.Socket, materialColors: METRU_LIMB_MATERIAL_COLORS },
  SocketShoulder_L: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
  SocketShoulder_R: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: METRU_LIMB_MATERIAL_COLORS,
  },
};

/** Bohrok feet and holster pin from `kit_2003.glb`. */
export const METRU_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Bohrok_FootL: {
    kitNodeName: 'Bohrok_Foot',
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
  Bohrok_FootR: {
    kitNodeName: 'Bohrok_Foot',
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
  Pin3LWeapon_Holster: {
    kitNodeName: KIT_2003_NODES.Pin3L,
    materialColors: { Metal: { color: { kind: 'lego', value: LegoColor.Black } } },
  },
};

/**
 * Meshes baked into `matoran_metru.glb` under kit-style socket names.
 * These are tinted in place — no kit clone is inserted.
 */
export const METRU_RIG_MATERIALS: Record<string, RigMaterialTarget> = {
  Disk_Launcher: {
    materialColors: {
      Metal: DISK_LAUNCHER_METAL,
    },
  },
  MetruMatoranTorsoBody: {
    materialColors: {
      Torso: MATORAN_KIT_PALETTE_BODY.Main,
    },
  },
  PerpendicularAxleJoint2L: {
    materialColors: {
      'SOLID-BLACK': MATORAN_KIT_PALETTE_BLACK.Solid_Black,
    },
  },
};
