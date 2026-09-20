import type { Object3D } from 'three';

/** Live armature in `Toa_Mata/kopaka.glb` — skinned body and leftover kit sockets share one skeleton. */
export const KOPAKA_SHEET_RIG_NODE = 'Kopaka';

/** Merged opaque body — one skinned mesh, one draw per `Body_*_Baked` slot. */
export const KOPAKA_SHEET_BODY_MESH = 'Body';

/** Skinned brain gel + glowing eyes. */
export const KOPAKA_SHEET_BRAIN_MESH = 'Brain';

/** Ice sword — transmissive gel (same preset as brain) so it blooms. */
export const KOPAKA_SHEET_SWORD_MESH = 'Sword';

export const KOPAKA_SHEET_BODY_MATERIAL_NAMES = [
  'Body_Main_Baked',
  'Body_Metal_Baked',
  'Body_Black_Baked',
  'Body_Secondary_Baked',
] as const;

export const KOPAKA_SHEET_BRAIN_MATERIAL_NAMES = ['Brain', 'Glowing Eyes'] as const;

export const KOPAKA_SHEET_SWORD_MATERIAL_NAMES = ['Weapon Transparent'] as const;

const KOPAKA_SHEET_MESH_NAMES = new Set<string>([
  KOPAKA_SHEET_BODY_MESH,
  KOPAKA_SHEET_BRAIN_MESH,
  KOPAKA_SHEET_SWORD_MESH,
]);

export function isKopakaSheetMesh(meshName: string): boolean {
  return KOPAKA_SHEET_MESH_NAMES.has(meshName);
}

/** Skinned primitive under a `Body` / `Brain` group (Blender mesh names, not the group). */
export function isKopakaSheetDescendant(mesh: Object3D): boolean {
  let parent: Object3D | null = mesh.parent;
  while (parent) {
    if (isKopakaSheetMesh(parent.name)) return true;
    parent = parent.parent;
  }
  return false;
}

export function isKopakaSheetRenderableMesh(mesh: Object3D): boolean {
  return isKopakaSheetMesh(mesh.name) || isKopakaSheetDescendant(mesh);
}
