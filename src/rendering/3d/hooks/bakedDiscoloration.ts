/**
 * Baked discoloration lives in the glTF emissive slot (Blender Simple Bake).
 * It is *not* light: we steal `emissiveMap`, zero real emission, and mix albedo
 * toward {@link discolorationForColor} where the bake is bright.
 *
 * Default bakes are grayscale (Tahu / masks) and sample **R**. Packed diminished
 * sheets store roughness in R, metalness in G, and wear in B.
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

import {
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  Texture,
} from 'three';
import { float, materialReference, smoothstep, texture, uniform, uv } from 'three/tsl';
import { discolorationForColor } from '../kit/palettes/legoColorDiscoloration';
import { DUMMY_DISCOLORATION_MAP, isDummyDiscolorationMap } from './dummyTextures';
import {
  safeMaterialColorRef,
  safeMaterialTextureRef,
  setUniformColor,
  setUniformNumber,
} from './tslUniforms';

export const DISCOLORATION_MAP_USERDATA_KEY = 'bakedDiscolorationMap';
export const DISCOLORATION_UNIFORMS_KEY = 'bakedDiscolorationUniforms';
/** Copy-safe GPU slot. Intensity is always 0 so MeshStandardNodeMaterial AO is identity. */
export const DISCOLORATION_MAP_SLOT = 'aoMap' as const;
/**
 * Mix starts at this bake luminance and reaches full mix at
 * {@link DISCOLORATION_SMOOTHSTEP_HI}. 0.04–0.28 was too permissive on black
 * (dim atlas noise mixed as wear); 0.2–0.75 crushed packed edge bakes to zero.
 */
export const DISCOLORATION_SMOOTHSTEP_LO = 0.12;
export const DISCOLORATION_SMOOTHSTEP_HI = 0.45;

export function createBakedDiscolorationUniforms(map: Texture | null, colorHex: string) {
  const spec = discolorationForColor(colorHex);
  return {
    color: uniform(new Color(spec.color)),
    hasMap: uniform(map ? 1 : 0),
    intensity: uniform(map ? spec.intensity : 0),
  };
}

export type BakedDiscolorationUniforms = ReturnType<typeof createBakedDiscolorationUniforms>;

export type TextureNodeLike = {
  getUpdateType?: () => string;
  setup: (builder: unknown) => unknown;
  update: (frame?: unknown) => unknown;
  updateType: string;
  value: Texture;
};

type BakeSampleFrame = {
  context?: { material?: BakeSampleFrame['material'] };
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

function materialFromState(state: unknown): BakeSampleFrame['material'] {
  if (!state || typeof state !== 'object') return undefined;
  const record = state as BakeSampleFrame;
  return record.material ?? record.context?.material;
}

function writeTextureValue(node: TextureNodeLike, tex: Texture): void {
  node.value = tex;
}

/**
 * Three's TextureNode.setup() builds UVs inside a lazy `Fn` that later writes
 * `updateType = 'none'` (no matrix / flipY uniform). The builder collects
 * update nodes after that Fn runs, so restoring `'object'` only at the end of
 * setup still leaves the bake sample off the per-object list — bound to the
 * black compile dummy, so emissive discoloration never appears.
 *
 * `getUpdateType()` is what NodeBuilder / NodeFrame actually read.
 *
 * Jest's `three/tsl` mock is a Proxy that only allows writing `.value`; skip
 * method wrapping there. Production TextureNode accepts the hooks.
 */
export function attachBakeSampleObjectUpdate(sample: TextureNodeLike): TextureNodeLike {
  const previousUpdate = sample.update.bind(sample);
  const previousSetup = sample.setup.bind(sample);
  sample.updateType = 'object';
  sample.getUpdateType = () => 'object';
  sample.setup = (builder: unknown) => {
    writeTextureValue(sample, bakeMapFromMaterial(materialFromState(builder)));
    const result = previousSetup(builder);
    sample.updateType = 'object';
    return result;
  };
  sample.update = (frame?: unknown) => {
    writeTextureValue(sample, bakeMapFromMaterial(materialFromState(frame)));
    return previousUpdate(frame);
  };
  return sample;
}

/**
 * `materialReference(slot, 'texture')` compiles as `texture(null)`. TextureNode.setup
 * then throws unless the compiling material already has a Texture in that slot
 * (NodeMaterial copies, empty aoMap, duck-typed GLTF maps). Sample a real dummy
 * Texture instead and rebind `aoMap` per object so compile never sees null.
 */
function createBakeSampleTextureNode(): TextureNodeLike {
  const sample = texture(DUMMY_DISCOLORATION_MAP, uv()) as unknown as TextureNodeLike;
  writeTextureValue(sample, DUMMY_DISCOLORATION_MAP);
  try {
    attachBakeSampleObjectUpdate(sample);
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
type TslTextureChannel = {
  clamp: (lo: number, hi: number) => unknown;
};
type TslTextureSample = {
  b: TslTextureChannel;
  g: TslTextureChannel;
  r: TslTextureChannel;
};
export type DiscolorationBakeChannel = 'r' | 'b';
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
 * Per-material bake sample — same pattern as `normalMap`. A shared TextureNode
 * whose `.value` is patched in `onBeforeRender` stays bound to the compile
 * dummy on WebGPU (`getUniformHash` is the texture UUID). Shadow override
 * materials have no `aoMap`; {@link safeMaterialTextureRef} plants the dummy
 * so `TextureNode.setup` never sees `texture(null)`.
 */
const discolorationAoMapRef = safeMaterialTextureRef(
  DISCOLORATION_MAP_SLOT,
  DUMMY_DISCOLORATION_MAP
) as unknown as TslTextureSample;

/**
 * Bind a bake map onto the copy-safe `aoMap` slot. Bake-absent graphs omit the
 * sample and keep `aoMap` null so THREE does not compile an AO path. Dummy stays
 * in userData only unless {@link ensureBakeSampleSlot} plants it for compile.
 *
 * Atlas hairline bakes (Tahu battle LOD) mip-average toward black. Sample
 * LOD 0 with linear filtering, and keep {@link Texture.channel} on uv0 so
 * `materialReference('aoMap')` does not pick aoMap's default uv2.
 */
export function bindDiscolorationMapForSampling(
  mat: MeshStandardMaterial,
  map: Texture | null | undefined
): void {
  const bake = isRenderableBakeMap(map) ? map : DUMMY_DISCOLORATION_MAP;
  if (bake !== DUMMY_DISCOLORATION_MAP) {
    bake.channel = 0;
    bake.colorSpace = NoColorSpace;
    bake.generateMipmaps = false;
    bake.magFilter = LinearFilter;
    bake.minFilter = LinearFilter;
    bake.wrapS = ClampToEdgeWrapping;
    bake.wrapT = ClampToEdgeWrapping;
    bake.needsUpdate = true;
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

/**
 * Mix amount. Samples this material's `aoMap` (the stolen bake) the same way
 * normals sample `normalMap` — a per-draw material binding, not a shared
 * TextureNode. Keep uv0 via {@link bindDiscolorationMapForSampling} `channel`.
 * Grayscale bakes use **R** (default); packed RGB sheets use **B**.
 */
export function bakedDiscolorationAmountFromMaterial(channel: DiscolorationBakeChannel = 'r') {
  const sample = channel === 'b' ? discolorationAoMapRef.b : discolorationAoMapRef.r;
  return smoothstep(DISCOLORATION_SMOOTHSTEP_LO, DISCOLORATION_SMOOTHSTEP_HI, sample as never)
    .mul(discolorationIntensityRef as never)
    .mul(discolorationHasMapRef as never)
    .clamp(0, 1);
}

/** Packed emissive R — authored roughness in 0–1. */
export function bakedPackedRoughnessFromMaterial() {
  return discolorationAoMapRef.r.clamp(0.04, 1);
}

/** Packed emissive G — authored metalness in 0–1. */
export function bakedPackedMetalnessFromMaterial() {
  return discolorationAoMapRef.g.clamp(0, 1);
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
 * Dex preview: keep the bake texture bound and zero / restore the mix uniforms
 * so toggling does not rebuild weathered materials.
 */
export function setBakedDiscolorationEnabled(root: Object3D, enabled: boolean): number {
  let count = 0;
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      const mat = raw as MeshStandardMaterial;
      if (!getBakedDiscolorationMap(mat)) continue;
      const spec = discolorationForColor(mat.color.getStyle());
      mat.userData.discolorationHasMap = enabled ? 1 : 0;
      mat.userData.discolorationIntensity = enabled ? spec.intensity : 0;
      count += 1;
    }
  });
  return count;
}

/**
 * Mix amount for the baked wear mask. Dim atlas texels stay on the base color
 * until {@link DISCOLORATION_SMOOTHSTEP_LO}; full mix at {@link DISCOLORATION_SMOOTHSTEP_HI}.
 * Pass explicit `uv()` so TSL cannot steal another map’s `getUV`.
 */
export function bakedDiscolorationAmountNode(
  map: Texture | null,
  uniforms: BakedDiscolorationUniforms
) {
  if (!map) return float(0);
  return uniforms.hasMap
    .mul(smoothstep(DISCOLORATION_SMOOTHSTEP_LO, DISCOLORATION_SMOOTHSTEP_HI, texture(map, uv()).r))
    .mul(uniforms.intensity)
    .clamp(0, 1);
}
