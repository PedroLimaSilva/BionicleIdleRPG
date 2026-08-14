/**
 * Canonical attachable nodes in `kit_2004.glb`.
 * Values must match `Object3D.name` at runtime (see `useKitAttachments`).
 * When adding a node here, wire it in an attachment map or add to `KIT_NODE_EXEMPT`.
 */
export const KIT_2004_NODES = {
  MetruMatoranLimb: 'MetruMatoranLimb',
  MetruMatoranTorso: 'MetruMatoranTorso',
} as const;

export type Kit2004NodeName = (typeof KIT_2004_NODES)[keyof typeof KIT_2004_NODES];
export type Kit2004SocketAttachment =
  import('../../../types/KitParts').KitSocketAttachment<Kit2004NodeName>;
