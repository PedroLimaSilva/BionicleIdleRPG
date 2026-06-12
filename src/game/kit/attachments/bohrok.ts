import { LegoColor } from '../../../types/Colors';
import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import type { Kit2003SocketAttachment } from '../nodes/kit2003Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import {
  BOHROK_KIT_PALETTE_ARMS,
  BOHROK_KIT_PALETTE_BODY,
  BOHROK_KIT_PALETTE_EYE,
  BOHROK_KIT_PALETTE_METAL,
  BOHROK_KIT_PALETTE_TEETH,
  BOHROK_KIT_PALETTE_SOCKETS,
  BOHROK_KIT_PALETTE_FEET,
  BOHROK_KAL_FACEPLATE_PALETTE,
  BOHROK_SWARM_FACEPLATE_PALETTE,
} from '../palettes/bohrokKitPalette';

/**
 * Bohrok rig sockets on `bohrok_master.glb` filled from `kit_2001.glb` (pins / axles).
 * Duplicate socket names resolve to the deepest node when building the kit node map.
 */
export const BOHROK_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle3L1: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3L2: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3L3: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3LHeadB: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3LHeadF: {
    kitNodeName: KIT_2001_NODES.Axle3L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle5L: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle6LB: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle6LT: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  HandL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  HandR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Hip_L_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Hip_R_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Shoulder_L_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Shoulder_R_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: BOHROK_KIT_PALETTE_SOCKETS },
};

/**
 * Bohrok shells and limbs from `kit_2003.glb`. Faceplate slot overrides are merged at
 * runtime in `BohrokModel` (swarm vs Kal silver).
 */
export const BOHROK_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Arm_L_1: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: BOHROK_KIT_PALETTE_ARMS },
  Arm_R_1: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: BOHROK_KIT_PALETTE_ARMS },
  Bohrok_BodyL: { kitNodeName: KIT_2003_NODES.BohrokBody, materialColors: BOHROK_KIT_PALETTE_BODY },
  Bohrok_BodyR: { kitNodeName: KIT_2003_NODES.BohrokBody, materialColors: BOHROK_KIT_PALETTE_BODY },
  Bohrok_EyeL: { kitNodeName: KIT_2003_NODES.BohrokEye, materialColors: BOHROK_KIT_PALETTE_EYE },
  Bohrok_EyeR: { kitNodeName: KIT_2003_NODES.BohrokEye, materialColors: BOHROK_KIT_PALETTE_EYE },
  Bohrok_HeadL: {
    kitNodeName: KIT_2003_NODES.BohrokHead,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Bohrok_HeadR: {
    kitNodeName: KIT_2003_NODES.BohrokHead,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Bohrok_Lever: { kitNodeName: KIT_2003_NODES.BohrokLever, materialColors: BOHROK_KIT_PALETTE_METAL },
  Bohrok_TeethL: { kitNodeName: KIT_2003_NODES.BohrokTeeth, materialColors: BOHROK_KIT_PALETTE_TEETH },
  Bohrok_TeethR: { kitNodeName: KIT_2003_NODES.BohrokTeeth, materialColors: BOHROK_KIT_PALETTE_TEETH },
  Foot_L_1: { kitNodeName: KIT_2003_NODES.BohrokFoot, materialColors: BOHROK_KIT_PALETTE_FEET },
  Foot_R_1: { kitNodeName: KIT_2003_NODES.BohrokFoot, materialColors: BOHROK_KIT_PALETTE_FEET },
  Leg_L_1: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: BOHROK_KIT_PALETTE_ARMS },
  Leg_R_1: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: BOHROK_KIT_PALETTE_ARMS },
  NeckB: { kitNodeName: KIT_2003_NODES.BohrokNeck, materialColors: BOHROK_KIT_PALETTE_METAL },
  NeckF: { kitNodeName: KIT_2003_NODES.BohrokNeck, materialColors: BOHROK_KIT_PALETTE_METAL },
  Pin3L: { kitNodeName: KIT_2003_NODES.Pin3L, materialColors: BOHROK_KIT_PALETTE_METAL },
};

/** Faceplate palette depends on Kal vs swarm; merged in `BohrokModel` via `buildBohrokKit2003Attachments`. */
export const BOHROK_FACEPLATE_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Face_Plate_1: {
    kitNodeName: KIT_2003_NODES.FacePlate,
    materialColors: BOHROK_SWARM_FACEPLATE_PALETTE,
  },
};

export function buildBohrokKit2003Attachments(isKal: boolean): Record<string, Kit2003SocketAttachment> {
  const faceplateColors = isKal ? BOHROK_KAL_FACEPLATE_PALETTE : BOHROK_SWARM_FACEPLATE_PALETTE;
  return {
    ...BOHROK_KIT_2003_ATTACHMENTS,
    Face_Plate_1: {
      kitNodeName: KIT_2003_NODES.FacePlate,
      materialColors: faceplateColors,
    },
  };
}
