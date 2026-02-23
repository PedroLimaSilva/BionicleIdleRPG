import { useEffect } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../types/Matoran';
import { useGame } from '../context/Game';
import { getEffectiveNuvaMaskColor } from '../game/maskColor';

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

const MASK_NAMES = [
  Mask.HauNuva,
  Mask.KaukauNuva,
  Mask.KakamaNuva,
  Mask.AkakuNuva,
  Mask.PakariNuva,
  Mask.MiruNuva,
  Mask.Akaku,
  Mask.Miru,
  Mask.Kakama,
  Mask.Kaukau,
  Mask.Hau,
];

function isMaskName(name: string): boolean {
  return Object.values(MASK_NAMES).includes(name as unknown as Mask);
}

function isMaskMaterial(mat: { name?: string }, meshName?: string): boolean {
  const matName = mat.name ?? '';
  const mesh = meshName ?? '';
  return isMaskName(mesh) || isMaskName(matName);
}

/**
 * Applies mask color to the Toa Nuva model's baked-in mask.
 * Does NOT use useMask (Mata masks.glb) — Nuva will eventually load its own masks file.
 * For now, only changes the color of mask materials in the given model root.
 * Nuva masks do not have glow materials (unlike Mata Akaku).
 * No cloning needed: mask has its own material and mesh; no Toa appears twice with different colors.
 */
export function useNuvaMask(
  modelRoot: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData
) {
  const { completedQuests } = useGame();
  const maskColor = getEffectiveNuvaMaskColor(matoran, completedQuests);

  useEffect(() => {
    if (!modelRoot) return;

    modelRoot.traverse((child) => {
      if (!(child as Mesh).isMesh) return;
      const mesh = child as Mesh;
      const mat = mesh.material;
      if (!isStandardMat(mat) || !isMaskMaterial(mat, mesh.name)) return;

      mat.color.copy(new Color(maskColor));
    });
  }, [modelRoot, maskColor]);
}
