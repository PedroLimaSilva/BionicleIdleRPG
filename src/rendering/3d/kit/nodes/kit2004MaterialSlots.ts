import { KIT_2004_NODES } from './kit2004Nodes';

/**
 * Material slot names on each attachable node in the kit GLB.
 * Keys match `KIT_2004_NODES`; values are `materialColors` config keys.
 * Regenerate: `yarn kit-material-slots-report --write`
 */
export const KIT_2004_MATERIAL_SLOTS = {
  AeroSlicer: ['Glow', 'Metal'] as const,
  AxleArm3L: ['Main'] as const,
  BordakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  CrystalSpike: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  DiskLauncher: ['Main', 'Metal'] as const,
  DoubleSocketArmor: ['Main', 'Metal', 'Secondary'] as const,
  EarthshockDrill: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  Hydroblade: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  KeerakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  LhikanSword: ['Glow', 'Metal'] as const,
  MetruArm: ['Main', 'Metal', 'Secondary'] as const,
  MetruBrain: ['Brain'] as const,
  MetruChestLid: ['Main', 'Metal'] as const,
  MetruFoot: ['Main', 'Metal', 'Secondary'] as const,
  MetruGlowingEyes: ['Glowing Eyes'] as const,
  MetruHead: ['Face'] as const,
  MetruHips: ['Main', 'Metal'] as const,
  MetruLeg: ['Main', 'Metal', 'Secondary'] as const,
  MetruMatoranLimbPiston: ['Main', 'Metal', 'Secondary'] as const,
  MetruMatoranLimbShin: ['Main', 'Secondary'] as const,
  MetruMatoranTorso: ['Main'] as const,
  MetruShoulderArmorBottom: ['Main', 'Metal', 'Secondary'] as const,
  MetruShoulderArmorTop: ['Main', 'Secondary'] as const,
  MetruTorso: ['Main', 'Metal'] as const,
  NuurakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  ProtoPiton: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  RorzakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  SocketDouble1L: ['Main'] as const,
  TechnicPinBush: ['Main'] as const,
  VahkiGlowingEyes: ['Glowing Eyes'] as const,
  VahkiHead: ['Main', 'Secondary'] as const,
  VahkiHip: ['Main'] as const,
  VahkiHood: ['VahkiHood'] as const,
  VahkiLauncher: ['Main', 'Metal', 'Secondary'] as const,
  VahkiLeg: ['Main', 'Metal', 'Secondary'] as const,
  VahkiSpine: ['Main', 'Metal'] as const,
  VakamaDiskLauncher: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  VorzakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
  ZadakhTool: ['Glow', 'Main', 'Metal', 'Secondary'] as const,
} as const satisfies Record<keyof typeof KIT_2004_NODES, readonly string[]>;

export type Kit2004MaterialSlotMap = typeof KIT_2004_MATERIAL_SLOTS;
