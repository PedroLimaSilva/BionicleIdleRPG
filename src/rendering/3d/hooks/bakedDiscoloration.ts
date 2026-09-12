/**
 * Baked grayscale discoloration lives in the glTF emissive slot (Blender Simple Bake).
 * It is *not* light: we steal `emissiveMap`, zero real emission, and mix albedo
 * toward {@link discolorationForColor} where the bake is bright.
 *
 * WebGPU compiles MeshStandardMaterial through TSL, so the mix is a `colorNode`
 * rather than a GLSL `onBeforeCompile` patch.
 *
 * The bake Texture cannot live only in `userData`: `Material.copy()` /
 * `NodeMaterial.copy()` JSON-clone `userData`, which drops `isTexture` and makes
 * `TextureNode.setup()` throw (`texture( value )` expects THREE.Texture). Bind
 * it to {@link MeshStandardMaterial.aoMap} with intensity 0 — a real map slot
 * that `.copy()` keeps by reference, without contributing AO.
 */

import { ClampToEdgeWrapping, Color, MeshStandardMaterial, NoColorSpace, Texture } from 'three';
import { float, materialReference, smoothstep, texture, uniform, uv } from 'three/tsl';
import { discolorationForColor } from '../kit/palettes/legoColorDiscoloration';
import { DUMMY_DISCOLORATION_MAP, isDummyDiscolorationMap } from './dummyTextures';
import { setUniformColor, setUniformNumber } from './tslUniforms';

export const DISCOLORATION_MAP_USERDATA_KEY = 'bakedDiscolorationMap';
export const DISCOLORATION_UNIFORMS_KEY = 'bakedDiscolorationUniforms';
/** Copy-safe GPU slot. Intensity is always 0 so MeshStandardNodeMaterial AO is identity. */
export const DISCOLORATION_MAP_SLOT = 'aoMap' as const;

export function createBakedDiscolorationUniforms(map: Texture | null, colorHex: string) {
  const spec = discolorationForColor(colorHex);
  return {
    color: uniform(new Color(spec.color)),
    hasMap: uniform(map ? 1 : 0),
    intensity: uniform(map ? spec.intensity : 0),
  };
}

export type BakedDiscolorationUniforms = ReturnType<typeof createBakedDiscolorationUniforms>;

function isBoundBakeMap(map: unknown): map is Texture {
  return map instanceof Texture && !isDummyDiscolorationMap(map);
}

export function getBakedDiscolorationMap(mat: unknown): Texture | null {
  const standard = mat as MeshStandardMaterial;
  const fromUserData = standard.userData?.[DISCOLORATION_MAP_USERDATA_KEY];
  if (isBoundBakeMap(fromUserData)) return fromUserData;
  // After Material.copy(), userData JSON-clone is not a Texture. aoMap still is.
  if (isBoundBakeMap(standard.aoMap) && standard.aoMapIntensity === 0) return standard.aoMap;
  return standard.emissiveMap ?? null;
}

const discolorationMapRef = materialReference(DISCOLORATION_MAP_SLOT, 'texture');
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
 * Bind a bake map so bake-present TSL can `materialReference('aoMap')`.
 * Bake-absent graphs omit the sample; keep `aoMap` null so THREE does not
 * compile an AO path. Dummy stays in userData only (never sampled).
 */
export function bindDiscolorationMapForSampling(
  mat: MeshStandardMaterial,
  map: Texture | null | undefined
): void {
  const bake = map && isBoundBakeMap(map) ? map : DUMMY_DISCOLORATION_MAP;
  if (bake !== DUMMY_DISCOLORATION_MAP) {
    bake.colorSpace = NoColorSpace;
    bake.wrapS = ClampToEdgeWrapping;
    bake.wrapT = ClampToEdgeWrapping;
    mat.aoMap = bake;
    mat.aoMapIntensity = 0;
  } else {
    mat.aoMap = null;
    mat.aoMapIntensity = 0;
  }
  mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = bake;
}

export function bakedDiscolorationColorFromMaterial() {
  return discolorationColorRef;
}

type TslTextureRef = {
  context: (ctx: { getUV: () => unknown }) => { r: unknown };
};

/**
 * Shared bake mix amount — samples `aoMap` (copy-safe bake slot).
 *
 * `materialReference(..., 'texture')` is already a texture binding (see Three's
 * displacementMap). Wrapping it in `texture(ref, uv())` builds a TextureNode
 * whose value is the reference node, not a Texture, so WebGL samples the empty
 * default and every kit/mask shifts. Force `uv()` so the sample does not follow
 * aoMap's default uv2 channel.
 */
export function bakedDiscolorationAmountFromMaterial() {
  const bakeTex = discolorationMapRef as unknown as TslTextureRef;
  const sample = bakeTex.context({ getUV: () => uv() });
  return smoothstep(0.2, 0.75, sample.r as never)
    .mul(discolorationIntensityRef as never)
    .mul(discolorationHasMapRef as never)
    .clamp(0, 1);
}

/**
 * Move `emissiveMap` onto the copy-safe bake slot so MeshStandardMaterial will
 * not multiply it into real emission (mask power / kit glow). Idempotent. Does
 * not mutate maps on glow materials.
 */
export function adoptBakedDiscolorationMap(
  mat: MeshStandardMaterial,
  opts: { isGlow?: boolean } = {}
): Texture | null {
  if (opts.isGlow) return null;
  const existing = getBakedDiscolorationMap(mat);
  if (existing && existing !== mat.emissiveMap) {
    bindDiscolorationMapForSampling(mat, existing);
    return existing;
  }
  const map = mat.emissiveMap;
  if (!map || isDummyDiscolorationMap(map)) return existing;
  bindDiscolorationMapForSampling(mat, map);
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
