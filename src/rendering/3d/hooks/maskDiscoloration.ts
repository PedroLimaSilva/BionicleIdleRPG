import { Box3, Color, Mesh, Object3D } from 'three';
import {
  materialColor,
  materialMetalness,
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
  bakedDiscolorationAmountNode,
  createBakedDiscolorationUniforms,
  DISCOLORATION_UNIFORMS_KEY,
  getBakedDiscolorationMap,
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
  const baked = createBakedDiscolorationUniforms(map, baseColor);
  const crown = createCrownDiscolorationUniforms(minY, maxY);
  const power = createMaskPowerUniforms();

  mat.userData[DISCOLOR_UNIFORMS_KEY] = crown;
  mat.userData[DISCOLORATION_UNIFORMS_KEY] = baked;
  mat.userData[MASK_POWER_UNIFORMS_KEY] = power;

  const bakedAmt = bakedDiscolorationAmountNode(map, baked);
  const range = crown.maxY.sub(crown.minY).max(1e-5);
  const crownAmt = positionLocal.y.sub(crown.minY).div(range).clamp(0, 1).mul(crown.intensity);
  const afterBake = mix(materialColor, baked.color, bakedAmt);

  const tslMat = mat as MaskTslMaterial;
  tslMat.colorNode = mix(afterBake, crown.color, crownAmt);
  // Keep power and bloom in the graph from the first compile so toggling
  // later does not require a program rebuild.
  tslMat.emissiveNode = power.color.mul(power.intensity);
  tslMat.mrtNode = mrt({ bloomIntensity: power.bloomIntensity });
  if (!maskUsesTransmissionRendering(mat)) {
    // Frosted Kaukau / Rau must keep scalar metalness 0. A metalnessNode graph
    // that doesn't stay at 0 makes WebGPU skip the transmission lobe.
    tslMat.metalnessNode = mix(materialMetalness, crown.metalness, crownAmt);
    tslMat.roughnessNode = mix(materialRoughness, crown.roughness, crownAmt);
  }
  // WebGPU copies this onto MeshStandardNodeMaterial and uses it as the
  // pipeline key. A constant suffix made every Kanohi share the first
  // compiled program (Tahu Hau, Pohatu Kakama). Close over this clone’s
  // ids so a later swap cannot reuse that pipeline.
  const programKey = `mask_bake_${mat.uuid}_${map?.uuid ?? 'none'}`;
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
    applyBakedDiscolorationUniforms(baked, baseColor, getBakedDiscolorationMap(mat));
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
