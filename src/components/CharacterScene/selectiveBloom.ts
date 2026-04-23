import { useLayoutEffect, useState, type DependencyList, type RefObject } from 'react';
import { Mesh, MeshStandardMaterial, Object3D } from 'three';

import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';

/** Names that identify eye/glowing-eye/lens meshes in Matoran and Toa GLTFs (mesh or material). */
export const EYE_MESH_NAMES = ['Brain', 'Eye', 'glow', 'lens'];

function isInsideMasksNode(obj: Object3D): boolean {
  let parent = obj.parent;
  while (parent) {
    if (parent.name === 'Masks') return true;
    parent = parent.parent;
  }
  return false;
}

function isBloomMesh(mesh: Mesh): boolean {
  const raw = mesh.material;
  const mats = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const meshName = (mesh.name || '').toLowerCase();

  for (const m of mats) {
    const mat = m as MeshStandardMaterial | undefined;
    if (!mat || (mat.emissiveIntensity ?? 0) <= 0) continue;

    const matName = (mat.name || '').toLowerCase();
    const eyeLike = EYE_MESH_NAMES.some((eye) => meshName.includes(eye) || matName.includes(eye));
    if (eyeLike || matName.includes('glow') || isInsideMasksNode(mesh)) return true;
  }
  return false;
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

/**
 * Meshes under the character root that should receive selective bloom (eyes,
 * mask emissive, glow-named materials, etc.).
 *
 * `sceneRevision`: increment to re-scan after the scene graph changes (e.g. kit
 * GLB clones attach). If negative, skips collection until the revision is 0 or
 * greater (rigs with no bloom meshes until kit attach).
 */
export function useCharacterBloomMeshes(
  characterRootRef: RefObject<Object3D | null>,
  matoran: BaseMatoran & RecruitedCharacterData,
  sceneRevision = 0
) {
  const [bloomMeshes, setBloomMeshes] = useState<Object3D[]>([]);

  useLayoutEffect(() => {
    const root = characterRootRef.current;
    if (!root) {
      setBloomMeshes([]);
      return;
    }
    if (sceneRevision < 0) {
      setBloomMeshes([]);
      return;
    }
    const id = setTimeout(() => setBloomMeshes(collectBloomMeshes(root)), 0);
    return () => clearTimeout(id);
  }, [matoran, characterRootRef, sceneRevision]);

  return bloomMeshes;
}

/** Collects all meshes with emissive material (emissiveIntensity > 0) for selective bloom. */
export function useEmissiveMeshes(
  rootRef: RefObject<Object3D | null>,
  deps: DependencyList
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
