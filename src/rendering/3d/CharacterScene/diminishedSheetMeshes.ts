import { Euler, Object3D } from 'three';

/** Live armature in `matoran_master.glb` — one skinned body plus a rigid brain. */
export const DIMINISHED_SHEET_RIG_NODE = 'Matoran';

/** Merged opaque body — one skinned mesh, one draw per `Body_*_Baked` slot. */
export const DIMINISHED_SHEET_BODY_MESH = 'Body';

/** Rigid brain gel + eyes, parented under `Head` so they follow the idle pose. */
export const DIMINISHED_SHEET_BRAIN_MESH = 'Brain';

export const DIMINISHED_SHEET_BODY_MATERIAL_NAMES = [
  'Body_Body_Baked',
  'Body_Face_Baked',
  'Body_Feet_Baked',
] as const;

export const DIMINISHED_SHEET_BRAIN_MATERIAL_NAMES = ['Brain', 'Glowing Eyes'] as const;

/**
 * Kanohi sockets on Mata rigs sit under `MataFace` at −90° X, which cancels the
 * Head bone's Blender rest (+90° X) so `masks.glb` stays upright.
 * This export parents `Masks` straight to `Head`, so apply the same cancel here.
 * Idle does not key `Masks`, so this rest pose sticks. Rebuilt authors its own
 * Head cancel in the GLB — do not use this there.
 */
export const DIMINISHED_MASK_SOCKET_ROTATION = new Euler(-Math.PI / 2, 0, 0);

export function alignDiminishedMaskSocket(masks: Object3D | undefined): void {
  if (!masks) return;
  masks.rotation.copy(DIMINISHED_MASK_SOCKET_ROTATION);
}
