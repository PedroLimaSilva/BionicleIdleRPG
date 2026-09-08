import { Mesh, Object3D, SkinnedMesh } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import {
  isRahkshiBattleLodMesh,
  isRahkshiBattleRenderableMesh,
  isRahkshiBattleSpeciesMesh,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';
import { logRahkshiLodMeshVisibilityChange } from './rahkshiLodDebug';

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

/** Toggle detailed vs battle meshes via `visible`; species overlays follow staff prefix in battle mode. */
export function setRahkshiLodVisibility(
  detailedRoot: Object3D,
  variant: RahkshiMeshVariant,
  staffPrefix?: string,
  source = 'setRahkshiLodVisibility'
): void {
  const isBattle = variant === 'battle';
  detailedRoot.traverse((child) => {
    if (!isRenderableMesh(child)) return;

    const isBattleMesh = isRahkshiBattleRenderableMesh(child);
    if (!isBattle) {
      const nextVisible = !isBattleMesh;
      logRahkshiLodMeshVisibilityChange(source, child, nextVisible, {
        variant,
        isBattleMesh,
      });
      child.visible = nextVisible;
      return;
    }

    if (!isBattleMesh) {
      logRahkshiLodMeshVisibilityChange(source, child, false, { variant, isBattleMesh });
      child.visible = false;
      return;
    }

    if (isRahkshiBattleSpeciesMesh(child.name)) {
      const nextVisible = staffPrefix
        ? shouldShowRahkshiBattleSpeciesMesh(child.name, staffPrefix)
        : false;
      logRahkshiLodMeshVisibilityChange(source, child, nextVisible, {
        variant,
        staffPrefix,
        isBattleMesh,
      });
      child.visible = nextVisible;
      return;
    }

    logRahkshiLodMeshVisibilityChange(source, child, true, { variant, isBattleMesh });
    child.visible = true;
  });
}
