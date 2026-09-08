import { Camera, Mesh, Object3D, SkinnedMesh } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import {
  isRahkshiBattleLodMesh,
  isRahkshiBattleSpeciesMesh,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';

/** Camera layer for baked meshes, kit attach, and variant overlays. */
export const RAHKSHI_DETAILED_LAYER = 0;

/** Camera layer for `Battle_*` meshes on the single `Rahkshi` armature. */
export const RAHKSHI_BATTLE_LAYER = 1;

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

/** Assign render layers once per mesh — camera mask picks the active LOD. */
export function tagRahkshiLodLayers(root: Object3D): void {
  root.traverse((child) => {
    if (!isRenderableMesh(child)) return;
    child.layers.set(
      isRahkshiBattleLodMesh(child.name) ? RAHKSHI_BATTLE_LAYER : RAHKSHI_DETAILED_LAYER
    );
  });
}

/** Kit clones attach after the rig is tagged — keep them on the detailed layer. */
export function tagDetailedLayer(root: Object3D): void {
  root.traverse((child) => {
    if (isRenderableMesh(child)) child.layers.set(RAHKSHI_DETAILED_LAYER);
  });
}

export function applyRahkshiLodCameraLayers(camera: Camera, variant: RahkshiMeshVariant): void {
  camera.layers.disableAll();
  camera.layers.enable(variant === 'battle' ? RAHKSHI_BATTLE_LAYER : RAHKSHI_DETAILED_LAYER);
}

export function resetRahkshiLodCameraLayers(camera: Camera): void {
  camera.layers.disableAll();
  camera.layers.enable(RAHKSHI_DETAILED_LAYER);
}

/**
 * Species overlays share the battle camera layer — hide non-active breeds via `visible`.
 * Body/glow visibility stays on; the camera layer gate handles detailed vs battle.
 */
export function setRahkshiBattleSpeciesVisibility(
  detailedRoot: Object3D,
  variant: RahkshiMeshVariant,
  staffPrefix?: string
): void {
  if (variant !== 'battle') {
    detailedRoot.traverse((child) => {
      if (isRenderableMesh(child) && isRahkshiBattleSpeciesMesh(child.name)) {
        child.visible = false;
      }
    });
    return;
  }

  detailedRoot.traverse((child) => {
    if (!isRenderableMesh(child) || !isRahkshiBattleSpeciesMesh(child.name)) return;
    child.visible = staffPrefix
      ? shouldShowRahkshiBattleSpeciesMesh(child.name, staffPrefix)
      : false;
  });
}

/** @deprecated Use tagRahkshiLodLayers + applyRahkshiLodCameraLayers. Kept for unit tests. */
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
