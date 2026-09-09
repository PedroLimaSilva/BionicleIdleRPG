import { Mesh, Object3D, SkinnedMesh } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import {
  isRahkshiBattleRenderableMesh,
  isRahkshiBattleSpeciesMesh,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';
import { isRahkshiVariantMesh, shouldShowRahkshiVariantMesh } from './rahkshiVariantMeshes';

function isRenderableMesh(child: Object3D): child is Mesh {
  const mesh = child as Mesh;
  return mesh.isMesh === true || (child as SkinnedMesh).isSkinnedMesh === true;
}

export function collectMeshUuids(root: Object3D): Set<string> {
  const uuids = new Set<string>();
  root.traverse((child) => {
    if (isRenderableMesh(child)) uuids.add(child.uuid);
  });
  return uuids;
}

export function collectRahkshiBattleMeshUuids(root: Object3D): Set<string> {
  const uuids = new Set<string>();
  root.traverse((child) => {
    if (isRenderableMesh(child) && isRahkshiBattleRenderableMesh(child)) {
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
 * Drop detailed / kit meshes from a combat clone so the mixer, shadow
 * traverse, and GPU only see battle LOD. Bones and empty sockets stay.
 */
export function pruneRahkshiBattleClone(root: Object3D): void {
  const toRemove: Object3D[] = [];
  root.traverse((child) => {
    if (!isRenderableMesh(child)) return;
    if (!isRahkshiBattleRenderableMesh(child)) {
      toRemove.push(child);
    }
  });
  for (const mesh of toRemove) {
    mesh.parent?.remove(mesh);
  }
}

/** Toggle detailed vs battle meshes via `visible`; species overlays follow staff prefix in battle mode. */
export function setRahkshiLodVisibility(
  detailedRoot: Object3D,
  variant: RahkshiMeshVariant,
  staffPrefix?: string
): void {
  const isBattle = variant === 'battle';
  detailedRoot.traverse((child) => {
    if (!isRenderableMesh(child)) return;

    const isBattleMesh = isRahkshiBattleRenderableMesh(child);
    if (!isBattle) {
      if (isBattleMesh) {
        child.visible = false;
        return;
      }

      if (isRahkshiVariantMesh(child.name)) {
        child.visible = staffPrefix ? shouldShowRahkshiVariantMesh(child.name, staffPrefix) : false;
        return;
      }

      child.visible = true;
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
