import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { metallicColorPbr } from '../kit/palettes/metalPbr';

export type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

export function isMaskStandardMat(mat: unknown): mat is MaskStandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

export function isMaskGlowMaterialName(name: string): boolean {
  return name.toLowerCase().includes('glow');
}

/** Mask GLBs may ship baked normal / roughness / metalness maps — keep them intact. */
export function hasMaskPbrMaps(mat: MaskStandardMat): boolean {
  return !!(mat.normalMap || mat.roughnessMap || mat.metalnessMap);
}

/** Kaukau and similar Kanohi need alpha blending (GLB `alphaMode: BLEND`). */
export function maskNeedsAlphaBlend(mat: MaskStandardMat): boolean {
  if (mat.opacity < 0.999) return true;
  const name = mat.name.toLowerCase();
  return name.includes('kaukau') || name.includes('trans');
}

/**
 * Configure a cloned mask material for runtime tinting and arena lighting.
 * Mata/Nuva mask GLBs ship metallic PBR defaults; without scene IBL (e.g. cavern
 * arenas) those surfaces read nearly black while HDRI-lit deserts look fine.
 *
 * Opaque Kanohi stay in the opaque render pass (`transparent: false`) so they
 * depth-occlude transmissive brain gel. Only translucent masks and exit fades
 * use alpha blending. Closed shells use `FrontSide` so interior back-faces do
 * not z-fight with brain gel in the mask cavity.
 */
export function prepareClonedMaskMaterial(mat: MaskStandardMat): void {
  if (isMaskGlowMaterialName(mat.name)) {
    mat.transparent = true;
    return;
  }

  const alphaBlend = maskNeedsAlphaBlend(mat);
  mat.transparent = alphaBlend;

  if (!alphaBlend) {
    mat.side = FrontSide;
    mat.depthWrite = true;
  }

  if (hasMaskPbrMaps(mat)) return;

  mat.metalness = 0;
  mat.roughness = 0.55;
}

/**
 * Boost metallic LEGO mask colors (gold) beyond baked PBR map metalness.
 * Great/Mata Kanohi keep normal/roughness maps; the metalness map is dropped
 * so scalar metalness applies fully (baked maps usually encode dielectric plastic).
 */
export function applyMaskMetallicPbr(mat: MaskStandardMat, maskColor: string): void {
  if (isMaskGlowMaterialName(mat.name)) return;

  const metalPbr = metallicColorPbr(maskColor);
  if (!metalPbr) return;

  if (mat.metalnessMap) mat.metalnessMap = null;

  if (metalPbr.metalness !== undefined) mat.metalness = metalPbr.metalness;
  if (metalPbr.roughness !== undefined) mat.roughness = metalPbr.roughness;
  if (metalPbr.envMapIntensity !== undefined) mat.envMapIntensity = metalPbr.envMapIntensity;
}

/** Clone a Great Kanohi material for per-instance tinting (same path as Mata masks). */
export function cloneGreatMaskMaterial(
  originalMat: MaskStandardMat,
  _maskColor: string
): MaskStandardMat {
  const mat = originalMat.clone();
  prepareClonedMaskMaterial(mat);
  return mat;
}
