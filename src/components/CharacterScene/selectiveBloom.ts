import { useLayoutEffect, useState } from 'react';
import { Mesh, MeshStandardMaterial, Object3D } from 'three';

import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';

/** Names that identify eye/glowing-eye/lens meshes in Matoran and Toa GLTFs (mesh or material). */
export const EYE_MESH_NAMES = ['Brain', 'Eye', 'glow', 'lens'];

function isEyeMesh(mesh: Mesh): boolean {
  const name = (mesh.name || '').toLowerCase();
  const matName = ((mesh.material as { name?: string })?.name ?? '').toLowerCase();
  return EYE_MESH_NAMES.some(
    (eye) => name.includes(eye.toLowerCase()) || matName.includes(eye.toLowerCase())
  );
}

function isInsideMasksNode(obj: Object3D): boolean {
  let parent = obj.parent;
  while (parent) {
    if (parent.name === 'Masks') return true;
    parent = parent.parent;
  }
  return false;
}

function isBloomMesh(mesh: Mesh): boolean {
  const mat = mesh.material as MeshStandardMaterial | undefined;
  if (!mat || (mat.emissiveIntensity ?? 0) <= 0) return false;
  return isEyeMesh(mesh) || isInsideMasksNode(mesh);
}

/** Collects emissive meshes (eyes + active mask materials) for selective bloom. */
function collectBloomMeshes(root: Object3D): Object3D[] {
  const collected: Object3D[] = [];
  root.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    if (isBloomMesh(obj as Mesh)) {
      collected.push(obj);
    }
  });
  return collected;
}

/** Collects eye and mask meshes that have emissive material, for selective bloom in CharacterScene. */
export function useEyeMeshes(
  characterRootRef: React.RefObject<Object3D | null>,
  matoran: BaseMatoran & RecruitedCharacterData
) {
  const [eyeMeshes, setEyeMeshes] = useState<Object3D[]>([]);

  useLayoutEffect(() => {
    const root = characterRootRef.current;
    if (!root) {
      setEyeMeshes([]);
      return;
    }
    const id = setTimeout(() => setEyeMeshes(collectBloomMeshes(root)), 0);
    return () => clearTimeout(id);
  }, [matoran, characterRootRef]);

  return eyeMeshes;
}

/** Collects all meshes with emissive material (emissiveIntensity > 0) for selective bloom. */
export function useEmissiveMeshes(
  rootRef: React.RefObject<Object3D | null>,
  deps: React.DependencyList
) {
  const [meshes, setMeshes] = useState<Object3D[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      setMeshes([]);
      return;
    }
    const id = setTimeout(() => {
      const collected: Object3D[] = [];
      root.traverse((obj) => {
        if (!(obj as Mesh).isMesh) return;
        const mesh = obj as Mesh;
        const mat = mesh.material as MeshStandardMaterial | undefined;
        if (mat && ['Eyes', 'Glow', 'Lens'].includes(mat.name)) {
          collected.push(obj);
        }
      });
      setMeshes(collected);
    }, 0);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are passed by caller; rootRef is stable
  }, [rootRef, ...deps]);

  return meshes;
}
