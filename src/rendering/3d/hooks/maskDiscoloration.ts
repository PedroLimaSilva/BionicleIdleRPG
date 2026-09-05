import { Box3, Color, Mesh, Object3D } from 'three';
import {
  materialColor,
  materialMetalness,
  materialRoughness,
  mix,
  positionLocal,
  uniform,
} from 'three/tsl';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  bakedDiscolorationAmountNode,
  createBakedDiscolorationUniforms,
  DISCOLORATION_UNIFORMS_KEY,
  getBakedDiscolorationMap,
  type BakedDiscolorationUniforms,
} from './bakedDiscoloration';
import { forEachMaskMaterial, isMaskGlowMaterialName, type MaskStandardMat } from './maskMaterial';

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
  metalnessNode?: unknown;
  roughnessNode?: unknown;
};

/** Kept for call-site compatibility; mask-power glow stays off on this TSL branch. */
export const MASK_POWER_EMISSIVE_INTENSITY = 0;

function uniformNumber(node: { value: unknown }): { value: number } {
  return node as unknown as { value: number };
}

function uniformColor(node: { value: unknown }): { value: Color } {
  return node as unknown as { value: Color };
}

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

  mat.userData[DISCOLOR_UNIFORMS_KEY] = crown;
  mat.userData[DISCOLORATION_UNIFORMS_KEY] = baked;

  const bakedAmt = bakedDiscolorationAmountNode(map, baked);
  const range = crown.maxY.sub(crown.minY).max(1e-5);
  const crownAmt = positionLocal.y.sub(crown.minY).div(range).clamp(0, 1).mul(crown.intensity);
  const afterBake = mix(materialColor, baked.color, bakedAmt);

  const tslMat = mat as MaskTslMaterial;
  tslMat.colorNode = mix(afterBake, crown.color, crownAmt);
  tslMat.metalnessNode = mix(materialMetalness, crown.metalness, crownAmt);
  tslMat.roughnessNode = mix(materialRoughness, crown.roughness, crownAmt);
  // WebGPU copies this onto MeshStandardNodeMaterial and uses it as the
  // pipeline key. A constant suffix made every Kanohi share the first
  // compiled program (Tahu Hau, Pohatu Kakama). Close over this clone’s
  // ids so a later swap cannot reuse that pipeline.
  const programKey = `mask_bake_${mat.uuid}_${map?.uuid ?? 'none'}`;
  mat.customProgramCacheKey = () => programKey;
  mat.needsUpdate = true;
}

/** Mask-power glow is disabled; keep emissive black so bake maps cannot light the surface. */
export function applyMaskPowerEmissive(
  mat: MaskStandardMat,
  _colorHex: string,
  _active: boolean | undefined
): void {
  if (!mat.emissive) return;
  mat.emissive.set(0x000000);
  mat.emissiveIntensity = 0;
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
      uniformColor(crown.color).value.set(discoloration.color);
      uniformNumber(crown.intensity).value = discoloration.intensity;
      uniformNumber(crown.metalness).value = discoloration.metalness ?? DEFAULT_DISCOLOR_METALNESS;
      uniformNumber(crown.roughness).value = discoloration.roughness ?? DEFAULT_DISCOLOR_ROUGHNESS;
    } else {
      uniformNumber(crown.intensity).value = 0;
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
