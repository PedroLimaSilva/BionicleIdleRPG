import { MeshStandardMaterial, Object3D } from 'three';

import { Mesh } from 'three';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { useLayoutEffect, useState } from 'react';

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

