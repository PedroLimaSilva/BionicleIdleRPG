import { KIT_2003_NODES } from './kit2003Nodes';

/**
 * Material slot names on each attachable node in the kit GLB.
 * Keys match `KIT_2003_NODES`; values are `materialColors` config keys.
 * Regenerate: `yarn kit-material-slots-report --write`
 */
export const KIT_2003_MATERIAL_SLOTS = {
  AirCutter: ['Glow', 'Main', 'Metal'] as const,
  AquaAxe: ['Glow', 'Metal'] as const,
  Axle3LStud: ['Main'] as const,
  AxleSpacerHalf: ['Metal'] as const,
  BohrokArm: ['Main'] as const,
  BohrokBody: ['Main', 'Metal'] as const,
  BohrokEye: ['Brain', 'Glow'] as const,
  BohrokFoot: ['Main', 'Metal'] as const,
  BohrokHead: ['Main', 'Metal'] as const,
  BohrokLever: ['Metal'] as const,
  BohrokNeck: ['Metal'] as const,
  BohrokTeeth: ['Main', 'Metal'] as const,
  FacePlate: ['CLEAR', 'Clear', 'Main'] as const,
  IceNuvaBlade: ['Glow', 'Main', 'Metal'] as const,
  LightSpear: ['Glow', 'Main', 'Metal'] as const,
  MagmaBlade: ['Glow', 'Main', 'Metal'] as const,
  MatoranBody: ['Main'] as const,
  NuvaBiceps: ['Main', 'Secondary'] as const,
  NuvaCalf: ['Main'] as const,
  NuvaForearm: ['Main', 'Metal'] as const,
  NuvaForearmArmor: ['Main', 'Secondary'] as const,
  NuvaPistonN: ['Metal'] as const,
  NuvaPistonT: ['Main', 'Metal'] as const,
  NuvaQuad: ['Main', 'Secondary'] as const,
  NuvaShin: ['Main', 'Secondary'] as const,
  NuvaThigh: ['Main'] as const,
  NuvaTriceps: ['Main', 'Metal', 'Secondary'] as const,
  PerpendicularLiftArm: ['Main'] as const,
  Pin3L: ['Metal'] as const,
  PohatuClaw: ['Glow', 'Main', 'Metal'] as const,
  Propeller: ['Metal'] as const,
  QuakeBreaker: ['Glow', 'Main', 'Metal'] as const,
  RahkshiBody: ['Main'] as const,
  TechnicTorsoPivot: ['Main'] as const,
} as const satisfies Record<keyof typeof KIT_2003_NODES, readonly string[]>;

export type Kit2003MaterialSlotMap = typeof KIT_2003_MATERIAL_SLOTS;
