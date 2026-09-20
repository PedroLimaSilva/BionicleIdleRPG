import type { Object3D } from 'three';

/** Live armature in `rebuilt.glb` — packed body and leftover kit sockets share one skeleton. */
export const REBUILT_SHEET_RIG_NODE = 'Matoran';

/** Merged opaque body — one mesh, one draw per `Body_*_Baked` slot. */
export const REBUILT_SHEET_BODY_MESH = 'Body_Baked';

/** Brain gel + glowing eyes. */
export const REBUILT_SHEET_BRAIN_MESH = 'Brain';

export const REBUILT_SHEET_BODY_MATERIAL_NAMES = [
  'Body_Body_Baked',
  'Body_Limbs_Baked',
  'Body_Metal_Baked',
] as const;

export const REBUILT_SHEET_BRAIN_MATERIAL_NAMES = ['Brain', 'Glowing Eyes'] as const;

const REBUILT_SHEET_MESH_NAMES = new Set<string>([
  REBUILT_SHEET_BODY_MESH,
  REBUILT_SHEET_BRAIN_MESH,
]);

export function isRebuiltSheetMesh(meshName: string): boolean {
  return REBUILT_SHEET_MESH_NAMES.has(meshName);
}

/** Primitive under a `Body_Baked` / `Brain` group (Blender mesh names, not the group). */
export function isRebuiltSheetDescendant(mesh: Object3D): boolean {
  let parent: Object3D | null = mesh.parent;
  while (parent) {
    if (isRebuiltSheetMesh(parent.name)) return true;
    parent = parent.parent;
  }
  return false;
}

export function isRebuiltSheetRenderableMesh(mesh: Object3D): boolean {
  return isRebuiltSheetMesh(mesh.name) || isRebuiltSheetDescendant(mesh);
}
