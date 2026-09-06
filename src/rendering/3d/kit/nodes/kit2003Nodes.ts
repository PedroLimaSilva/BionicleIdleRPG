/**
 * Canonical attachable nodes in `kit_2003.glb`.
 * Values must match `Object3D.name` at runtime (see `useKitAttachments`).
 * When adding a node here, wire it in an attachment map or add to `KIT_NODE_EXEMPT`.
 */
export const KIT_2003_NODES = {
  AirCutter: 'AirCutter',
  AquaAxe: 'AquaAxe',
  Axle3LStud: 'Axle3LStud',
  AxleSpacerHalf: 'AxleSpacer1/2',
  BohrokArm: 'BohrokArm',
  BohrokBody: 'BohrokBody',
  BohrokEye: 'BohrokEye',
  BohrokFoot: 'BohrokFoot',
  BohrokHead: 'BohrokHead',
  BohrokLever: 'BohrokLever',
  BohrokNeck: 'BohrokNeck',
  BohrokTeeth: 'BohrokTeeth',
  FacePlate: 'FacePlate',
  IceNuvaBlade: 'IceNuvaBlade',
  LightSpear: 'LightSpear',
  MagmaBlade: 'MagmaBlade',
  MatoranBody: 'MatoranBody',
  NuvaBiceps: 'NuvaBiceps',
  NuvaCalf: 'NuvaCalf',
  NuvaForearm: 'NuvaForearm',
  NuvaForearmArmor: 'NuvaForearmArmor',
  NuvaPistonN: 'NuvaPistonN',
  NuvaPistonT: 'NuvaPistonT',
  NuvaQuad: 'NuvaQuad',
  NuvaShin: 'NuvaShin',
  NuvaThigh: 'NuvaThigh',
  NuvaTriceps: 'NuvaTriceps',
  PerpendicularLiftArm: 'PerpendicularLiftArm',
  Pin3L: 'Pin3L',
  PohatuClaw: 'PohatuClaw',
  Propeller: 'Propeller',
  QuakeBreaker: 'QuakeBreaker',
  RahkshiBody: 'RahkshiBody',
  TechnicTorsoPivot: 'TechnicTorsoPivot',
} as const;

export type Kit2003NodeName = (typeof KIT_2003_NODES)[keyof typeof KIT_2003_NODES];
export type { Kit2003SocketAttachment } from './kitMaterialSlots';
