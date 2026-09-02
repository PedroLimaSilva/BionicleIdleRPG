/**
 * Canonical attachable nodes in `kit_2004.glb`.
 * Values must match `Object3D.name` at runtime (see `useKitAttachments`).
 * When adding a node here, wire it in an attachment map or add to `KIT_NODE_EXEMPT`.
 */
export const KIT_2004_NODES = {
  AeroSlicer: 'AeroSlicer',
  AxleArm3L: 'AxleArm3L',
  BordakhTool: 'BordakhTool',
  CrystalSpike: 'CrystalSpike',
  DiskLauncher: 'Disk_Launcher',
  DoubleSocketArmor: 'DoubleSocketArmor',
  EarthshockDrill: 'EarthshockDrill',
  Hydroblade: 'Hydroblade',
  KeerakhTool: 'KeerakhTool',
  LhikanSword: 'Lhikan_Sword',
  MetruArm: 'MetruArm',
  MetruBrain: 'MetruBrain',
  MetruChestLid: 'MetruChestLid',
  MetruFoot: 'MetruFoot',
  MetruGlowingEyes: 'MetruGlowingEyes',
  MetruHead: 'MetruHead',
  MetruHips: 'MetruHips',
  MetruLeg: 'MetruLeg',
  MetruMatoranLimbPiston: 'MetruMatoranLimbPiston',
  MetruMatoranLimbShin: 'MetruMatoranLimbShin',
  MetruMatoranTorso: 'MetruMatoranTorso',
  MetruShoulderArmorBottom: 'MetruShoulderArmorBottom',
  MetruShoulderArmorTop: 'MetruShoulderArmorTop',
  MetruTorso: 'MetruTorso',
  NuurakhTool: 'NuurakhTool',
  ProtoPiton: 'ProtoPiton',
  RorzakhTool: 'RorzakhTool',
  SocketDouble1L: 'SocketDouble1L',
  TechnicPinBush: 'TechnicPinBush',
  VahkiGlowingEyes: 'VahkiGlowingEyes',
  VahkiHead: 'VahkiHead',
  VahkiHip: 'VahkiHip',
  VahkiHood: 'VahkiHood',
  VahkiLauncher: 'VahkiLauncher',
  VahkiLeg: 'VahkiLeg',
  VahkiSpine: 'VahkiSpine',
  VakamaDiskLauncher: 'VakamaDiskLauncher',
  VorzakhTool: 'VorzakhTool',
  ZadakhTool: 'ZadakhTool',
} as const;

export type Kit2004NodeName = (typeof KIT_2004_NODES)[keyof typeof KIT_2004_NODES];
export type Kit2004SocketAttachment =
  import('../../../../types/KitParts').KitSocketAttachment<Kit2004NodeName>;
