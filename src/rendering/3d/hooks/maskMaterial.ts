import { Color, FrontSide, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
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
 * exports used a dedicated glow material on slot 2 (`Glow`); older bakes may
 * duplicate the body material name — split slot 2 at runtime.
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
      lensMat.name = 'Glow';
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

  if (isTransmissiveKanohiSculpt(maskSculptName)) {
    const applyTransmission = (mat: MaskStandardMat): MaskStandardMat => {
      if (isMaskGlowMaterialName(mat.name)) return mat;
      const physical = ensurePhysicalMaskMaterial(mat);
      configureTransmissiveKanohiTransmission(maskSculptName, physical);
      syncMaskTransparencyState(physical);
      return physical;
    };

    const raw = mesh.material;
    if (Array.isArray(raw)) {
      mesh.material = raw.map((mat) => (isMaskStandardMat(mat) ? applyTransmission(mat) : mat));
    } else if (isMaskStandardMat(raw)) {
      mesh.material = applyTransmission(raw);
    }
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

/** glTF transmission map or scalar factor baked into the material. */
export function maskHasBakedPbrAlpha(mat: MaskStandardMat): boolean {
  if (isMaskGlowMaterialName(mat.name)) return false;
  const physical = mat as MeshPhysicalMaterial;
  return !!(physical.transmissionMap || (physical.transmission ?? 0) > 0);
}

/**
 * Kanohi that need alpha blending (GLB `alphaMode: BLEND` or sub-1 opacity).
 * Do not infer from sculpt name — Nuva `Kaukau` is opacity 1 with vent holes only;
 * Mata `Kaukau` uses physical transmission via {@link configureKaukauTransmission}.
 */
export function maskNeedsAlphaBlend(mat: MaskStandardMat): boolean {
  // Uniform transmission (Mata Kaukau) uses the transmissive pass at opacity 1 — not alpha blend.
  // Alpha blend + depthWrite false lets interior shell tris draw over the outer surface in profile.
  if (maskUsesTransmissionRendering(mat)) return false;
  if (mat.opacity < 0.999) return true;
  if (mat.name.toLowerCase().includes('trans')) return true;
  return maskHasBakedPbrAlpha(mat);
}

/**
 * Sync transparent-pass vs opaque-pass state from the material's current opacity.
 */
/** Thin-shell transmission depth for Kanohi authored with KHR_materials_transmission (Mata Kaukau). */
export const TRANSMISSIVE_KANOHI_SHELL_THICKNESS = 0.15;

/** Mata Kaukau GLB defaults (`KHR_materials_transmission` + `KHR_materials_ior`). */
export const KAUKAU_TRANSMISSION = 0.75;
/** Great Rau — more see-through than Kaukau (no transmission map; scalar only). */
export const RAU_TRANSMISSION = 0.88;
export const KAUKAU_IOR = 1.45;

const GREAT_MASK_SUFFIX = '_Great';

/** Strip `_Great` so `Rau_Great` and `Rau` share sculpt-specific material rules. */
export function getKanohiSculptBaseName(maskSculptName: string): string {
  return maskSculptName.endsWith(GREAT_MASK_SUFFIX)
    ? maskSculptName.slice(0, -GREAT_MASK_SUFFIX.length)
    : maskSculptName;
}

export function isMataKaukauSculpt(maskSculptName: string): boolean {
  return getKanohiSculptBaseName(maskSculptName) === 'Kaukau';
}

/** Kanohi that use uniform scalar transmission (not a transmission map or alpha blend). */
export function isTransmissiveKanohiSculpt(maskSculptName: string): boolean {
  const base = getKanohiSculptBaseName(maskSculptName);
  return base === 'Kaukau' || base === 'Rau';
}

/** Upgrade standard mask materials so transmission / IOR can be configured at runtime. */
export function ensurePhysicalMaskMaterial(mat: MaskStandardMat): MeshPhysicalMaterial {
  if (mat instanceof MeshPhysicalMaterial) return mat;
  const physical = new MeshPhysicalMaterial({
    alphaMap: mat.alphaMap,
    aoMap: mat.aoMap,
    color: mat.color.clone(),
    envMap: mat.envMap,
    envMapIntensity: mat.envMapIntensity,
    map: mat.map,
    metalness: mat.metalness,
    metalnessMap: mat.metalnessMap,
    name: mat.name,
    normalMap: mat.normalMap,
    opacity: mat.opacity,
    roughness: mat.roughness,
    roughnessMap: mat.roughnessMap,
    side: mat.side,
    transparent: mat.transparent,
  });
  if (mat.emissive) {
    physical.emissive.copy(mat.emissive);
    physical.emissiveIntensity = mat.emissiveIntensity;
    physical.emissiveMap = mat.emissiveMap;
  }
  physical.userData = { ...mat.userData };
  return physical;
}

/** Scalar transmission for uniform-transmission Kanohi sculpts. */
export function transmissionForKanohiSculpt(maskSculptName: string): number {
  return getKanohiSculptBaseName(maskSculptName) === 'Rau' ? RAU_TRANSMISSION : KAUKAU_TRANSMISSION;
}

/** Keep transmissive Kanohi on physical transmission (not opacity blend). */
export function configureTransmissiveKanohiTransmission(
  maskSculptName: string,
  mat: MaskStandardMat
): void {
  if (!(mat instanceof MeshPhysicalMaterial)) return;
  mat.opacity = 1;
  if ((mat.transmission ?? 0) <= 0) {
    mat.transmission = transmissionForKanohiSculpt(maskSculptName);
  }
  mat.ior = KAUKAU_IOR;
  if (mat.thickness <= 0) {
    mat.thickness = TRANSMISSIVE_KANOHI_SHELL_THICKNESS;
  }
}

/** Kaukau-only helper; Rau uses {@link configureTransmissiveKanohiTransmission}. */
export function configureKaukauTransmission(mat: MaskStandardMat): void {
  configureTransmissiveKanohiTransmission('Kaukau', mat);
}

/**
 * Resolve GLB materials that ship both BLEND alpha and KHR_materials_transmission.
 * Mata Kaukau is authored this way; opacity blend with depthWrite disabled causes
 * self-sorting artifacts on the mask shell. Use transmission-only rendering instead.
 */
function normalizeMaskPhysicalTransparency(mat: MaskStandardMat): void {
  if (!(mat instanceof MeshPhysicalMaterial)) return;
  const transmission = mat.transmission ?? 0;
  if (mat.opacity < 0.999 && transmission > 0) {
    configureKaukauTransmission(mat);
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
    // Legacy baked transmissionMap masks: avoid back-faces and depth fighting with brain gel.
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
 * depth-occlude head geometry behind the shell. Kaukau and Rau use uniform transmission in
 * the transmissive pass with depthWrite on so the hollow shell self-occludes in profile;
 * brain gel draws after the mask in the same pass and wins depth where it sits in front.
 * Legacy baked-alpha masks and exit fades use the transparent pass. Closed shells use
 * `FrontSide` so interior back-faces do not z-fight with brain gel in the cavity.
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

/**
 * Infected Hau ships full albedo + normal + metalness/roughness bakes. Keep the
 * authored metalness map (unlike {@link applyMaskMetallicPbr}) and use glTF
 * factor 1 so the blue channel drives metalness.
 */
export function applyNuvaBakedKanohiPbr(mat: MaskStandardMat): void {
  if (isMaskGlowMaterialName(mat.name)) return;
  if (!mat.metalnessMap) return;
  mat.metalness = 1;
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
