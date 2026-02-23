import { useEffect, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { BaseMatoran, RecruitedCharacterData } from '../types/Matoran';
import { useGame } from '../context/Game';
import { getEffectiveNuvaMaskColor } from '../game/maskColor';

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

function isMaskMaterial(mat: { name?: string }, meshName?: string): boolean {
  const name = (mat.name ?? '').toLowerCase();
  const mesh = (meshName ?? '').toLowerCase();
  return name.includes('mask') || mesh.includes('mask');
}

/**
 * Applies mask color to the Toa Nuva model's baked-in mask.
 * Does NOT use useMask (Mata masks.glb) — Nuva will eventually load its own masks file.
 * For now, only changes the color of mask materials in the given model root.
 * Nuva masks do not have glow materials (unlike Mata Akaku).
 */
export function useNuvaMask(
  modelRoot: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData
) {
  const { completedQuests } = useGame();
  const maskColor = getEffectiveNuvaMaskColor(matoran, completedQuests);
  const clonedMaterialsRef = useRef<Map<string, StandardMat>>(new Map());

  useEffect(() => {
    if (!modelRoot) return;

    modelRoot.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      const mat = mesh.material;
      if (!isStandardMat(mat) || !isMaskMaterial(mat, mesh.name)) return;

      let targetMat = clonedMaterialsRef.current.get(mesh.uuid);
      if (!targetMat) {
        targetMat = mat.clone();
        clonedMaterialsRef.current.set(mesh.uuid, targetMat);
        mesh.material = targetMat;
      }

      targetMat.color.copy(new Color(maskColor));
    });
  }, [modelRoot, maskColor]);
}
