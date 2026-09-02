import { LegoColor } from '../../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../../types/KitParts';
import type { Kit2001SocketAttachment } from '../../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../../nodes/kit2001Nodes';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
  mataKitPlayerPaletteWeaponGlow,
} from '../../palettes/mataKitPlayerPalette';

const GALI_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
};

const GALI_HOOK_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...GALI_PALETTE_COLORS,
  ...mataKitPlayerPaletteWeaponGlow(2.5),
};

/**
 * Gali Mata (2001 kit): socket name on rig → kit node + per-material overrides.
 * Emissive / glow: set `emissive` + `emissiveIntensity` on a material slot (LegoColor or palette keys).
 */
export const GALI_MATA_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  Arm_L_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_L_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmLower,
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonLowerL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_R_Piston_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmPistonUpperL,
    materialColors: GALI_PALETTE_COLORS,
  },
  Arm_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Arm_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmUpper,
    materialColors: {
      Main: GALI_PALETTE_COLORS.Secondary,
    },
  },
  Axle2L: { kitNodeName: KIT_2001_NODES.Axle2L, materialColors: GALI_PALETTE_COLORS },
  Axle6L: { kitNodeName: KIT_2001_NODES.Axle6L, materialColors: GALI_PALETTE_COLORS },
  AxleConPin2: {
    kitNodeName: KIT_2001_NODES.AxleConPin2,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  AxleMod2L: { kitNodeName: KIT_2001_NODES.AxleMod2L, materialColors: GALI_PALETTE_COLORS },
  AxleModHips: { kitNodeName: KIT_2001_NODES.AxleModHips, materialColors: GALI_PALETTE_COLORS },
  AxleShoulderL: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: GALI_PALETTE_COLORS },
  AxleShoulderR: { kitNodeName: KIT_2001_NODES.AxleMod3L, materialColors: GALI_PALETTE_COLORS },
  AxleSocket1L: { kitNodeName: KIT_2001_NODES.AxleSocket1L, materialColors: GALI_PALETTE_COLORS },
  AxleSpacer1L: { kitNodeName: KIT_2001_NODES.AxleSpacer1L, materialColors: GALI_PALETTE_COLORS },
  AxleSpacer1L001: {
    kitNodeName: KIT_2001_NODES.AxleSpacer1L,
    materialColors: GALI_PALETTE_COLORS,
  },
  Brain: {
    kitNodeName: KIT_2001_NODES.MataBrain,
    materialColors: GALI_PALETTE_COLORS,
  },
  Face: { kitNodeName: KIT_2001_NODES.MataFace, materialColors: GALI_PALETTE_COLORS },
  Gear_Big: { kitNodeName: KIT_2001_NODES.GearB, materialColors: GALI_PALETTE_COLORS },
  GearML: { kitNodeName: KIT_2001_NODES.GearM, materialColors: GALI_PALETTE_COLORS },
  GearMM: { kitNodeName: KIT_2001_NODES.GearM, materialColors: GALI_PALETTE_COLORS },
  GearMR: { kitNodeName: KIT_2001_NODES.GearM, materialColors: GALI_PALETTE_COLORS },
  Glowing_Eyes: {
    kitNodeName: KIT_2001_NODES.MataGlowingEyes,
    materialColors: GALI_PALETTE_COLORS,
  },
  Hand_L_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: GALI_PALETTE_COLORS.Secondary },
  },
  Hand_R_1: {
    kitNodeName: KIT_2001_NODES.MataSingleArmHand,
    materialColors: { Main: GALI_PALETTE_COLORS.Secondary },
  },
  Hip_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModTop,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinBackL: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinBackR: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinFrontL: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HipPinFrontR: {
    kitNodeName: KIT_2001_NODES.Pin2L,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HookL: { kitNodeName: KIT_2001_NODES.Hook, materialColors: GALI_HOOK_PALETTE_COLORS },
  HookR: { kitNodeName: KIT_2001_NODES.Hook, materialColors: GALI_HOOK_PALETTE_COLORS },
  Leg_Lower_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Lower_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonN,
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModPistonT,
    materialColors: GALI_PALETTE_COLORS,
  },
  Leg_Upper_R_1: {
    kitNodeName: KIT_2001_NODES.MataLegModThigh,
    materialColors: GALI_PALETTE_COLORS,
  },
  LegAnkleL: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: GALI_PALETTE_COLORS,
  },
  LegAnkleR: {
    kitNodeName: KIT_2001_NODES.MataLegModShin,
    materialColors: GALI_PALETTE_COLORS,
  },
  MataAbdomen: {
    kitNodeName: KIT_2001_NODES.MataAbdomen,
    materialColors: GALI_PALETTE_COLORS,
  },
  MataChest: {
    kitNodeName: KIT_2001_NODES.MataChest,
    materialColors: GALI_PALETTE_COLORS,
  },
  MataFootL: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: GALI_PALETTE_COLORS,
  },
  MataFootR: {
    kitNodeName: KIT_2001_NODES.MataFoot,
    materialColors: GALI_PALETTE_COLORS,
  },
  MataHip: {
    kitNodeName: KIT_2001_NODES.MataHip,
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueNL: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: GALI_PALETTE_COLORS },
  ObliqueNR: { kitNodeName: KIT_2001_NODES.MataObliqueN, materialColors: GALI_PALETTE_COLORS },
  ObliqueTL: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: GALI_PALETTE_COLORS,
  },
  ObliqueTR: {
    kitNodeName: KIT_2001_NODES.MataObliqueW,
    materialColors: GALI_PALETTE_COLORS,
  },
  Shoulder_Joint_L_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_R_1: {
    kitNodeName: KIT_2001_NODES.SocketModSide,
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Socket: {
    kitNodeName: KIT_2001_NODES.Socket,
    materialColors: GALI_PALETTE_COLORS,
  },
};
