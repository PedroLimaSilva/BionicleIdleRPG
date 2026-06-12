import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import {
  MATA_KIT_PLAYER_PALETTE_BRAIN,
  MATA_KIT_PLAYER_PALETTE_PLASTICS,
  mataKitPlayerPaletteGlow,
} from '../../palettes/mataKitPlayerPalette';
import { NUVA_KIT_METAL } from '../../palettes/nuvaKitPlayerPalette';

const POHATU_NUVA_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PLAYER_PALETTE_BRAIN,
  ...mataKitPlayerPaletteGlow(50),
  ...MATA_KIT_PLAYER_PALETTE_PLASTICS,
  ...NUVA_KIT_METAL,
};

const POHATU_NUVA_EYES_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  'Glowing Eyes': {
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 50,
    weathered: false,
  },
};

const POHATU_NUVA_BLACK: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Black },
};

/** FootKick only exposes `Main`; match Nuva kit metal shininess. */
const POHATU_NUVA_FOOT_KICK_PALETTE_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Secondary: NUVA_KIT_METAL.Metal!,
  Metal: POHATU_NUVA_PALETTE_COLORS.Secondary
};

/**
 * Pohatu Nuva — sockets on `Toa_Nuva/pohatu.glb` filled from `kit_2001.glb`.
 * Socket names match kit nodes or kit base + L/R (and related) suffixes.
 */
export const POHATU_NUVA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  Axle2L: { kitNodeName: 'Axle2L', materialColors: POHATU_NUVA_PALETTE_COLORS },
  Axle3LL: { kitNodeName: 'Axle3L', materialColors: POHATU_NUVA_BLACK },
  Axle3LR: { kitNodeName: 'Axle3L', materialColors: POHATU_NUVA_BLACK },
  Axle6L: { kitNodeName: 'Axle6L', materialColors: POHATU_NUVA_PALETTE_COLORS },
  AxleConPin1: { kitNodeName: 'AxleConPin1', materialColors: POHATU_NUVA_BLACK },
  AxleMod3LL: { kitNodeName: 'AxleMod3L', materialColors: POHATU_NUVA_BLACK },
  AxleMod3LR: { kitNodeName: 'AxleMod3L', materialColors: POHATU_NUVA_BLACK },
  AxleModHips: { kitNodeName: 'AxleModHips', materialColors: POHATU_NUVA_PALETTE_COLORS },
  AxlePinPerp3L: { kitNodeName: 'AxlePinPerp3L', materialColors: POHATU_NUVA_BLACK },
  AxleSpacer1LB: { kitNodeName: 'AxleSpacer1L', materialColors: POHATU_NUVA_PALETTE_COLORS },
  AxleSpacer1LF: { kitNodeName: 'AxleSpacer1L', materialColors: POHATU_NUVA_PALETTE_COLORS },
  FootKickL: { kitNodeName: 'FootKick', materialColors: POHATU_NUVA_FOOT_KICK_PALETTE_COLORS },
  FootKickR: { kitNodeName: 'FootKick', materialColors: POHATU_NUVA_FOOT_KICK_PALETTE_COLORS },
  GearB: { kitNodeName: 'GearB', materialColors: POHATU_NUVA_PALETTE_COLORS },
  GearM: { kitNodeName: 'GearM', materialColors: POHATU_NUVA_PALETTE_COLORS },
  GearMR: { kitNodeName: 'GearM', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataAbdomen: { kitNodeName: 'MataAbdomen', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataBrain: {
    kitNodeName: 'MataBrain',
    materialColors: {
      Brain: {
        color: { key: 'eyes', kind: 'palette' },
        weathered: false,
      },
    },
  },
  MataChest: { kitNodeName: 'MataChest', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFace: { kitNodeName: 'MataFace', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFootL: { kitNodeName: 'MataFoot', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataFootR: { kitNodeName: 'MataFoot', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataGlowingEyes: {
    kitNodeName: 'MataGlowingEyes',
    materialColors: POHATU_NUVA_EYES_PALETTE_COLORS,
  },
  MataHip: { kitNodeName: 'MataHip', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataObliqueNL: { kitNodeName: 'MataObliqueN', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataObliqueNR: { kitNodeName: 'MataObliqueN', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataObliqueWL: { kitNodeName: 'MataObliqueW', materialColors: POHATU_NUVA_PALETTE_COLORS },
  MataObliqueWR: { kitNodeName: 'MataObliqueW', materialColors: POHATU_NUVA_PALETTE_COLORS },
  PerpendicularAxleJoint: {
    kitNodeName: 'PerpendicularAxleJoint',
    materialColors: POHATU_NUVA_BLACK,
  },
  SocketL: { kitNodeName: 'Socket', materialColors: POHATU_NUVA_PALETTE_COLORS },
  SocketModSideAL: { kitNodeName: 'SocketModSide', materialColors: POHATU_NUVA_BLACK },
  SocketModSideAR: { kitNodeName: 'SocketModSide', materialColors: POHATU_NUVA_BLACK },
  SocketModSideHL: { kitNodeName: 'SocketModSide', materialColors: POHATU_NUVA_BLACK },
  SocketModSideHR: { kitNodeName: 'SocketModSide', materialColors: POHATU_NUVA_BLACK },
  SocketR: { kitNodeName: 'Socket', materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmJointL: { kitNodeName: 'TechnicArmJoint', materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmJointR: { kitNodeName: 'TechnicArmJoint', materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmMainL: { kitNodeName: 'TechnicArmMain', materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmMainR: { kitNodeName: 'TechnicArmMain', materialColors: POHATU_NUVA_PALETTE_COLORS },
  TechnicArmPistonNL: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonNR: {
    kitNodeName: 'TechnicArmPistonN',
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonTL: {
    kitNodeName: 'TechnicArmPistonT',
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
  TechnicArmPistonTR: {
    kitNodeName: 'TechnicArmPistonT',
    materialColors: POHATU_NUVA_PALETTE_COLORS,
  },
};

/**
 * Pohatu Nuva — Nuva limbs and climbing claws from `kit_2003.glb`.
 */
export const POHATU_NUVA_KIT_2003_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  NuvaCalfL: { kitNodeName: 'NuvaCalf', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaCalfR: { kitNodeName: 'NuvaCalf', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaPistonNL: { kitNodeName: 'NuvaPistonN', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaPistonNR: { kitNodeName: 'NuvaPistonN', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaPistonTL: { kitNodeName: 'NuvaPistonT', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaPistonTR: { kitNodeName: 'NuvaPistonT', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaQuadL: { kitNodeName: 'NuvaQuad', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaQuadR: { kitNodeName: 'NuvaQuad', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaShinL: { kitNodeName: 'NuvaShin', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaShinR: { kitNodeName: 'NuvaShin', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaThighL: { kitNodeName: 'NuvaThigh', materialColors: POHATU_NUVA_PALETTE_COLORS },
  NuvaThighR: { kitNodeName: 'NuvaThigh', materialColors: POHATU_NUVA_PALETTE_COLORS },
  PohatuClawL: { kitNodeName: 'PohatuClaw', materialColors: POHATU_NUVA_PALETTE_COLORS },
  PohatuClawR: { kitNodeName: 'PohatuClaw', materialColors: POHATU_NUVA_PALETTE_COLORS },
};
