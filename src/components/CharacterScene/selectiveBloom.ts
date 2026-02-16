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

/** Collects only eye meshes (by name) that have emissive material, for selective bloom */
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
    const collect = () => {
      const collected: Object3D[] = [];
      root.traverse((obj) => {
        if (!(obj as Mesh).isMesh) return;
        const mesh = obj as Mesh;
        const mat = mesh.material as MeshStandardMaterial | undefined;
        if (mat && (mat.emissiveIntensity ?? 0) > 0 && isEyeMesh(mesh)) {
          collected.push(mesh);
        }
      });
      setEyeMeshes(collected);
    };
    const id = setTimeout(collect, 0);
    return () => clearTimeout(id);
  }, [matoran, characterRootRef]);

  return eyeMeshes;
}
