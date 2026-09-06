/**
 * Canonical attachable nodes in `kit_2001.glb`.
 * Values must match `Object3D.name` at runtime (see `useKitAttachments`).
 * When adding a node here, wire it in an attachment map or add to `KIT_NODE_EXEMPT`.
 *
 * Do not flag “atlas vs dedicated bake” on these keys. Bake layout is a
 * property of the glTF material / emissive image, not the attach name. One
 * node often mixes both: MataHip is its own bake, Socket packs UV islands,
 * MataSingleArmUpper Main+Secondary share one emission image, MataFoot mixes
 * a dedicated Main bake with UV1 heel/toe. Hand-flags would drift across
 * kit_2003 / masks and would not fix sampling — every bake still uses that
 * texture’s mesh UV (`texture.channel`).
 */
export const KIT_2001_NODES = {
  Axle2L: 'Axle2L',
  Axle3L: 'Axle3L',
  Axle6L: 'Axle6L',
  AxleConnRidged: 'AxleConnRidged',
  AxleConPin1: 'AxleConPin1',
  AxleConPin2: 'AxleConPin2',
  AxleMod2L: 'AxleMod2L',
  AxleMod3L: 'AxleMod3L',
  AxleModHips: 'AxleModHips',
  AxlePin: 'AxlePin',
  AxlePinPerp3L: 'AxlePinPerp3L',
  AxleSocket1L: 'AxleSocket1L',
  AxleSocket3L: 'AxleSocket3L',
  AxleSpacer1L: 'AxleSpacer1L',
  BallJoint: 'BallJoint',
  Claw: 'Claw',
  FootKick: 'FootKick',
  GearB: 'GearB',
  GearM: 'GearM',
  Hook: 'Hook',
  KopakaShield: 'KopakaShield',
  KopakaSword: 'KopakaSword',
  LewaAxe: 'LewaAxe',
  MataAbdomen: 'MataAbdomen',
  MataBrain: 'MataBrain',
  MataChest: 'MataChest',
  MataFace: 'MataFace',
  MataFoot: 'MataFoot',
  MataGlowingEyes: 'MataGlowingEyes',
  MataHand: 'MataHand',
  MataHip: 'MataHip',
  MataLegModPistonN: 'MataLegModPistonN',
  MataLegModPistonT: 'MataLegModPistonT',
  MataLegModShin: 'MataLegModShin',
  MataLegModThigh: 'MataLegModThigh',
  MataObliqueN: 'MataObliqueN',
  MataObliqueW: 'MataObliqueW',
  MataSingleArmHand: 'MataSingleArmHand',
  MataSingleArmLower: 'MataSingleArmLower',
  MataSingleArmPistonLowerL: 'MataSingleArmPistonLowerL',
  MataSingleArmPistonLowerR: 'MataSingleArmPistonLowerR',
  MataSingleArmPistonUpperL: 'MataSingleArmPistonUpperL',
  MataSingleArmPistonUpperR: 'MataSingleArmPistonUpperR',
  MataSingleArmUpper: 'MataSingleArmUpper',
  MatoranFoot: 'MatoranFoot',
  McArmL: 'McArmL',
  McArmR: 'McArmR',
  McToranFace: 'McToranFace',
  McTorso: 'McTorso',
  PerpendicularAxleJoint: 'PerpendicularAxleJoint',
  Pin2L: 'Pin2L',
  Socket: 'Socket',
  SocketModSide: 'SocketModSide',
  SocketModTop: 'SocketModTop',
  TahuSword: 'TahuSword',
  TechnicArmJoint: 'TechnicArmJoint',
  TechnicArmMain: 'TechnicArmMain',
  TechnicArmPistonN: 'TechnicArmPistonN',
  TechnicArmPistonT: 'TechnicArmPistonT',
} as const;

export type Kit2001NodeName = (typeof KIT_2001_NODES)[keyof typeof KIT_2001_NODES];
export type Kit2001SocketAttachment =
  import('../../../../types/KitParts').KitSocketAttachment<Kit2001NodeName>;
