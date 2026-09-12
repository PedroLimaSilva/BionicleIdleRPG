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
import { safeMaterialColorRef, setUniformColor, setUniformNumber } from './tslUniforms';

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

type TextureNodeLike = {
  setup: (builder: unknown) => unknown;
  update: (frame?: unknown) => unknown;
  updateType: string;
  value: Texture;
};

type BakeSampleFrame = {
  material?: { aoMap?: Texture | null } | Array<{ aoMap?: Texture | null }> | null;
};

function isTextureValue(map: unknown): map is Texture {
  return !!map && (map as Texture).isTexture === true;
}

function bakeMapFromMaterial(material: BakeSampleFrame['material']): Texture {
  const slot = Array.isArray(material) ? material[0] : material;
  const map = slot?.aoMap;
  return isTextureValue(map) ? map : DUMMY_DISCOLORATION_MAP;
}

function writeTextureValue(node: TextureNodeLike, tex: Texture): void {
  node.value = tex;
}

/**
 * `materialReference(slot, 'texture')` compiles as `texture(null)`. TextureNode.setup
 * then throws unless the compiling material already has a Texture in that slot
 * (NodeMaterial copies, empty aoMap, duck-typed GLTF maps). Sample a real dummy
 * Texture instead and rebind `aoMap` per object so compile never sees null.
 *
 * Jest's `three/tsl` mock is a Proxy that only allows writing `.value`; skip
 * method wrapping there. Production TextureNode accepts the hooks.
 */
function createBakeSampleTextureNode(): TextureNodeLike {
  const sample = texture(DUMMY_DISCOLORATION_MAP, uv()) as unknown as TextureNodeLike;
  writeTextureValue(sample, DUMMY_DISCOLORATION_MAP);
  try {
    const previousUpdate = sample.update.bind(sample);
    const previousSetup = sample.setup.bind(sample);
    sample.updateType = 'object';
    sample.setup = (builder: unknown) => {
      if (!isTextureValue(sample.value)) {
        writeTextureValue(sample, DUMMY_DISCOLORATION_MAP);
      }
      return previousSetup(builder);
    };
    sample.update = (frame?: unknown) => {
      writeTextureValue(
        sample,
        bakeMapFromMaterial((frame as BakeSampleFrame | undefined)?.material)
      );
      return previousUpdate(frame);
    };
  } catch {
    // Jest TSL mock: only `.value` is writable.
  }
  return sample;
}

export const bakedDiscolorationMapNode = createBakeSampleTextureNode();

/** Tests / object-update: keep the shared sample on a real Texture. */
export function bindBakedDiscolorationMapNode(material: BakeSampleFrame['material']): Texture {
  const tex = bakeMapFromMaterial(material);
  writeTextureValue(bakedDiscolorationMapNode, tex);
  return tex;
}

/** Three's check, not `instanceof` — GLTF maps can fail instanceof across chunks. */
export function isRenderableBakeMap(map: unknown): map is Texture {
  return isTextureValue(map) && !isDummyDiscolorationMap(map);
}

export function getBakedDiscolorationMap(mat: unknown): Texture | null {
  const standard = mat as MeshStandardMaterial;
  const fromUserData = standard.userData?.[DISCOLORATION_MAP_USERDATA_KEY];
  if (isRenderableBakeMap(fromUserData)) return fromUserData;
  // After Material.copy(), userData JSON-clone is not a Texture. aoMap still is.
  if (isRenderableBakeMap(standard.aoMap) && standard.aoMapIntensity === 0) return standard.aoMap;
  const emissiveMap = standard.emissiveMap;
  return isRenderableBakeMap(emissiveMap) ? emissiveMap : null;
}

type TslFloat = BakedDiscolorationUniforms['hasMap'];
const discolorationColorRef = safeMaterialColorRef(
  'userData.discolorationColor'
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
 * Bind a bake map onto the copy-safe `aoMap` slot. Bake-absent graphs omit the
 * sample and keep `aoMap` null so THREE does not compile an AO path. Dummy stays
 * in userData only unless {@link ensureBakeSampleSlot} plants it for compile.
 */
export function bindDiscolorationMapForSampling(
  mat: MeshStandardMaterial,
  map: Texture | null | undefined
): void {
  const bake = isRenderableBakeMap(map) ? map : DUMMY_DISCOLORATION_MAP;
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

/** Bake-sample graphs must never compile with a null texture slot. */
export function ensureBakeSampleSlot(mat: MeshStandardMaterial): void {
  if (isRenderableBakeMap(mat.aoMap)) {
    mat.aoMapIntensity = 0;
    return;
  }
  mat.aoMap = DUMMY_DISCOLORATION_MAP;
  mat.aoMapIntensity = 0;
}

export function bakedDiscolorationColorFromMaterial() {
  return discolorationColorRef;
}

type TslTextureSample = {
  r: unknown;
};

/**
 * Shared bake mix amount. Samples {@link bakedDiscolorationMapNode} (dummy at
 * compile, live `aoMap` per object) with explicit `uv()` so the bake stays on
 * uv0 instead of aoMap's default uv2.
 */
export function bakedDiscolorationAmountFromMaterial() {
  const sample = bakedDiscolorationMapNode as unknown as TslTextureSample;
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
  if (!isRenderableBakeMap(map)) return existing;
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
  const bake = isRenderableBakeMap(map) ? map : null;
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
