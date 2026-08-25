import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { getWeatheredMetalMaterial } from '../components/CharacterScene/WeatheredMetalMaterial';
import { METRU_WEATHERED } from '../game/kit/palettes/metruKitPlayerPalette';
import { metallicColorPbr } from '../game/kit/palettes/metalPbr';

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

/**
 * Configure a cloned mask material for runtime tinting and arena lighting.
 * Mata/Nuva mask GLBs ship metallic PBR defaults; without scene IBL (e.g. cavern
 * arenas) those surfaces read nearly black while HDRI-lit deserts look fine.
 *
 * Materials with authored PBR maps keep GLB scalars and textures; only transparency
 * is forced. Unmapped slots get dielectric fallbacks for low-IBL arenas.
 */
export function prepareClonedMaskMaterial(mat: MaskStandardMat): void {
  mat.transparent = true;
  if (isMaskGlowMaterialName(mat.name)) return;
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

/** Great Kanohi gold uses the same weathered-metal path as Metru kit armor. */
export function cloneGreatMaskMaterial(
  originalMat: MaskStandardMat,
  maskColor: string
): MaskStandardMat {
  if (isMaskGlowMaterialName(originalMat.name)) {
    const mat = originalMat.clone();
    prepareClonedMaskMaterial(mat);
    return mat;
  }

  const metalPbr = metallicColorPbr(maskColor);
  if (metalPbr) {
    return getWeatheredMetalMaterial(maskColor, {
      ...METRU_WEATHERED,
      ...metalPbr,
      transparent: true,
    }).clone();
  }

  const mat = originalMat.clone();
  prepareClonedMaskMaterial(mat);
  return mat;
}
