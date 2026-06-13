import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import type { Kit2003SocketAttachment } from '../nodes/kit2003Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import {
  MATORAN_KIT_PALETTE_ARMS,
  MATORAN_KIT_PALETTE_BLACK,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_FACE,
  MATORAN_KIT_PALETTE_FEET,
  MATORAN_KIT_PALETTE_METAL,
} from '../palettes/matoranKitPlayerPalette';

/**
 * Rebuilt Matoran — sockets filled from `kit_2001.glb`. For other kits, call
 * `useKitAttachments` again with a disjoint socket map (see `REBUILT_KIT_2003_ATTACHMENTS`).
 */
export const REBUILT_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Axle3LB: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: MATORAN_KIT_PALETTE_METAL },
  // Axle3LN: { kitNodeName: KIT_2001_NODES.Axle3L, materialColors: MATORAN_KIT_PALETTE_METAL },
  AxleSpacer: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: MATORAN_KIT_PALETTE_METAL,
  },
  // Brain: { kitNodeName: KIT_2001_NODES.MataBrain, materialColors: MATORAN_KIT_PALETTE_BRAIN },
  Foot_L_1: { kitNodeName: KIT_2001_NODES.MatoranFoot, materialColors: MATORAN_KIT_PALETTE_FEET },
  Foot_R_1: { kitNodeName: KIT_2001_NODES.MatoranFoot, materialColors: MATORAN_KIT_PALETTE_FEET },
  GearM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: MATORAN_KIT_PALETTE_METAL },
  Hand_L_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATORAN_KIT_PALETTE_FEET },
  Hand_R_1: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATORAN_KIT_PALETTE_FEET },
  HipL: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: MATORAN_KIT_PALETTE_BLACK },
  HipR: { kitNodeName: KIT_2001_NODES.Pin2L, materialColors: MATORAN_KIT_PALETTE_BLACK },
  McToranFace: {
    kitNodeName: KIT_2001_NODES.McToranFace,
    materialColors: MATORAN_KIT_PALETTE_FACE,
  },
  Shoulder_L_1: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: MATORAN_KIT_PALETTE_BLACK },
  Shoulder_R_1: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: MATORAN_KIT_PALETTE_BLACK },
  ShoulderSocketL: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATORAN_KIT_PALETTE_ARMS },
  ShoulderSocketR: { kitNodeName: KIT_2001_NODES.Socket, materialColors: MATORAN_KIT_PALETTE_ARMS },
};

/** Rebuilt Matoran — sockets filled from `kit_2003.glb` (Bohrok / torso kit bucket). */
export const REBUILT_KIT_2003_ATTACHMENTS: Record<string, Kit2003SocketAttachment> = {
  Arm_L001: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: MATORAN_KIT_PALETTE_ARMS },
  Arm_R_1: { kitNodeName: KIT_2003_NODES.BohrokArm, materialColors: MATORAN_KIT_PALETTE_ARMS },
  LegL: {
    kitNodeName: KIT_2003_NODES.PerpendicularLiftArm,
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
  LegR: {
    kitNodeName: KIT_2003_NODES.PerpendicularLiftArm,
    materialColors: MATORAN_KIT_PALETTE_FEET,
  },
  MatoranBody: {
    kitNodeName: KIT_2003_NODES.MatoranBody,
    materialColors: MATORAN_KIT_PALETTE_BODY,
  },
  TechnicTorsoPivot: {
    kitNodeName: KIT_2003_NODES.TechnicTorsoPivot,
    materialColors: MATORAN_KIT_PALETTE_BODY,
  },
};
