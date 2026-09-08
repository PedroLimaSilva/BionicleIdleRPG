import { Mesh, Object3D } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import { RAHKSHI_BATTLE_LOD_GROUP, RAHKSHI_BATTLE_RIG_NODE } from './rahkshiBattleMeshes';

export function collectMeshUuids(root: Object3D): Set<string> {
  const uuids = new Set<string>();
  root.traverse((child) => {
    if (child instanceof Mesh) uuids.add(child.uuid);
  });
  return uuids;
}

function isDescendantOf(node: Object3D, ancestor: Object3D): boolean {
  for (let current: Object3D | null = node; current; current = current.parent) {
    if (current === ancestor) return true;
  }
  return false;
}

export function getRahkshiBattleLodGroup(detailedRoot: Object3D): Object3D | null {
  return detailedRoot.getObjectByName(RAHKSHI_BATTLE_LOD_GROUP) ?? null;
}

export function usesRahkshiBattleLodGroup(detailedRoot: Object3D): boolean {
  return getRahkshiBattleLodGroup(detailedRoot) !== null;
}

export type RahkshiBattleAppearanceTarget = {
  /** Meshes that belong to the active battle LOD (subset of `root`). */
  meshUuids: Set<string>;
  /** Object to traverse when applying battle tints and species visibility. */
  root: Object3D;
};

/**
 * Battle meshes live under `Battle_LOD` on the live armature (target export), or on a
 * legacy `Rahkshi_Battle` root until the GLB is re-exported.
 */
export function resolveRahkshiBattleAppearanceTarget(
  detailedRoot: Object3D,
  legacyBattleRoot: Object3D | null
): RahkshiBattleAppearanceTarget | null {
  const battleLodGroup = getRahkshiBattleLodGroup(detailedRoot);
  if (battleLodGroup) {
    return { meshUuids: collectMeshUuids(battleLodGroup), root: detailedRoot };
  }
  if (legacyBattleRoot) {
    return { meshUuids: collectMeshUuids(legacyBattleRoot), root: legacyBattleRoot };
  }
  return null;
}

/**
 * Toggle detailed vs battle meshes.
 *
 * - **Single armature (target):** battle buckets live under `Battle_LOD` on `Rahkshi`.
 * - **Legacy:** separate `Rahkshi_Battle` root toggled alongside `Rahkshi`.
 */
export function setRahkshiLodVisibility(
  detailedRoot: Object3D,
  legacyBattleRoot: Object3D | null,
  variant: RahkshiMeshVariant
): void {
  const isBattle = variant === 'battle';
  const battleLodGroup = getRahkshiBattleLodGroup(detailedRoot);

  if (battleLodGroup) {
    detailedRoot.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const underBattleLod = isDescendantOf(child, battleLodGroup);
      child.visible = underBattleLod ? isBattle : !isBattle;
    });
    return;
  }

  detailedRoot.visible = !isBattle;
  if (legacyBattleRoot) legacyBattleRoot.visible = isBattle;
}

export { RAHKSHI_BATTLE_RIG_NODE };
