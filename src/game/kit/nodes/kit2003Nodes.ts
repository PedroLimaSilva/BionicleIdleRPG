/**
 * Canonical attachable nodes in `kit_2003.glb`.
 * Values must match `Object3D.name` at runtime (see `useKitAttachments`).
 * When adding a node here, wire it in an attachment map or add to `KIT_NODE_EXEMPT`.
 */
export const KIT_2003_NODES = {
  AirCutter: 'AirCutter',
  AquaAxe: 'AquaAxe',
  Axle3LStud: 'Axle3LStud',
  AxleSpacerHalf: 'AxleSpacer12',
  BohrokArm: 'BohrokArm',
  BohrokBody: 'Bohrok_Body',
  BohrokEye: 'Bohrok_Eye',
  BohrokFoot: 'Bohrok_Foot',
  BohrokHead: 'Bohrok_Head',
  BohrokLever: 'Bohrok_Lever',
  BohrokNeck: 'Bohrok_Neck',
  BohrokTeeth: 'Bohrok_Teeth',
  FacePlate: 'Face_Plate',
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
  TechnicTorsoPivot: 'TechnicTorsoPivot',
} as const;

export type Kit2003NodeName = (typeof KIT_2003_NODES)[keyof typeof KIT_2003_NODES];
export type Kit2003SocketAttachment =
  import('../../../types/KitParts').KitSocketAttachment<Kit2003NodeName>;
