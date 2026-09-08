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

/**
 * Toggle detailed vs battle meshes.
 *
 * - **Single armature (target):** battle buckets live under `Battle_LOD` on `Rahkshi`.
 * - **Legacy:** separate `Rahkshi_Battle` root toggled alongside `Rahkshi`.
 */
export function setRahkshiLodVisibility(
  detailedRoot: Object3D,
  battleRoot: Object3D | null,
  variant: RahkshiMeshVariant
): void {
  const isBattle = variant === 'battle';
  const battleLodGroup = detailedRoot.getObjectByName(RAHKSHI_BATTLE_LOD_GROUP);

  if (battleLodGroup) {
    detailedRoot.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const underBattleLod = isDescendantOf(child, battleLodGroup);
      child.visible = underBattleLod ? isBattle : !isBattle;
    });
    return;
  }

  detailedRoot.visible = !isBattle;
  if (battleRoot) battleRoot.visible = isBattle;
}

export { RAHKSHI_BATTLE_RIG_NODE };
