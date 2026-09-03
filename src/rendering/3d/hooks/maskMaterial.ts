import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { metallicColorPbr } from '../kit/palettes/metalPbr';
import { adoptBakedDiscolorationMap } from './bakedDiscoloration';

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

/** glTF alpha/transmission baked into PBR maps (e.g. Great Rau in `Masks.glb`). */
export function maskHasBakedPbrAlpha(mat: MaskStandardMat): boolean {
  if (isMaskGlowMaterialName(mat.name)) return false;
  const physical = mat as MeshPhysicalMaterial;
  return !!(physical.transmissionMap || (physical.transmission ?? 0) > 0);
}

/**
 * Kanohi that need alpha blending (GLB `alphaMode: BLEND` or sub-1 opacity).
 * Do not infer from sculpt name — Nuva `Kaukau` is opacity 1 with vent holes only;
 * Mata `Kaukau` ships at 0.5 opacity and still blends correctly via the opacity check.
 */
export function maskNeedsAlphaBlend(mat: MaskStandardMat): boolean {
  if (mat.opacity < 0.999) return true;
  if (mat.name.toLowerCase().includes('trans')) return true;
  return maskHasBakedPbrAlpha(mat);
}

/**
 * Sync transparent-pass vs opaque-pass state from the material's current opacity.
 */
export function syncMaskTransparencyState(mat: MaskStandardMat): void {
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
  syncMaskTransparencyState(mat);
  if (isMaskGlowMaterialName(mat.name)) return;

  adoptBakedDiscolorationMap(mat);

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
