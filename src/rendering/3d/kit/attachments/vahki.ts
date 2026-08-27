import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import type { Kit2003SocketAttachment } from '../nodes/kit2003Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import type { Kit2004SocketAttachment } from '../nodes/kit2004Nodes';
import { KIT_2004_NODES } from '../nodes/kit2004Nodes';
import {
  VAHKI_KIT_PALETTE_ARMS,
  VAHKI_KIT_PALETTE_BLACK,
  VAHKI_KIT_PALETTE_BODY,
  VAHKI_KIT_PALETTE_EYES,
  VAHKI_KIT_PALETTE_FEET,
  VAHKI_KIT_PALETTE_HOOD,
  VAHKI_KIT_PALETTE_LEGS,
  VAHKI_KIT_PALETTE_SOCKET,
  VAHKI_KIT_PALETTE_WEAPON,
} from '../palettes/vahkiKitPalette';

/**
 * `Vahki.glb` sockets are kit node names (Three.js-sanitized: `.` stripped, spaces
 * to `_`). Duplicate kit pieces on the head use a `_Head` suffix. Staff mounts are
 * `Tool_L` / `Tool_R` — the only hive tool in `kit_2004.glb` so far is Bordakh's.
 * `TechnicTorsoPivot` is the kit_2003 piece named on the rig.
 */

const VAHKI_HEAD_COLORS = {
  ...VAHKI_KIT_PALETTE_BODY,
  ...VAHKI_KIT_PALETTE_EYES,
};

/** Vahki-specific shells, visor, launcher, legs, and Bordakh staffs from `kit_2004.glb`. */
export const VAHKI_KIT_2004_ATTACHMENTS: Record<string, Kit2004SocketAttachment> = {
  SocketDouble1L_L: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAHKI_KIT_PALETTE_SOCKET,
  },
  SocketDouble1L_R: {
    kitNodeName: KIT_2004_NODES.SocketDouble1L,
    materialColors: VAHKI_KIT_PALETTE_SOCKET,
  },
  Tool_L: {
    kitNodeName: KIT_2004_NODES.BordakhTool,
    materialColors: VAHKI_KIT_PALETTE_WEAPON,
  },
  Tool_R: {
    kitNodeName: KIT_2004_NODES.BordakhTool,
    materialColors: VAHKI_KIT_PALETTE_WEAPON,
  },
  VahkiGlowingEyes: {
    kitNodeName: KIT_2004_NODES.VahkiGlowingEyes,
    materialColors: VAHKI_KIT_PALETTE_EYES,
  },
  VahkiHead: {
    kitNodeName: KIT_2004_NODES.VahkiHead,
    materialColors: VAHKI_HEAD_COLORS,
  },
  VahkiHip: {
    kitNodeName: KIT_2004_NODES.VahkiHip,
    materialColors: VAHKI_KIT_PALETTE_BODY,
  },
  VahkiHood: {
    kitNodeName: KIT_2004_NODES.VahkiHoodBaked,
    materialColors: VAHKI_KIT_PALETTE_HOOD,
  },
  VahkiLauncher: {
    kitNodeName: KIT_2004_NODES.VahkiLauncher,
    materialColors: VAHKI_KIT_PALETTE_BODY,
  },
  VahkiLeg_LowerL: {
    kitNodeName: KIT_2004_NODES.VahkiLeg,
    materialColors: VAHKI_KIT_PALETTE_LEGS,
  },
  VahkiLeg_LowerR: {
    kitNodeName: KIT_2004_NODES.VahkiLeg,
    materialColors: VAHKI_KIT_PALETTE_LEGS,
  },
  VahkiSpine: {
    kitNodeName: KIT_2004_NODES.VahkiSpine,
    materialColors: VAHKI_KIT_PALETTE_BODY,
  },
};

/** 2003-era technic torso pivot — socket name matches `kit_2003.glb`. */
export const VAHKI_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  TechnicTorsoPivot: {
    kitNodeName: KIT_2003_NODES.TechnicTorsoPivot,
    materialColors: VAHKI_KIT_PALETTE_BODY,
  },
};

/** Mata limbs and technic pins from `kit_2001.glb`. */
export const VAHKI_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2L: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  Axle2L_Head: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  Axle3L_B: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  Axle3L_Hip: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  AxlePin: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: VAHKI_KIT_PALETTE_BLACK },
  GearM_B: { kitNodeName: KIT_2001_NODES.GearM, materialColors: VAHKI_KIT_PALETTE_BLACK },
  GearM_F: { kitNodeName: KIT_2001_NODES.GearM, materialColors: VAHKI_KIT_PALETTE_BLACK },
  MataFoot_L: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: VAHKI_KIT_PALETTE_FEET },
  MataFoot_R: { kitNodeName: KIT_2001_NODES.MataFoot, materialColors: VAHKI_KIT_PALETTE_FEET },
  MataSingleArmHand_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmHand_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmLower_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmLower_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonLowerL_L_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonLowerL_L_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonLowerL_R_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonLowerL_R_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonUpperL_L_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonUpperL_L_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonUpperL_R_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmPistonUpperL_R_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmUpper_L: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  MataSingleArmUpper_R: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: VAHKI_KIT_PALETTE_ARMS,
  },
  Pin2L_Head_B: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  Pin2L_Head_F: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: VAHKI_KIT_PALETTE_BLACK },
  Socket_ShoulderL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: VAHKI_KIT_PALETTE_SOCKET,
  },
  Socket_ShoulderR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: VAHKI_KIT_PALETTE_SOCKET,
  },
};
