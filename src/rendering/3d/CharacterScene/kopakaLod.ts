import { Mesh, Object3D, SkinnedMesh } from 'three';
import { isKopakaSheetRenderableMesh } from './kopakaSheetMeshes';

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
 * Kopaka no longer kit-assembles. Show the skinned `Body` / `Brain` / `Sword`
 * meshes and keep the Kanohi socket subtree visible for `useMask`.
 */
export function setKopakaSheetVisibility(root: Object3D): void {
  root.traverse((child) => {
    if (!isRenderableMesh(child)) return;
    if (isUnderMasks(child)) return;
    child.visible = isKopakaSheetRenderableMesh(child);
  });
}
