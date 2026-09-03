import {
  Color,
  FrontSide,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RGBAFormat,
} from 'three';

/** Legacy three.js `RGBFormat` (1022) — still accepted by WebGL upload for RGBA sources. */
const RGB_FORMAT = 1022 as typeof RGBAFormat;
import { KANOHI_PAINT_METALNESS, metallicColorPbr } from '../kit/palettes/metalPbr';
import { adoptBakedDiscolorationMap } from './bakedDiscoloration';

export type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

/** Emissive lenses (Akaku scope) — same scale as Nuva {@link useNuvaMask} Lens slots. */
export const MASK_LENS_GLOW_EMISSIVE_INTENSITY = 5;

export function isMaskStandardMat(mat: unknown): mat is MaskStandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

export function isMaskGlowMaterialName(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.includes('glow') || lower.includes('lens');
}

export function forEachMaskMaterial(
  mesh: Mesh,
  fn: (mat: MaskStandardMat, materialIndex: number) => void
): void {
  const raw = mesh.material;
  if (Array.isArray(raw)) {
    raw.forEach((mat, index) => {
      if (isMaskStandardMat(mat)) fn(mat, index);
    });
    return;
  }
  if (isMaskStandardMat(raw)) fn(raw, 0);
}

export function applyMaskGlowTint(
  mat: MaskStandardMat,
  glowColor: string,
  intensity = MASK_LENS_GLOW_EMISSIVE_INTENSITY
): void {
  const col = new Color(glowColor);
  if (mat.emissive) {
    mat.emissive.copy(col);
    mat.emissiveIntensity = intensity;
  }
  // Emissive-only read — full-strength albedo + high emissive blows lenses white in bloom.
  mat.color.set(0x000000);
}

/**
 * Akaku ships two material slots (body + scope lenses). Older `masks.glb`
 * exports used a dedicated glow material on slot 2 (`Kopaka Glow`); newer
 * bakes may duplicate the body material name — split slot 2 at runtime.
 */
export function ensureAkakuLensMaterialSlot(mesh: Mesh): void {
  const { groups } = mesh.geometry;
  if (groups.length < 2) return;

  const raw = mesh.material;
  const bodySource = Array.isArray(raw) ? raw[0] : raw;
  if (!isMaskStandardMat(bodySource)) return;

  const lensIndex = 1;
  const materials: MaskStandardMat[] = Array.isArray(raw)
    ? raw.filter(isMaskStandardMat)
    : [bodySource];

  if (materials.length === 0) return;

  const bodyMat = materials[0].clone();
  prepareClonedMaskMaterial(bodyMat);

  let lensMat = materials[lensIndex];
  if (!lensMat || !isMaskGlowMaterialName(lensMat.name)) {
    lensMat = bodySource.clone();
    if (!isMaskGlowMaterialName(lensMat.name)) {
      lensMat.name = 'Lens';
    }
    prepareClonedMaskMaterial(lensMat);
  } else {
    lensMat = lensMat.clone();
    prepareClonedMaskMaterial(lensMat);
  }

  mesh.material = [bodyMat, lensMat];
  for (let i = 0; i < groups.length; i++) {
    groups[i].materialIndex = Math.min(i, 1);
  }
}

export function cloneMaskMeshMaterials(mesh: Mesh, maskSculptName: string): void {
  const raw = mesh.material;
  if (Array.isArray(raw)) {
    mesh.material = raw.map((mat) => {
      if (!isMaskStandardMat(mat)) return mat;
      const clone = mat.clone();
      prepareClonedMaskMaterial(clone);
      return clone;
    });
  } else if (isMaskStandardMat(raw)) {
    const clone = raw.clone();
    prepareClonedMaskMaterial(clone);
    mesh.material = clone;
  }

  if (maskSculptName === 'Akaku') {
    ensureAkakuLensMaterialSlot(mesh);
  }

  if (isMataKaukauSculpt(maskSculptName)) {
    forEachMaskMaterial(mesh, (mat) => {
      configureKaukauTransmission(mat);
      syncMaskTransparencyState(mat);
    });
  }
}

/**
 * Mask GLBs may ship baked normal / roughness / metalness maps. Normal and
 * roughness stay on the material; metalness maps are dropped in
 * {@link applyMaskMetallicPbr}.
 */
export function hasMaskPbrMaps(mat: MaskStandardMat): boolean {
  return !!(mat.normalMap || mat.roughnessMap || mat.metalnessMap);
}

/** glTF transmission baked into PBR maps (e.g. Great Rau in `Toa_Metru/Masks.glb`). */
export function maskHasBakedPbrAlpha(mat: MaskStandardMat): boolean {
  if (isMaskGlowMaterialName(mat.name)) return false;
  const physical = mat as MeshPhysicalMaterial;
  return !!(physical.transmissionMap || (physical.transmission ?? 0) > 0);
}

function maskHasPhysicalTransmission(mat: MeshPhysicalMaterial): boolean {
  return (mat.transmission ?? 0) > 0 || !!mat.transmissionMap;
}

/**
 * Kanohi that need the transparent render pass (physical transmission or opacity fade).
 * Do not infer from sculpt name — Nuva `Kaukau` is opacity 1 with vent holes only;
 * Mata `Kaukau` and Great Rau use physical transmission via {@link configureTransmissiveKanohi}.
 */
export function maskNeedsAlphaBlend(mat: MaskStandardMat): boolean {
  if (mat instanceof MeshPhysicalMaterial && maskHasPhysicalTransmission(mat)) return true;
  if (mat.opacity < 0.999) return true;
  if (mat.name.toLowerCase().includes('trans')) return true;
  return maskHasBakedPbrAlpha(mat);
}

/** Thin-shell transmission depth for Kanohi authored with KHR_materials_transmission. */
export const TRANSMISSIVE_KANOHI_SHELL_THICKNESS = 0.15;

/** Mata Kaukau GLB defaults (`KHR_materials_transmission` + `KHR_materials_ior`). */
export const KAUKAU_TRANSMISSION = 0.75;
export const KAUKAU_IOR = 1.45;

export function isMataKaukauSculpt(maskSculptName: string): boolean {
  return maskSculptName === 'Kaukau';
}

/** Ignore baked alpha in baseColorTexture — transmissionMap drives translucency. */
function stripBaseColorMapAlpha(mat: MeshPhysicalMaterial): void {
  const map = mat.map;
  if (!map || map.format !== RGBAFormat) return;
  const rgbMap = map.clone();
  rgbMap.format = RGB_FORMAT;
  mat.map = rgbMap;
}

/**
 * Keep transmissive Kanohi on physical transmission (not opacity blend).
 * Mata Kaukau and Great Rau ship both BLEND alpha and KHR_materials_transmission;
 * dual-mode rendering causes self-sorting artifacts against brain gel and the shell.
 */
export function configureTransmissiveKanohi(
  mat: MaskStandardMat,
  fallbackTransmission = KAUKAU_TRANSMISSION
): void {
  if (!(mat instanceof MeshPhysicalMaterial)) return;
  mat.opacity = 1;
  if ((mat.transmission ?? 0) <= 0 && !mat.transmissionMap) {
    mat.transmission = fallbackTransmission;
  }
  mat.ior = KAUKAU_IOR;
  if (mat.thickness <= 0) {
    mat.thickness = TRANSMISSIVE_KANOHI_SHELL_THICKNESS;
  }
  stripBaseColorMapAlpha(mat);
}

/** @deprecated Prefer {@link configureTransmissiveKanohi} — kept for Mata Kaukau sculpt hook. */
export function configureKaukauTransmission(mat: MaskStandardMat): void {
  configureTransmissiveKanohi(mat, KAUKAU_TRANSMISSION);
}

/** Resolve GLB materials that ship both BLEND alpha and KHR_materials_transmission. */
function normalizeMaskPhysicalTransparency(mat: MaskStandardMat): void {
  if (!(mat instanceof MeshPhysicalMaterial)) return;
  if (maskHasPhysicalTransmission(mat)) {
    configureTransmissiveKanohi(mat);
    return;
  }
  if (mat.opacity < 0.999) {
    mat.transmission = 0;
    mat.transmissionMap = null;
  }
}

export function maskUsesTransmissionRendering(mat: MaskStandardMat): boolean {
  return mat instanceof MeshPhysicalMaterial && (mat.transmission ?? 0) > 0 && mat.opacity >= 0.999;
}

export function syncMaskTransparencyState(mat: MaskStandardMat): void {
  if (isMaskGlowMaterialName(mat.name)) {
    mat.transparent = true;
    mat.depthWrite = false;
    return;
  }

  normalizeMaskPhysicalTransparency(mat);

  const alphaBlend = maskNeedsAlphaBlend(mat);
  mat.transparent = alphaBlend;

  if (alphaBlend) {
    // Transmission Kanohi (Kaukau, Great Rau): avoid back-faces and depth fighting with brain gel.
    mat.depthWrite = false;
    mat.side = FrontSide;
    return;
  }

  mat.side = FrontSide;
  mat.depthWrite = true;
}

/**
 * Configure a cloned mask material for runtime tinting and arena lighting.
 * Mata/Nuva mask GLBs ship metallic PBR defaults; without scene IBL (e.g. cavern
 * arenas) those surfaces read nearly black while HDRI-lit deserts look fine.
 *
 * Opaque Kanohi stay in the opaque render pass (`transparent: false`) so they
 * depth-occlude transmissive brain gel. Translucent masks (Mata Kaukau / Great Rau
 * transmission, exit fades) use the transparent pass. Closed shells use `FrontSide`
 * so interior back-faces do not z-fight with brain gel in the mask cavity.
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
 * Kanohi keep baked normal / roughness maps. Metalness maps are dropped: current
 * bakes are edge-only (near-black on flats), and glTF `metallicFactor` defaults
 * to 1, so those maps make painted Kanohi read as bright dielectric plastic.
 * Gold uses {@link metallicColorPbr}; every other color uses painted-metal
 * {@link KANOHI_PAINT_METALNESS} so albedo stays rich while roughness maps
 * still supply micro-detail.
 */
export function applyMaskMetallicPbr(mat: MaskStandardMat, maskColor: string): void {
  if (isMaskGlowMaterialName(mat.name)) return;

  if (mat.metalnessMap) mat.metalnessMap = null;

  const metalPbr = metallicColorPbr(maskColor);
  if (metalPbr) {
    if (metalPbr.metalness !== undefined) mat.metalness = metalPbr.metalness;
    if (metalPbr.roughness !== undefined) mat.roughness = metalPbr.roughness;
    if (metalPbr.envMapIntensity !== undefined) mat.envMapIntensity = metalPbr.envMapIntensity;
    return;
  }

  mat.metalness = KANOHI_PAINT_METALNESS;
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
