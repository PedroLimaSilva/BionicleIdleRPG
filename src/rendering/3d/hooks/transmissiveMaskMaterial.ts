import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { TRANSMISSIVE_KIT_IOR, TRANSMISSIVE_KIT_THICKNESS } from './transmissiveKitMaterial';

type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

/**
 * Runtime transmission for Kaukau — matches Vahki hood clarity (0.7). GLB PBR maps
 * (baseColor, normal, metalness/roughness) and opacity stay intact; only scalars
 * below are added.
 */
export const TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION = 0.7;

function normalizeMaterialName(name: string): string {
  return name.trim().toLowerCase();
}

/** Great Rau bakes transmission + alpha in `Toa_Metru/Masks.glb` — leave GLB values intact. */
export function isKaukauTransmissiveMask(mat: MaskStandardMat): boolean {
  const name = normalizeMaterialName(mat.name);
  // Mata Kaukau ships at 0.5 opacity; Nuva Kaukau is opaque with vent holes only.
  return name.includes('kaukau_baked') && mat.opacity < 0.999;
}

function upgradeToPhysicalMaterial(mat: MaskStandardMat): MeshPhysicalMaterial {
  if (mat instanceof MeshPhysicalMaterial) return mat;
  const physical = new MeshPhysicalMaterial();
  physical.name = mat.name;
  physical.color.copy(mat.color);
  physical.emissive.copy(mat.emissive);
  physical.emissiveIntensity = mat.emissiveIntensity;
  physical.metalness = mat.metalness;
  physical.roughness = mat.roughness;
  physical.opacity = mat.opacity;
  physical.transparent = mat.transparent;
  physical.alphaTest = mat.alphaTest;
  physical.side = mat.side;
  physical.depthWrite = mat.depthWrite;
  physical.depthTest = mat.depthTest;
  physical.envMapIntensity = mat.envMapIntensity;
  physical.normalScale.copy(mat.normalScale);
  physical.map = mat.map;
  physical.normalMap = mat.normalMap;
  physical.metalnessMap = mat.metalnessMap;
  physical.roughnessMap = mat.roughnessMap;
  physical.alphaMap = mat.alphaMap;
  physical.aoMap = mat.aoMap;
  physical.aoMapIntensity = mat.aoMapIntensity;
  physical.lightMap = mat.lightMap;
  physical.lightMapIntensity = mat.lightMapIntensity;
  physical.bumpMap = mat.bumpMap;
  physical.bumpScale = mat.bumpScale;
  physical.displacementMap = mat.displacementMap;
  physical.displacementScale = mat.displacementScale;
  physical.displacementBias = mat.displacementBias;
  return physical;
}

/**
 * Add runtime transmission to Mata Kaukau. Great Rau is excluded — its GLB already
 * ships `alphaMode: BLEND` (alpha in baseColorTexture) plus `KHR_materials_transmission`
 * (transmissionTexture); `prepareClonedMaskMaterial` keeps those maps untouched.
 */
export function applyTransmissiveMaskMaterial(
  mat: MaskStandardMat
): MeshPhysicalMaterial | undefined {
  if (!isKaukauTransmissiveMask(mat)) return undefined;

  const physical = upgradeToPhysicalMaterial(mat);

  physical.transmission = TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION;
  physical.ior = TRANSMISSIVE_KIT_IOR;
  physical.thickness = TRANSMISSIVE_KIT_THICKNESS;
  physical.transparent = true;
  physical.depthWrite = false;
  physical.side = FrontSide;

  return physical;
}

export function isTransmissiveMaskMaterial(mat: unknown): boolean {
  return (
    mat instanceof MeshPhysicalMaterial && mat.transmission > 0 && isKaukauTransmissiveMask(mat)
  );
}
