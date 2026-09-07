import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import type { Kit2003SocketAttachment } from '../nodes/kit2003Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import {
  RAHKSHI_KIT_PALETTE_BLACK,
  RAHKSHI_KIT_PALETTE_CHASSIS,
  RAHKSHI_KIT_PALETTE_FEET,
  RAHKSHI_KIT_PALETTE_HEAD_SOCKET,
  RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  RAHKSHI_KIT_PALETTE_METAL,
  RAHKSHI_KIT_PALETTE_PISTON_N,
  RAHKSHI_KIT_PALETTE_SPINE_SOCKET,
  RAHKSHI_KIT_PALETTE_TAN,
} from '../palettes/rahkshiKitPalette';

/**
 * `rahkshi.glb` sockets are `{KitPart}_{qualifier}` (same contract as Toa Metru).
 * The token before the first `_` is the kit node; concatenated L/R suffixes also
 * infer (`Axle2LL` → `Axle2L`). Bones use `Name.Side`; Three.js strips `.`
 * (`Foot.L` → `FootL`, `Guurahk.L` → `GuurahkL`). Unique head, spine, shoulders,
 * kraata cradle, and staff variants stay baked on the rig.
 */
export const RAHKSHI_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle2_LKL: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle2L_B: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle2L_F: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle2L_KR: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle2LL: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle2LR: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle3L_B: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  Axle3L_H: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: RAHKSHI_KIT_PALETTE_BLACK },
  AxleConnRidged_B: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  AxleConnRidged_SL: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: RAHKSHI_KIT_PALETTE_METAL,
  },
  AxleConnRidged_SR: {
    kitNodeName: KIT_2001_NODES.AxleConnRidged,
    materialColors: RAHKSHI_KIT_PALETTE_METAL,
  },
  AxlePin_KL: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: RAHKSHI_KIT_PALETTE_TAN },
  AxlePin_KR: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: RAHKSHI_KIT_PALETTE_TAN },
  AxlePin_T: { kitNodeName: KIT_2001_NODES.AxlePin, materialColors: RAHKSHI_KIT_PALETTE_TAN },
  GearM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: RAHKSHI_KIT_PALETTE_METAL },
  Socket_FL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_FR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_Head: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_HEAD_SOCKET,
  },
  Socket_HipL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_HipR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_HR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_KL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_KR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  Socket_SL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_SPINE_SOCKET,
  },
  Socket_SR: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_SPINE_SOCKET,
  },
  SocketHL: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  },
  TechnicArmJoint_L: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  TechnicArmJoint_R: {
    kitNodeName: KIT_2001_NODES.TechnicArmJoint,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  TechnicArmMain_L: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  TechnicArmMain_R: {
    kitNodeName: KIT_2001_NODES.TechnicArmMain,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  TechnicArmPistonN_L: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: RAHKSHI_KIT_PALETTE_PISTON_N,
  },
  TechnicArmPistonN_R: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonN,
    materialColors: RAHKSHI_KIT_PALETTE_PISTON_N,
  },
  TechnicArmPistonT_L: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: RAHKSHI_KIT_PALETTE_BLACK,
  },
  TechnicArmPistonT_R: {
    kitNodeName: KIT_2001_NODES.TechnicArmPistonT,
    materialColors: RAHKSHI_KIT_PALETTE_BLACK,
  },
};

/** Rahkshi torso, feet, and legs from `kit_2003.glb`. */
export const RAHKSHI_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  RahkshiBody: {
    kitNodeName: KIT_2003_NODES.RahkshiBody,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  RahkshiFoot_L: {
    kitNodeName: KIT_2003_NODES.RahkshiFoot,
    materialColors: RAHKSHI_KIT_PALETTE_FEET,
  },
  RahkshiFoot_R: {
    kitNodeName: KIT_2003_NODES.RahkshiFoot,
    materialColors: RAHKSHI_KIT_PALETTE_FEET,
  },
  RahkshiLeg_L: {
    kitNodeName: KIT_2003_NODES.RahkshiLeg,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  RahkshiLeg_R: {
    kitNodeName: KIT_2003_NODES.RahkshiLeg,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  RahkshiLimb_L: {
    kitNodeName: KIT_2003_NODES.RahkshiLimb,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
  RahkshiLimb_R: {
    kitNodeName: KIT_2003_NODES.RahkshiLimb,
    materialColors: RAHKSHI_KIT_PALETTE_CHASSIS,
  },
};
