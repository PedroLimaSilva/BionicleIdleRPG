import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three';

export type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

export function isMaskStandardMat(mat: unknown): mat is MaskStandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/**
 * Configure a cloned mask material for runtime tinting and arena lighting.
 * Mata/Nuva mask GLBs ship metallic PBR defaults; without scene IBL (e.g. cavern
 * arenas) those surfaces read nearly black while HDRI-lit deserts look fine.
 */
export function prepareClonedMaskMaterial(mat: MaskStandardMat): void {
  mat.transparent = true;
  const isGlow = mat.name.toLowerCase().includes('glow');
  if (isGlow) return;

  mat.metalness = 0;
  mat.roughness = 0.55;
}
