import type { KitSocketAttachment } from '../../../types/KitParts';
import {
  MATORAN_KIT_PALETTE_ARMS,
  MATORAN_KIT_PALETTE_BLACK,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_FACE,
  MATORAN_KIT_PALETTE_FEET,
  MATORAN_KIT_PALETTE_METAL,
} from '../palettes/matoranKitPlayerPalette';

/**
 * Rebuilt Matoran (2001 kit): keys match socket `nodes` on rebuilt.glb.
 * Replace `kitNodeName` values to match kit_2001.glb piece names.
 */
export const REBUILT_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L001: { kitNodeName: 'BohrokArm', materialColors: MATORAN_KIT_PALETTE_ARMS },
  Arm_R_1: { kitNodeName: 'BohrokArm', materialColors: MATORAN_KIT_PALETTE_ARMS },
  Axle3LB: { kitNodeName: 'Axle3L', materialColors: MATORAN_KIT_PALETTE_METAL },
  // Axle3LN: { kitNodeName: 'Axle3L', materialColors: MATORAN_KIT_PALETTE_METAL },
  AxleSpacer: { kitNodeName: 'AxleSpacer1L', materialColors: MATORAN_KIT_PALETTE_METAL },
  // Brain: { kitNodeName: 'MataBrain', materialColors: MATORAN_KIT_PALETTE_BRAIN },
  Foot_L_1: { kitNodeName: 'MatoranFoot', materialColors: MATORAN_KIT_PALETTE_FEET },
  Foot_R_1: { kitNodeName: 'MatoranFoot', materialColors: MATORAN_KIT_PALETTE_FEET },
  GearM: { kitNodeName: 'GearM', materialColors: MATORAN_KIT_PALETTE_METAL },
  Hand_L_1: { kitNodeName: 'Socket', materialColors: MATORAN_KIT_PALETTE_FEET },
  Hand_R_1: { kitNodeName: 'Socket', materialColors: MATORAN_KIT_PALETTE_FEET },
  HipL: { kitNodeName: 'Pin2L', materialColors: MATORAN_KIT_PALETTE_BLACK },
  HipR: { kitNodeName: 'Pin2L', materialColors: MATORAN_KIT_PALETTE_BLACK },
  LegL: { kitNodeName: 'PerpendicularLiftArm', materialColors: MATORAN_KIT_PALETTE_FEET },
  LegR: { kitNodeName: 'PerpendicularLiftArm', materialColors: MATORAN_KIT_PALETTE_FEET },
  MatoranBody: { kitNodeName: 'MatoranBody', materialColors: MATORAN_KIT_PALETTE_BODY },
  McToranFace: { kitNodeName: 'McToranFace', materialColors: MATORAN_KIT_PALETTE_FACE },
  Shoulder_L_1: { kitNodeName: 'Axle2L', materialColors: MATORAN_KIT_PALETTE_BLACK },
  Shoulder_R_1: { kitNodeName: 'Axle2L', materialColors: MATORAN_KIT_PALETTE_BLACK },
  ShoulderSocketL: { kitNodeName: 'Socket', materialColors: MATORAN_KIT_PALETTE_ARMS },
  ShoulderSocketR: { kitNodeName: 'Socket', materialColors: MATORAN_KIT_PALETTE_ARMS },
  TechnicTorsoPivot: {
    kitNodeName: 'TechnicTorsoPivot',
    materialColors: MATORAN_KIT_PALETTE_BODY,
  },
};
