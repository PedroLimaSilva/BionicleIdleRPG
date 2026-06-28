import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three';

export type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

export function isMaskStandardMat(mat: unknown): mat is MaskStandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

export type PrepareClonedMaskMaterialOptions = {
  /**
   * When true, force dielectric shading so masks read under low-IBL cavern arenas.
   * Character detail scenes keep GLB metallic defaults under the city HDRI.
   */
  normalizeForArena?: boolean;
};

/**
 * Configure a cloned mask material for runtime tinting and optional arena lighting.
 * Mata/Nuva mask GLBs ship metallic PBR defaults; without scene IBL (e.g. cavern
 * arenas) those surfaces read nearly black while HDRI-lit deserts look fine.
 */
export function prepareClonedMaskMaterial(
  mat: MaskStandardMat,
  options: PrepareClonedMaskMaterialOptions = {}
): void {
  mat.transparent = true;
  const isGlow = mat.name.toLowerCase().includes('glow');
  if (isGlow) return;

  if (!options.normalizeForArena) return;

  mat.metalness = 0;
  mat.roughness = 0.55;
}
