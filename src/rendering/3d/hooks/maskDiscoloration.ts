import { Box3, Color, Mesh, Object3D } from 'three';
import {
  float,
  materialColor,
  materialMetalness,
  materialReference,
  materialRoughness,
  mix,
  mrt,
  positionLocal,
  uniform,
} from 'three/tsl';
import { applySelectiveBloomMrt, clearSelectiveBloomMrt } from '../CharacterScene/selectiveBloom';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  bakedDiscolorationAmountFromMaterial,
  bakedDiscolorationColorFromMaterial,
  createBakedDiscolorationUniforms,
  DISCOLORATION_UNIFORMS_KEY,
  getBakedDiscolorationMap,
  writeBakedDiscolorationUserData,
  type BakedDiscolorationUniforms,
} from './bakedDiscoloration';
import {
  forEachMaskMaterial,
  isMaskGlowMaterialName,
  maskUsesTransmissionRendering,
  type MaskStandardMat,
} from './maskMaterial';
import { setUniformColor, setUniformNumber } from './tslUniforms';

/** Vertical crown tint for Metru double-injected Kanohi (silver-gray top → mask color bottom). */
export type MaskDiscoloration = {
  color: string;
  /** Blend toward `color` at the top of the mask (0 = none, 1 = full at crown). */
  intensity: number;
  /** PBR metalness at the crown. */
  metalness?: number;
  /** PBR roughness at the crown. */
  roughness?: number;
};

const DISCOLOR_UNIFORMS_KEY = 'discolorationUniforms';

const DEFAULT_DISCOLOR_METALNESS = 0.9;
const DEFAULT_DISCOLOR_ROUGHNESS = 0.22;

function createCrownDiscolorationUniforms(minY: number, maxY: number) {
  return {
    color: uniform(new Color(0xffffff)),
    intensity: uniform(0),
    maxY: uniform(maxY),
    metalness: uniform(DEFAULT_DISCOLOR_METALNESS),
    minY: uniform(minY),
    roughness: uniform(DEFAULT_DISCOLOR_ROUGHNESS),
  };
}

type CrownDiscolorationUniforms = ReturnType<typeof createCrownDiscolorationUniforms>;

type MaskTslMaterial = MaskStandardMat & {
  colorNode?: unknown;
  emissiveNode?: unknown;
  metalnessNode?: unknown;
  mrtNode?: unknown;
  roughnessNode?: unknown;
};

/** Modest Kanohi body emission while a mask power is active; bloom supplies the halo. */
export const MASK_POWER_EMISSIVE_INTENSITY = 1;

const MASK_POWER_UNIFORMS_KEY = 'maskPowerUniforms';

function floatRef(path: string): never {
  return materialReference(path, 'float') as never;
}

function colorRef(path: string): never {
  return materialReference(path, 'color') as never;
}

const crownColorRef = colorRef('userData.discolorationUniforms.color.value');
const crownIntensityRef = floatRef('userData.discolorationUniforms.intensity.value');
const crownMaxYRef = floatRef('userData.discolorationUniforms.maxY.value');
const crownMetalnessRef = floatRef('userData.discolorationUniforms.metalness.value');
const crownMinYRef = floatRef('userData.discolorationUniforms.minY.value');
const crownRoughnessRef = floatRef('userData.discolorationUniforms.roughness.value');
const powerBloomRef = floatRef('userData.maskPowerUniforms.bloomIntensity.value');
const powerColorRef = colorRef('userData.maskPowerUniforms.color.value');
const powerIntensityRef = floatRef('userData.maskPowerUniforms.intensity.value');

const bakedAmt = bakedDiscolorationAmountFromMaterial() as never;
const crownRange = float(0).add(crownMaxYRef).sub(crownMinYRef).max(1e-5);
const crownAmt = positionLocal.y
  .sub(crownMinYRef)
  .div(crownRange)
  .clamp(0, 1)
  .mul(crownIntensityRef);
const afterBake = mix(materialColor, bakedDiscolorationColorFromMaterial() as never, bakedAmt);
const maskColorNode = mix(afterBake, crownColorRef, crownAmt as never);
/** No bake sample in the graph — matches master `float(0)` mix amount. */
const maskColorNodeNoBake = mix(materialColor, crownColorRef, crownAmt as never);
const maskEmissiveNode = float(1).mul(powerColorRef).mul(powerIntensityRef);
const maskMrtNode = mrt({ bloomIntensity: powerBloomRef });
const maskMetalnessNode = mix(materialMetalness, crownMetalnessRef, crownAmt as never);
const maskRoughnessNode = mix(materialRoughness, crownRoughnessRef, crownAmt as never);

/**
 * Patch non-glow mask materials:
 * - baked grayscale `emissiveMap` → color-specific edge discoloration
 * - optional object-space vertical gradient for Metru double-injected Kanohi
 */
export function setupMaskDiscolorationShader(root: Object3D, baseColor = '#ffffff'): void {
  const box = new Box3();
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const geom = (child as Mesh).geometry;
      if (!geom.boundingBox) geom.computeBoundingBox();
      if (geom.boundingBox) box.union(geom.boundingBox);
    }
  });

  const minY = box.isEmpty() ? 0 : box.min.y;
  const maxY = box.isEmpty() ? 1 : box.max.y;

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    forEachMaskMaterial(child as Mesh, (mat) => {
      if (isMaskGlowMaterialName(mat.name)) return;
      attachDiscolorationShader(mat, minY, maxY, baseColor);
    });
  });
}

function createMaskPowerUniforms() {
  return {
    bloomIntensity: uniform(0),
    color: uniform(new Color(0x000000)),
    intensity: uniform(0),
  };
}

type MaskPowerUniforms = ReturnType<typeof createMaskPowerUniforms>;

function attachDiscolorationShader(
  mat: MaskStandardMat,
  minY: number,
  maxY: number,
  baseColor: string
): void {
  const map = adoptBakedDiscolorationMap(mat);
  mat.emissive.set(0, 0, 0);
  mat.emissiveIntensity = 0;
  writeBakedDiscolorationUserData(mat, map, baseColor);
  const baked = createBakedDiscolorationUniforms(map, baseColor);
  const crown = createCrownDiscolorationUniforms(minY, maxY);
  const power = createMaskPowerUniforms();

  mat.userData[DISCOLOR_UNIFORMS_KEY] = crown;
  mat.userData[DISCOLORATION_UNIFORMS_KEY] = baked;
  mat.userData[MASK_POWER_UNIFORMS_KEY] = power;

  const tslMat = mat as MaskTslMaterial;
  tslMat.colorNode = map ? maskColorNode : maskColorNodeNoBake;
  // Keep power and bloom in the graph from the first compile so toggling
  // later does not require a program rebuild. Bindings come from this
  // material's userData via materialReference — do not close over textures
  // or UniformNode instances (that made every Kanohi share Tahu's Hau).
  tslMat.emissiveNode = maskEmissiveNode;
  tslMat.mrtNode = maskMrtNode;
  if (!maskUsesTransmissionRendering(mat)) {
    // Frosted Kaukau / Rau must keep scalar metalness 0. A metalnessNode graph
    // that doesn't stay at 0 makes WebGPU skip the transmission lobe.
    tslMat.metalnessNode = maskMetalnessNode;
    tslMat.roughnessNode = maskRoughnessNode;
  }
  const programKey = `mask_discolor|tx${maskUsesTransmissionRendering(mat) ? 1 : 0}|dc${map ? 1 : 0}`;
  mat.customProgramCacheKey = () => programKey;
  mat.needsUpdate = true;
}

/** Drive Kanohi body emission from mask color. Bake maps stay on albedo, not light. */
export function applyMaskPowerEmissive(
  mat: MaskStandardMat,
  colorHex: string,
  active: boolean | undefined
): void {
  if (!mat.emissive) return;
  const on = Boolean(active);
  const intensity = on ? MASK_POWER_EMISSIVE_INTENSITY : 0;
  if (on) {
    mat.emissive.set(colorHex);
  } else {
    mat.emissive.set(0x000000);
  }
  mat.emissiveIntensity = intensity;

  const power = mat.userData[MASK_POWER_UNIFORMS_KEY] as MaskPowerUniforms | undefined;
  if (power) {
    setUniformColor(power.color, on ? colorHex : 0x000000);
    setUniformNumber(power.intensity, intensity);
    setUniformNumber(power.bloomIntensity, on ? 1 : 0);
    return;
  }

  if (on) {
    applySelectiveBloomMrt(mat);
  } else {
    clearSelectiveBloomMrt(mat);
  }
}

/** Push runtime discoloration settings into patched mask materials. */
export function applyMaskDiscolorationUniforms(
  mat: MaskStandardMat,
  discoloration: MaskDiscoloration | undefined,
  baseColor?: string
): void {
  const crown = mat.userData[DISCOLOR_UNIFORMS_KEY] as CrownDiscolorationUniforms | undefined;
  if (crown) {
    if (discoloration && discoloration.intensity > 0) {
      setUniformColor(crown.color, discoloration.color);
      setUniformNumber(crown.intensity, discoloration.intensity);
      setUniformNumber(crown.metalness, discoloration.metalness ?? DEFAULT_DISCOLOR_METALNESS);
      setUniformNumber(crown.roughness, discoloration.roughness ?? DEFAULT_DISCOLOR_ROUGHNESS);
    } else {
      setUniformNumber(crown.intensity, 0);
    }
  }

  const baked = mat.userData[DISCOLORATION_UNIFORMS_KEY] as BakedDiscolorationUniforms | undefined;
  if (baked && baseColor) {
    const map = getBakedDiscolorationMap(mat);
    applyBakedDiscolorationUniforms(baked, baseColor, map);
    writeBakedDiscolorationUserData(mat, map, baseColor);
  }
}

export function applyMaskDiscolorationToObject(
  root: Object3D,
  discoloration: MaskDiscoloration | undefined,
  baseColor?: string
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    forEachMaskMaterial(child as Mesh, (mat) => {
      if (isMaskGlowMaterialName(mat.name)) return;
      applyMaskDiscolorationUniforms(mat, discoloration, baseColor);
    });
  });
}
