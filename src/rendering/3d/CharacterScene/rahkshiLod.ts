import { Mesh, Object3D } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import {
  isRahkshiBattleLodMesh,
  isRahkshiBattleSpeciesMesh,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';

function isRenderableMesh(child: Object3D): child is Mesh {
  return (child as Mesh).isMesh === true;
}

export function collectMeshUuids(root: Object3D): Set<string> {
  const uuids = new Set<string>();
  root.traverse((child) => {
    if (child instanceof Mesh) uuids.add(child.uuid);
  });
  return uuids;
}

export function collectRahkshiBattleMeshUuids(root: Object3D): Set<string> {
  const uuids = new Set<string>();
  root.traverse((child) => {
    if (isRenderableMesh(child) && isRahkshiBattleLodMesh(child.name)) {
      uuids.add(child.uuid);
    }
  });
  return uuids;
}

export type RahkshiBattleAppearanceTarget = {
  /** Meshes that belong to the active battle LOD (subset of `root`). */
  meshUuids: Set<string>;
  /** Object to traverse when applying battle tints and species visibility. */
  root: Object3D;
};

/** Battle meshes are `Battle_*` nodes on the live `Rahkshi` armature. */
export function resolveRahkshiBattleAppearanceTarget(
  detailedRoot: Object3D
): RahkshiBattleAppearanceTarget | null {
  const meshUuids = collectRahkshiBattleMeshUuids(detailedRoot);
  if (meshUuids.size === 0) return null;
  return { meshUuids, root: detailedRoot };
}

/**
 * Toggle detailed baked/kit meshes vs `Battle_*` meshes on the single armature.
 * Species overlays are only eligible in battle mode.
 */
export function setRahkshiLodVisibility(
  detailedRoot: Object3D,
  variant: RahkshiMeshVariant,
  staffPrefix?: string
): void {
  const isBattle = variant === 'battle';
  detailedRoot.traverse((child) => {
    if (!isRenderableMesh(child)) return;

    const isBattleMesh = isRahkshiBattleLodMesh(child.name);
    if (!isBattle) {
      child.visible = !isBattleMesh;
      return;
    }

    if (!isBattleMesh) {
      child.visible = false;
      return;
    }

    if (isRahkshiBattleSpeciesMesh(child.name)) {
      child.visible = staffPrefix
        ? shouldShowRahkshiBattleSpeciesMesh(child.name, staffPrefix)
        : false;
      return;
    }

    child.visible = true;
  });
}
