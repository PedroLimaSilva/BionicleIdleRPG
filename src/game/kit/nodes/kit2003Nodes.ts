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
  BohrokBody: 'Bohrok Body',
  BohrokEye: 'Bohrok Eye',
  BohrokFoot: 'Bohrok Foot',
  BohrokHead: 'Bohrok Head',
  BohrokLever: 'Bohrok Lever',
  BohrokNeck: 'Bohrok Neck',
  BohrokTeeth: 'Bohrok Teeth',
  FacePlate: 'Face Plate',
  IceNuvaBlade: 'IceNuvaBlade',
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
  TechnicTorsoPivot: 'TechnicTorsoPivot',
} as const;

export type Kit2003NodeName = (typeof KIT_2003_NODES)[keyof typeof KIT_2003_NODES];
export type Kit2003SocketAttachment = import('../../../types/KitParts').KitSocketAttachment<Kit2003NodeName>;
