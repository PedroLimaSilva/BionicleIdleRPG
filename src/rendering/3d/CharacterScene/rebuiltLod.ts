import { Mesh, Object3D, SkinnedMesh } from 'three';
import { isRebuiltSheetRenderableMesh } from './rebuiltSheetMeshes';

function isRenderableMesh(child: Object3D): child is Mesh {
  const mesh = child as Mesh;
  return mesh.isMesh === true || (child as SkinnedMesh).isSkinnedMesh === true;
}

function isUnderMasks(obj: Object3D): boolean {
  for (let parent: Object3D | null = obj; parent; parent = parent.parent) {
    if (parent.name === 'Masks') return true;
  }
  return false;
}

/**
 * Rebuilt no longer kit-assembles. Show the packed `Body` / `Brain`
 * meshes and keep the Kanohi socket subtree visible for `useMask`.
 */
export function setRebuiltSheetVisibility(root: Object3D): void {
  root.traverse((child) => {
    if (!isRenderableMesh(child)) return;
    if (isUnderMasks(child)) return;
    child.visible = isRebuiltSheetRenderableMesh(child);
  });
}
