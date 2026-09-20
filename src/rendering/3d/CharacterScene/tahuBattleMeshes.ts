import type { Object3D } from 'three';

/** Sheet = high-res packed maps; battle = lower-res (then lower-tri) when authored. */
export type TahuMeshVariant = 'sheet' | 'battle';

/** Character sheet / dex — packed skinned body with high-res maps. */
export const TAHU_PREVIEW_MESH_VARIANT: TahuMeshVariant = 'sheet';

/** Live combat — same skinned body until lower-res maps / a lower-tri mesh ship. */
export const TAHU_COMBAT_MESH_VARIANT: TahuMeshVariant = 'battle';

/** Live armature in `Toa_Mata/tahu.glb` — packed body and unused kit sockets share one skeleton. */
export const TAHU_DETAILED_RIG_NODE = 'Tahu';

/** Prefix for Tahu battle LOD mesh nodes parented under `Tahu`. */
export const TAHU_BATTLE_MESH_PREFIX = 'Battle_';

/** Merged opaque body — one skinned mesh, one draw per `Battle_Body_*` slot. */
export const TAHU_BATTLE_BODY_MESH = 'Battle_Body';

/** Skinned brain gel + eyes overlay. GLTF node `Battle_Brain`; primitives may be named `Brain`. */
export const TAHU_BATTLE_BRAIN_MESH = 'Battle_Brain';

/** Sword glow — separate `Battle_Weapon` mesh so bloom stays off the packed body. */
export const TAHU_BATTLE_WEAPON_MESH = 'Battle_Weapon';

export const TAHU_BATTLE_BODY_MATERIAL_NAMES = [
  'Battle_Body_Main_Baked',
  'Battle_Body_Metal_Baked',
  'Battle_Body_Black_Baked',
  'Battle_Body_Secondary_Baked',
] as const;

export const TAHU_BATTLE_BRAIN_MATERIAL_NAMES = ['TRANS-DARK_PINK', 'Tahu Eyes'] as const;

export const TAHU_BATTLE_WEAPON_MATERIAL_NAMES = ['Glow'] as const;

export function isTahuBattleLodMesh(meshName: string): boolean {
  return meshName.startsWith(TAHU_BATTLE_MESH_PREFIX);
}

/** Skinned primitive under a `Battle_*` group (e.g. `Brain` inside `Battle_Brain`). */
export function isTahuBattleLodDescendant(mesh: Object3D): boolean {
  let parent: Object3D | null = mesh.parent;
  while (parent) {
    if (isTahuBattleLodMesh(parent.name)) return true;
    parent = parent.parent;
  }
  return false;
}

export function isTahuBattleRenderableMesh(mesh: Object3D): boolean {
  return isTahuBattleLodMesh(mesh.name) || isTahuBattleLodDescendant(mesh);
}
