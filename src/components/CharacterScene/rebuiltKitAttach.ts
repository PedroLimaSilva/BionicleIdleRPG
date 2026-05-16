import type { KitSocketAttachment } from '../../types/KitParts';
import {
  REBUILT_KIT_PALETTE_ARMS,
  REBUILT_KIT_PALETTE_BLACK,
  REBUILT_KIT_PALETTE_BODY,
  REBUILT_KIT_PALETTE_BRAIN,
  REBUILT_KIT_PALETTE_FACE,
  REBUILT_KIT_PALETTE_FEET,
  REBUILT_KIT_PALETTE_GLOW,
  REBUILT_KIT_PALETTE_METAL,
} from '../../game/rebuiltKitPlayerPalette';

/**
 * Rebuilt Matoran (2001 kit): keys match socket `nodes` on rebuilt.glb.
 * Replace `kitNodeName` values to match kit_2001.glb piece names.
 */
export const REBUILT_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L001: { kitNodeName: 'BohrokArm', materialColors: REBUILT_KIT_PALETTE_ARMS },
  Arm_R_1: { kitNodeName: 'BohrokArm', materialColors: REBUILT_KIT_PALETTE_ARMS },
  Axle3LB: { kitNodeName: 'Axle3L', materialColors: REBUILT_KIT_PALETTE_METAL },
  Axle3LN: { kitNodeName: 'Axle3L', materialColors: REBUILT_KIT_PALETTE_METAL },
  AxleSpacer: { kitNodeName: 'AxleSpacer1L', materialColors: REBUILT_KIT_PALETTE_METAL },
  Brain: { kitNodeName: 'MataBrain', materialColors: REBUILT_KIT_PALETTE_BRAIN },
  Foot_L_1: { kitNodeName: 'MatoranFoot', materialColors: REBUILT_KIT_PALETTE_FEET },
  Foot_R_1: { kitNodeName: 'MatoranFoot', materialColors: REBUILT_KIT_PALETTE_FEET },
  GearM: { kitNodeName: 'GearM', materialColors: REBUILT_KIT_PALETTE_METAL },
  GlowingEyes: { kitNodeName: 'MataGlowingEyes', materialColors: REBUILT_KIT_PALETTE_GLOW },
  Hand_L_1: { kitNodeName: 'Socket', materialColors: REBUILT_KIT_PALETTE_FEET },
  Hand_R_1: { kitNodeName: 'Socket', materialColors: REBUILT_KIT_PALETTE_FEET },
  HipL: { kitNodeName: 'Pin2L', materialColors: REBUILT_KIT_PALETTE_BLACK },
  HipR: { kitNodeName: 'Pin2L', materialColors: REBUILT_KIT_PALETTE_BLACK },
  LegL: { kitNodeName: 'PerpendicularLiftArm', materialColors: REBUILT_KIT_PALETTE_FEET },
  LegR: { kitNodeName: 'PerpendicularLiftArm', materialColors: REBUILT_KIT_PALETTE_FEET },
  MataFace: { kitNodeName: 'MataFace', materialColors: REBUILT_KIT_PALETTE_FACE },
  MatoranBody: { kitNodeName: 'MatoranBody', materialColors: REBUILT_KIT_PALETTE_BODY },
  Shoulder_L_1: { kitNodeName: 'Axle2L', materialColors: REBUILT_KIT_PALETTE_BLACK },
  Shoulder_R_1: { kitNodeName: 'Axle2L', materialColors: REBUILT_KIT_PALETTE_BLACK },
  ShoulderSocketL: { kitNodeName: 'Socket', materialColors: REBUILT_KIT_PALETTE_ARMS },
  ShoulderSocketR: { kitNodeName: 'Socket', materialColors: REBUILT_KIT_PALETTE_ARMS },
  TechnicTorsoPivot: {
    kitNodeName: 'TechnicTorsoPivot',
    materialColors: REBUILT_KIT_PALETTE_BODY,
  },
};
