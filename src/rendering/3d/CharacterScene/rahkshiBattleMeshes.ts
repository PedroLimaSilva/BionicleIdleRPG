/** Live / detailed armature in `rahkshi.glb`. */
export const RAHKSHI_DETAILED_RIG_NODE = 'Rahkshi';

/**
 * Parent empty for merged battle meshes on the **single-armature** export path.
 * Battle `SkinnedMesh`, `Battle_Glow`, and species overlays live here, hidden in detailed LOD.
 */
export const RAHKSHI_BATTLE_LOD_GROUP = 'Battle_LOD';

/** Legacy second armature root — remove after battle meshes move under `Rahkshi`. */
export const RAHKSHI_BATTLE_RIG_NODE = 'Rahkshi_Battle';

/** Skinned body bucket mesh on `Rahkshi_Battle` (six `Battle_*` material slots). */
export const RAHKSHI_BATTLE_BODY_MESH = 'SkinnedMesh';

/** Merged head / kraata-disk glow mesh on `Rahkshi_Battle` (one draw, one material). */
export const RAHKSHI_BATTLE_GLOW_MESH = 'Battle_Glow';

/** Emissive + bloom material on `Battle_Glow`. Merge all glow geometry to this slot before export. */
export const RAHKSHI_BATTLE_GLOW_MATERIAL = 'Battle_Bloom';

/** One species overlay per staff breed on the battle rig (spine + staff). */
export const RAHKSHI_BATTLE_SPECIES_MESH_NAMES = [
  'Guurahk',
  'Panrahk',
  'Lerahk',
  'Vorahk',
  'Kurahk',
  'Turahk',
] as const;

export function isRahkshiBattleSpeciesMesh(meshName: string): boolean {
  return (RAHKSHI_BATTLE_SPECIES_MESH_NAMES as readonly string[]).includes(meshName);
}

/** Whether a battle species overlay should be visible for the active staff breed. */
export function shouldShowRahkshiBattleSpeciesMesh(meshName: string, staffPrefix: string): boolean {
  return meshName === staffPrefix;
}
