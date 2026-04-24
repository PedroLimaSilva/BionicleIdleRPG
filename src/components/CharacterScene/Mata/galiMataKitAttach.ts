import { LegoColor } from '../../../types/Colors';
import type { KitSocketAttachment } from '../../../types/KitParts';

/**
 * Gali Mata (2001 kit): socket name on rig → kit node + per-material overrides.
 * Emissive / glow: set `emissive` + `emissiveIntensity` on a material slot (LegoColor or palette keys).
 */
export const GALI_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Arm_L_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: {
      Main: {
        kind: 'lego',
        value: LegoColor.Blue,
      },
    },
  },
  Arm_L_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_L_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_L_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Lower_L_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_R_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_Upper_L_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Axle2L: { kitNodeName: 'Axle2L' },
  Axle6L: { kitNodeName: 'Axle6L' },
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleModHips: { kitNodeName: 'AxleModHips' },
  AxleShoulderL: { kitNodeName: 'AxleMod3L' },
  AxleShoulderR: { kitNodeName: 'AxleMod3L' },
  AxleSocket1L: { kitNodeName: 'AxleSocket1L' },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L' },
  AxleSpacer1L001: { kitNodeName: 'AxleSpacer1L' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { kind: 'lego', value: LegoColor.TransNeonYellow },
        weathered: false,
      },
    },
  },
  Face: { kitNodeName: 'MataFace' },
  Gear_Big: { kitNodeName: 'GearB' },
  GearML: { kitNodeName: 'GearM' },
  GearMM: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes' },
  Hand_L_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  Hand_R_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinBackL: { kitNodeName: 'Pin2L' },
  HipPinBackR: { kitNodeName: 'Pin2L' },
  HipPinFrontL: { kitNodeName: 'Pin2L' },
  HipPinFrontR: { kitNodeName: 'Pin2L' },
  HookL: { kitNodeName: 'Hook', materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } } },
  HookR: { kitNodeName: 'Hook', materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } } },
  Leg_Lower_Piston_L_1: { kitNodeName: 'MataLegModPistonN' },
  Leg_Lower_Piston_R_1: { kitNodeName: 'MataLegModPistonN' },
  Leg_Upper_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Secondary: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Leg_Upper_R_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Secondary: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  LegAnkleL: {
    kitNodeName: 'MataLegModShin',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Secondary: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  LegAnkleR: {
    kitNodeName: 'MataLegModShin',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Secondary: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  MataAbdomen: {
    kitNodeName: 'MataAbdomen',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  MataChest: {
    kitNodeName: 'MataChest',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  MataFootL: {
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
    },
  },
  MataFootR: {
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Metal: { kind: 'lego', value: LegoColor.LightGray },
    },
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  ObliqueNL: { kitNodeName: 'MataObliqueN' },
  ObliqueNR: { kitNodeName: 'MataObliqueN' },
  ObliqueTL: {
    kitNodeName: 'MataObliqueW',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  ObliqueTR: {
    kitNodeName: 'MataObliqueW',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Socket: {
    kitNodeName: 'Socket',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
};
