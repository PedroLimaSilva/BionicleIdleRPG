/**
 * Baked grayscale discoloration lives in the glTF emissive slot (Blender Simple Bake).
 * It is *not* light: we steal `emissiveMap`, zero real emission, and mix albedo
 * toward {@link discolorationForColor} where the bake is bright.
 *
 * WebGPU compiles MeshStandardMaterial through TSL, so the mix is a `colorNode`
 * rather than a GLSL `onBeforeCompile` patch.
 */

import { ClampToEdgeWrapping, Color, MeshStandardMaterial, NoColorSpace, Texture } from 'three';
import { float, materialReference, smoothstep, texture, uniform, uv } from 'three/tsl';
import { discolorationForColor } from '../kit/palettes/legoColorDiscoloration';
import { DUMMY_DISCOLORATION_MAP, isDummyDiscolorationMap } from './dummyTextures';
import { setUniformColor, setUniformNumber } from './tslUniforms';

export const DISCOLORATION_MAP_USERDATA_KEY = 'bakedDiscolorationMap';
export const DISCOLORATION_UNIFORMS_KEY = 'bakedDiscolorationUniforms';

export function createBakedDiscolorationUniforms(map: Texture | null, colorHex: string) {
  const spec = discolorationForColor(colorHex);
  return {
    color: uniform(new Color(spec.color)),
    hasMap: uniform(map ? 1 : 0),
    intensity: uniform(map ? spec.intensity : 0),
  };
}

export type BakedDiscolorationUniforms = ReturnType<typeof createBakedDiscolorationUniforms>;

export function getBakedDiscolorationMap(mat: unknown): Texture | null {
  const fromUserData = (mat as { userData?: Record<string, unknown> }).userData?.[
    DISCOLORATION_MAP_USERDATA_KEY
  ];
  if (fromUserData instanceof Texture && !isDummyDiscolorationMap(fromUserData))
    return fromUserData;
  const emissiveMap = (mat as MeshStandardMaterial).emissiveMap;
  return emissiveMap ?? null;
}

const discolorationMapRef = materialReference(
  `userData.${DISCOLORATION_MAP_USERDATA_KEY}`,
  'texture'
);
type TslFloat = BakedDiscolorationUniforms['hasMap'];
const discolorationColorRef = materialReference(
  'userData.discolorationColor',
  'color'
) as unknown as BakedDiscolorationUniforms['color'];
const discolorationHasMapRef = materialReference(
  'userData.discolorationHasMap',
  'float'
) as unknown as TslFloat;
const discolorationIntensityRef = materialReference(
  'userData.discolorationIntensity',
  'float'
) as unknown as TslFloat;

/**
 * Bind a bake map (or the shared dummy) so every weathered/mask material can
 * share one TSL sample graph. GPU programs key off topology, not texture UUID.
 */
export function bindDiscolorationMapForSampling(
  mat: MeshStandardMaterial,
  map: Texture | null | undefined
): void {
  const bake = map ?? DUMMY_DISCOLORATION_MAP;
  if (bake !== DUMMY_DISCOLORATION_MAP) {
    bake.colorSpace = NoColorSpace;
    bake.wrapS = ClampToEdgeWrapping;
    bake.wrapT = ClampToEdgeWrapping;
  }
  mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = bake;
}

export function bakedDiscolorationColorFromMaterial() {
  return discolorationColorRef;
}

/** Shared bake mix amount — samples the current material's userData map. */
export function bakedDiscolorationAmountFromMaterial() {
  const sample = texture(discolorationMapRef as never, uv());
  return smoothstep(0.2, 0.75, sample.r)
    .mul(discolorationIntensityRef as never)
    .mul(discolorationHasMapRef as never)
    .clamp(0, 1);
}

/**
 * Move `emissiveMap` onto userData so MeshStandardMaterial will not multiply it
 * into real emission (mask power / kit glow). Idempotent. Does not mutate maps
 * on glow materials.
 */
export function adoptBakedDiscolorationMap(
  mat: MeshStandardMaterial,
  opts: { isGlow?: boolean } = {}
): Texture | null {
  if (opts.isGlow) return null;
  const existing = mat.userData[DISCOLORATION_MAP_USERDATA_KEY];
  if (existing instanceof Texture && !isDummyDiscolorationMap(existing)) return existing;
  const map = mat.emissiveMap;
  if (!map) return null;
  map.colorSpace = NoColorSpace;
  // Bakes are atlas-packed; REPEAT shows island outlines when UVs skim edges.
  map.wrapS = ClampToEdgeWrapping;
  map.wrapT = ClampToEdgeWrapping;
  mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = map;
  mat.emissiveMap = null;
  mat.emissive.set(0, 0, 0);
  mat.emissiveIntensity = 0;
  return map;
}

export function applyBakedDiscolorationUniforms(
  uniforms: BakedDiscolorationUniforms,
  colorHex: string,
  map: Texture | null
): void {
  const spec = discolorationForColor(colorHex);
  setUniformColor(uniforms.color, spec.color);
  setUniformNumber(uniforms.intensity, map ? spec.intensity : 0);
  setUniformNumber(uniforms.hasMap, map ? 1 : 0);
}

export function writeBakedDiscolorationUserData(
  mat: MeshStandardMaterial,
  map: Texture | null,
  colorHex: string
): void {
  const spec = discolorationForColor(colorHex);
  const bake = map && !isDummyDiscolorationMap(map) ? map : null;
  bindDiscolorationMapForSampling(mat, bake);
  const color = mat.userData.discolorationColor;
  if (color instanceof Color) {
    color.set(spec.color);
  } else {
    mat.userData.discolorationColor = new Color(spec.color);
  }
  mat.userData.discolorationIntensity = bake ? spec.intensity : 0;
  mat.userData.discolorationHasMap = bake ? 1 : 0;
}

/**
 * Mix amount for the baked wear mask. `smoothstep` crushes mid-gray floors so
 * only true edge/highlight texels mix. Pass explicit `uv()` so TSL cannot
 * steal another map’s `getUV` (normal/roughness) when the bake has no uvNode.
 */
export function bakedDiscolorationAmountNode(
  map: Texture | null,
  uniforms: BakedDiscolorationUniforms
) {
  if (!map) return float(0);
  return uniforms.hasMap
    .mul(smoothstep(0.2, 0.75, texture(map, uv()).r))
    .mul(uniforms.intensity)
    .clamp(0, 1);
}
