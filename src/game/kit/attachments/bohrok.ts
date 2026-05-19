import { LegoColor } from '../../../types/Colors';
import type { KitSocketAttachment } from '../../../types/KitParts';
import {
  BOHROK_KIT_PALETTE_ARMS,
  BOHROK_KIT_PALETTE_BODY,
  BOHROK_KIT_PALETTE_EYE,
  BOHROK_KIT_PALETTE_METAL,
  BOHROK_KIT_PALETTE_TEETH,
  BOHROK_KIT_PALETTE_SOCKETS,
  BOHROK_KIT_PALETTE_FEET,
} from '../palettes/bohrokKitPalette';

/**
 * Bohrok rig sockets on `bohrok_master.glb` filled from `kit_2001.glb` (pins / axles).
 * Duplicate socket names resolve to the deepest node when building the kit node map.
 */
export const BOHROK_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle3L1: { kitNodeName: 'Axle3L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3L2: { kitNodeName: 'Axle3L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3L3: { kitNodeName: 'Axle3L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle3LHeadB: {
    kitNodeName: 'Axle3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle3LHeadF: {
    kitNodeName: 'Axle3L',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Axle5L: { kitNodeName: 'Axle3L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle6LB: { kitNodeName: 'Axle6L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Axle6LT: { kitNodeName: 'Axle6L', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  HandL: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  HandR: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Hip_L_1: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Hip_R_1: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Shoulder_L_1: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
  Shoulder_R_1: { kitNodeName: 'Socket', materialColors: BOHROK_KIT_PALETTE_SOCKETS },
};

/**
 * Bohrok shells and limbs from `kit_2003.glb`. Faceplate slot overrides are merged at
 * runtime in `BohrokModel` (swarm vs Kal silver).
 */
export const BOHROK_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L_1: { kitNodeName: 'BohrokArm', materialColors: BOHROK_KIT_PALETTE_ARMS },
  Arm_R_1: { kitNodeName: 'BohrokArm', materialColors: BOHROK_KIT_PALETTE_ARMS },
  Bohrok_BodyL: { kitNodeName: 'Bohrok_Body', materialColors: BOHROK_KIT_PALETTE_BODY },
  Bohrok_BodyR: { kitNodeName: 'Bohrok_Body', materialColors: BOHROK_KIT_PALETTE_BODY },
  Bohrok_EyeL: { kitNodeName: 'Bohrok_Eye', materialColors: BOHROK_KIT_PALETTE_EYE },
  Bohrok_EyeR: { kitNodeName: 'Bohrok_Eye', materialColors: BOHROK_KIT_PALETTE_EYE },
  Bohrok_HeadL: {
    kitNodeName: 'Bohrok_Head',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Bohrok_HeadR: {
    kitNodeName: 'Bohrok_Head',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Bohrok_Lever: { kitNodeName: 'Bohrok_Lever', materialColors: BOHROK_KIT_PALETTE_METAL },
  Bohrok_TeethL: { kitNodeName: 'Bohrok_Teeth', materialColors: BOHROK_KIT_PALETTE_TEETH },
  Bohrok_TeethR: { kitNodeName: 'Bohrok_Teeth', materialColors: BOHROK_KIT_PALETTE_TEETH },
  Foot_L_1: { kitNodeName: 'Bohrok_Foot', materialColors: BOHROK_KIT_PALETTE_FEET },
  Foot_R_1: { kitNodeName: 'Bohrok_Foot', materialColors: BOHROK_KIT_PALETTE_FEET },
  Leg_L_1: { kitNodeName: 'BohrokArm', materialColors: BOHROK_KIT_PALETTE_ARMS },
  Leg_R_1: { kitNodeName: 'BohrokArm', materialColors: BOHROK_KIT_PALETTE_ARMS },
  NeckB: { kitNodeName: 'Bohrok_Neck', materialColors: BOHROK_KIT_PALETTE_METAL },
  NeckF: { kitNodeName: 'Bohrok_Neck', materialColors: BOHROK_KIT_PALETTE_METAL },
  Pin3L: { kitNodeName: 'Pin3L', materialColors: BOHROK_KIT_PALETTE_METAL },
};
