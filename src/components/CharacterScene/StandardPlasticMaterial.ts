/**
 * Standard PBR plastic materials with optional fake ambient occlusion.
 * Uses MeshStandardMaterial so lighting and environment work out of the box;
 * no custom shaders or UVs required. Fake AO darkens crevices via view-space
 * normal (surfaces facing away from "up" get slightly darker).
 */

import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from 'three';

export type StandardPlasticOptions = {
  color?: ColorRepresentation;
  roughness?: number;
  metalness?: number;
  /** Environment map reflection strength (0–1). Lower = less shiny. */
  envMapIntensity?: number;
  /** Strength of fake AO darkening (0–1). Default 0.35. */
  ambientOcclusionStrength?: number;
  /** Multiply color saturation (1 = unchanged). Slightly >1 restores pop vs PBR/SSAO. */
  saturation?: number;
};

/** Matte, worn plastic: high roughness = diffuse, no sharp reflections */
const DEFAULT_ROUGHNESS = 0.82;
const DEFAULT_METALNESS = 0;
/** Tone down environment reflections so it doesn’t look metallic */
const DEFAULT_ENV_MAP_INTENSITY = 0.35;
const DEFAULT_AO_STRENGTH = 0.35;
/** Slight saturation boost so PBR + env + SSAO don’t wash out colors */
const DEFAULT_SATURATION = 1.18;

const materialCache = new Map<string, MeshStandardMaterial>();

/**
 * Injects a fake ambient occlusion term into the fragment shader: surfaces
 * facing away from view-space "up" (normal.y) are darkened slightly.
 */
function applyFakeAO(
  material: MeshStandardMaterial,
  strength: number = DEFAULT_AO_STRENGTH,
): void {
  if (strength <= 0) return;
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
      float fakeAO = 1.0 - ${strength.toFixed(3)} * (1.0 - max(normal.y, 0.0));
      gl_FragColor.rgb *= fakeAO;`,
    );
  };
}

/**
 * Returns a shared standard plastic material for the given color.
 * Clone the returned material for per-mesh overrides (emissive, transparent, metalness).
 */
export function getStandardPlasticMaterial(
  color: ColorRepresentation,
  options: StandardPlasticOptions = {},
): MeshStandardMaterial {
  const baseColor = new Color(color);
  const saturation = options.saturation ?? DEFAULT_SATURATION;
  const matColor =
    saturation !== 1
      ? (() => {
          const c = baseColor.clone();
          const hsl = { h: 0, s: 0, l: 0 };
          c.getHSL(hsl);
          hsl.s = Math.min(1, hsl.s * saturation);
          c.setHSL(hsl.h, hsl.s, hsl.l);
          return c;
        })()
      : baseColor;

  const key = matColor.getStyle();
  const opts = {
    roughness: options.roughness ?? DEFAULT_ROUGHNESS,
    metalness: options.metalness ?? DEFAULT_METALNESS,
    envMapIntensity: options.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    ambientOcclusionStrength:
      options.ambientOcclusionStrength ?? DEFAULT_AO_STRENGTH,
  };
  const cacheKey = `${key}_${opts.roughness}_${opts.metalness}_${opts.envMapIntensity}_${opts.ambientOcclusionStrength}`;
  if (!materialCache.has(cacheKey)) {
    const mat = new MeshStandardMaterial({
      color: matColor,
      roughness: opts.roughness,
      metalness: opts.metalness,
      envMapIntensity: opts.envMapIntensity,
      side: DoubleSide,
    });
    applyFakeAO(mat, opts.ambientOcclusionStrength);
    materialCache.set(cacheKey, mat);
  }
  return materialCache.get(cacheKey)!;
}

type MeshLike = {
  transparent?: boolean;
  opacity?: number;
  color?: Color | { getStyle(): string };
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
};

/**
 * Copies transparency, emissive, and metalness from an original material
 * onto a standard plastic material. Returns a clone if any override is needed.
 */
function copySpecialProperties(
  standard: MeshStandardMaterial,
  original: MeshLike,
): MeshStandardMaterial {
  const needsTransparent = original.transparent === true;
  const emissiveIntensity =
    (original as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
  const needsEmissive =
    'emissiveIntensity' in original && emissiveIntensity > 0;
  const originalMetalness = (original as { metalness?: number }).metalness ?? 0;
  const hasMetalnessMap =
    'metalnessMap' in original &&
    !!(original as { metalnessMap?: unknown }).metalnessMap;
  const needsMetalness = originalMetalness > 0 || hasMetalnessMap;

  if (!needsTransparent && !needsEmissive && !needsMetalness) return standard;

  const cloned = standard.clone();
  if (
    needsTransparent &&
    'opacity' in original &&
    original.opacity !== undefined
  ) {
    cloned.transparent = true;
    cloned.opacity = original.opacity;
    cloned.roughness = 0;
    cloned.metalness = 0.85;
  }
  if (
    needsEmissive &&
    'emissive' in original &&
    original.emissive &&
    emissiveIntensity
  ) {
    cloned.emissive = (original.emissive as Color).clone();
    cloned.emissiveIntensity = emissiveIntensity;
    if ((original as { name?: string }).name?.includes('Eyes')) {
      cloned.emissiveIntensity = emissiveIntensity * 10;
    }
  }
  if (needsMetalness) {
    cloned.metalness = originalMetalness;
    if (originalMetalness > 0.5) {
      cloned.roughness = 0.1;
    }
  }
  return cloned;
}

/**
 * Traverses the object and replaces every mesh's material with a standard
 * plastic PBR material keyed by the original material's color. Preserves
 * emissive, transparency, and metalness where the original had them.
 */
export function applyStandardPlasticToObject(
  object: Object3D | null | undefined,
): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    if (!raw) return;
    // Skip if this mesh already has one of our cached standard plastics
    if (
      raw instanceof MeshStandardMaterial &&
      Array.from(materialCache.values()).includes(raw)
    )
      return;
    const original = raw as MeshLike;
    const color = original.color;
    if (!color) return;
    const colorStyle =
      color instanceof Color
        ? color.getStyle()
        : new Color(color as ColorRepresentation).getStyle();
    let standard = getStandardPlasticMaterial(
      colorStyle as ColorRepresentation,
    );
    standard = copySpecialProperties(standard, original);
    mesh.material = standard;
  });
}
