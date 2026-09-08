import type { Object3D } from 'three';

/** Live armature in `rahkshi.glb` — detailed and battle LOD share one skeleton. */
export const RAHKSHI_DETAILED_RIG_NODE = 'Rahkshi';

/** Prefix for every battle LOD mesh node parented under `Rahkshi`. */
export const RAHKSHI_BATTLE_MESH_PREFIX = 'Battle_';

/**
 * Body bucket — exported as a `Group` with one skinned child per material slot
 * (e.g. `Part-44136_dot_dat003` … `_5`), not a single merged `SkinnedMesh`.
 */
export const RAHKSHI_BATTLE_BODY_MESH = 'Battle_Body';

/** Merged head / kraata-disk glow mesh (one draw, one material). */
export const RAHKSHI_BATTLE_GLOW_MESH = 'Battle_Glow';

/** Emissive + bloom material on `Battle_Glow`. */
export const RAHKSHI_BATTLE_GLOW_MATERIAL = 'Battle_Bloom';

/** One species overlay per staff breed (`Battle_{Breed}`). */
export const RAHKSHI_BATTLE_SPECIES_MESH_NAMES = [
  'Battle_Guurahk',
  'Battle_Panrahk',
  'Battle_Lerahk',
  'Battle_Vorahk',
  'Battle_Kurahk',
  'Battle_Turahk',
] as const;

export function isRahkshiBattleLodMesh(meshName: string): boolean {
  return meshName.startsWith(RAHKSHI_BATTLE_MESH_PREFIX);
}

export function isRahkshiBattleBodyMesh(meshName: string): boolean {
  return meshName === RAHKSHI_BATTLE_BODY_MESH;
}

/** Skinned mesh slotted under the `Battle_Body` group (not `Battle_`-prefixed). */
export function isRahkshiBattleBodyPartMesh(mesh: Object3D): boolean {
  let parent: Object3D | null = mesh.parent;
  while (parent) {
    if (parent.name === RAHKSHI_BATTLE_BODY_MESH) return true;
    parent = parent.parent;
  }
  return false;
}

/** Any mesh that belongs to battle LOD — `Battle_*` nodes or `Battle_Body` group children. */
export function isRahkshiBattleRenderableMesh(mesh: Object3D): boolean {
  if (isRahkshiBattleLodMesh(mesh.name)) return true;
  return isRahkshiBattleBodyPartMesh(mesh);
}

export function isRahkshiBattleSpeciesMesh(meshName: string): boolean {
  return (RAHKSHI_BATTLE_SPECIES_MESH_NAMES as readonly string[]).includes(meshName);
}

/** Whether a battle species overlay should be visible for the active staff breed. */
export function shouldShowRahkshiBattleSpeciesMesh(meshName: string, staffPrefix: string): boolean {
  return meshName === `${RAHKSHI_BATTLE_MESH_PREFIX}${staffPrefix}`;
}
