/**
 * Weathered metal: object-space FBM grime, optional baked bevel atlas, and a
 * screen-space curvature fallback when no map/UVs exist.
 *
 * Kit bevel atlases (`kit_2001_bevel.webp`) are geometric — R = convex wear,
 * G = concave cavity. Slot color / emission / roughness / metalness still come
 * from `useKitAttachments`; the atlas is sampled on every weathered slot that
 * shares the mesh UVs. Glow, emissive, and transmissive slots skip this pass.
 *
 * applyWeatheredMetalToObject skips: meshes with authored PBR maps (normal /
 * roughness / metalness), meshes under a node named "Masks" (useMask-injected
 * meshes).
 */

import {
  Color,
  ColorRepresentation,
  DataTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  Texture,
} from 'three';

export type WeatheredMetalOptions = {
  /** Base metal color (e.g. gold for Avohkii). */
  color?: ColorRepresentation;
  /** Base roughness of clean metal (0–1). Satin ≈ 0.35. */
  roughness?: number;
  /** Base metalness of clean areas (0–1). */
  metalness?: number;
  /** How much grime darkens the color (0–1). */
  grimeDarken?: number;
  /** Roughness added in grime areas (0–1). */
  grimeRoughness?: number;
  /** Metalness reduction in grime (0–1). 0.7 = grime is 30% as metallic. */
  grimeMetalnessReduce?: number;
  /** Object-space scale for large grime clouds. Lower = bigger patches. */
  largeScale?: number;
  /** Object-space scale for fine micro-roughness. */
  fineScale?: number;
  /** Bias grime toward recessed areas (surfaces facing away from up). 0 = uniform. */
  cavityStrength?: number;
  /** Edge wear discoloration at convex edges. Color to blend toward. */
  edgeColor?: ColorRepresentation;
  /** Strength of edge wear (0–1). */
  edgeStrength?: number;
  /** Curvature threshold for the screen-space fallback. Lower = more edges detected. */
  edgeCurvatureScale?: number;
  /**
   * Optional packed bevel atlas (R = convex wear, G = concave cavity).
   * Kit-level, not per slot. Ignored on meshes with no UVs.
   */
  bevelMap?: Texture;
  /** Environment map intensity. */
  envMapIntensity?: number;
  /** Enable transparency (for mask fade-out animations). */
  transparent?: boolean;
  /** Debug mode: render grime mask directly as grayscale color. */
  debugGrimeAsColor?: boolean;
  /** Debug mode: render packed bevel atlas as red=wear / green=cavity. */
  debugBevelAsColor?: boolean;
};

const DEFAULT_ROUGHNESS = 0.4;
const DEFAULT_METALNESS = 0.9;
const DEFAULT_GRIME_DARKEN = 0.5;
const DEFAULT_GRIME_ROUGHNESS = 0.35;
const DEFAULT_GRIME_METALNESS_REDUCE = 0.7;
const DEFAULT_LARGE_SCALE = 3.5;
const DEFAULT_FINE_SCALE = 18.0;
const DEFAULT_CAVITY_STRENGTH = 0.4;
const DEFAULT_EDGE_COLOR = '#8a7a6a';
const DEFAULT_EDGE_STRENGTH = 0.35;
const DEFAULT_EDGE_CURVATURE_SCALE = 12.0;
const DEFAULT_ENV_MAP_INTENSITY = 0.4;

const MATERIAL_NAME = 'WeatheredMetal';
const BEVEL_MAP_USERDATA_KEY = 'bevelMap';

const materialCache = new Map<string, MeshStandardMaterial>();

const EMPTY_BEVEL_MAP = (() => {
  const tex = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  tex.colorSpace = NoColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
})();

function cacheKey(color: ColorRepresentation, opts: WeatheredMetalOptions): string {
  const c = new Color(color).getStyle();
  const ec = opts.edgeColor ? new Color(opts.edgeColor).getStyle() : '';
  const parts: Array<string | number | boolean> = [
    c,
    opts.roughness ?? DEFAULT_ROUGHNESS,
    opts.metalness ?? DEFAULT_METALNESS,
    opts.grimeDarken ?? DEFAULT_GRIME_DARKEN,
    opts.grimeRoughness ?? DEFAULT_GRIME_ROUGHNESS,
    opts.grimeMetalnessReduce ?? DEFAULT_GRIME_METALNESS_REDUCE,
    opts.largeScale ?? DEFAULT_LARGE_SCALE,
    opts.fineScale ?? DEFAULT_FINE_SCALE,
    opts.cavityStrength ?? DEFAULT_CAVITY_STRENGTH,
    ec,
    opts.edgeStrength ?? DEFAULT_EDGE_STRENGTH,
    opts.edgeCurvatureScale ?? DEFAULT_EDGE_CURVATURE_SCALE,
    opts.bevelMap?.uuid ?? '',
    opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    opts.transparent ? 't' : '',
    opts.debugGrimeAsColor ? 'd' : '',
    opts.debugBevelAsColor ? 'b' : '',
  ];
  return parts.join('|');
}

/** Injects multi-scale procedural grime and optional baked bevel wear into MeshStandardMaterial. */
function applyWeatheredMetalModifier(mat: MeshStandardMaterial, opts: WeatheredMetalOptions): void {
  const grimeDarken = opts.grimeDarken ?? DEFAULT_GRIME_DARKEN;
  const grimeRoughness = opts.grimeRoughness ?? DEFAULT_GRIME_ROUGHNESS;
  const grimeMetalnessReduce = opts.grimeMetalnessReduce ?? DEFAULT_GRIME_METALNESS_REDUCE;
  const largeScale = opts.largeScale ?? DEFAULT_LARGE_SCALE;
  const fineScale = opts.fineScale ?? DEFAULT_FINE_SCALE;
  const cavityStrength = opts.cavityStrength ?? DEFAULT_CAVITY_STRENGTH;
  const edgeColor = new Color(opts.edgeColor ?? DEFAULT_EDGE_COLOR);
  const edgeStrength = opts.edgeStrength ?? DEFAULT_EDGE_STRENGTH;
  const edgeCurvatureScale = opts.edgeCurvatureScale ?? DEFAULT_EDGE_CURVATURE_SCALE;
  const bevelMap = opts.bevelMap ?? EMPTY_BEVEL_MAP;
  const hasBevelMap = opts.bevelMap ? 1 : 0;
  const debugGrimeAsColor = opts.debugGrimeAsColor ?? false;
  const debugBevelAsColor = opts.debugBevelAsColor ?? false;

  mat.userData[BEVEL_MAP_USERDATA_KEY] = opts.bevelMap ?? null;
  mat.customProgramCacheKey = () => 'WeatheredMetal|bevelAtlas';

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.bevelMap = { value: bevelMap };
    shader.uniforms.uHasBevelMap = { value: hasBevelMap };

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `varying vec3 vObjectPosition;
      varying vec2 vBevelUv;
      #include <common>`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vObjectPosition = position;
      vBevelUv = uv;
      #include <begin_vertex>`
    );

    const noiseFunctions = `
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
      }
      float noise3(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
              mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
              mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float fbm(vec3 p, float scale, int octaves) {
        float v = 0.0, a = 0.5, f = 1.0;
        for (int i = 0; i < octaves; i++) {
          v += a * noise3(p * f * scale);
          a *= 0.5;
          f *= 2.0;
        }
        return v;
      }
    `;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `uniform sampler2D bevelMap;
      uniform float uHasBevelMap;
      varying vec3 vObjectPosition;
      varying vec2 vBevelUv;
      ${noiseFunctions}
      #include <common>`
    );

    const modifierCode = `
      vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
      float downCavity = 1.0 - max( worldNormal.y, 0.0 );
      vec4 bevelSample = texture2D(bevelMap, vBevelUv);
      float bakedWear = clamp(bevelSample.r, 0.0, 1.0);
      float bakedCavity = clamp(bevelSample.g, 0.0, 1.0);
      float hasMap = uHasBevelMap;
      float cavity = mix(downCavity, max(bakedCavity, downCavity * 0.35), hasMap);
      float cavityBias = 1.0 + cavity * ${cavityStrength.toFixed(2)};
      float largeCloud = fbm(vObjectPosition + 50.0, ${largeScale.toFixed(2)}, 3);
      float fineGrain = fbm(vObjectPosition + 80.0, ${fineScale.toFixed(2)}, 3);
      float wearNoise = fbm(vObjectPosition + 110.0, ${largeScale.toFixed(2)} * 2.2, 3);
      float grime = clamp((largeCloud - 0.35) * 2.0 * cavityBias, 0.0, 1.0);
      grime = clamp(grime + bakedCavity * hasMap * 0.35, 0.0, 1.0);
      diffuseColor.rgb *= 1.0 - grime * ${grimeDarken.toFixed(3)};
      roughnessFactor += grime * ${grimeRoughness.toFixed(3)} + (fineGrain - 0.5) * 0.08;
      metalnessFactor *= 1.0 - grime * ${grimeMetalnessReduce.toFixed(3)};
      roughnessFactor = clamp(roughnessFactor, 0.04, 1.0);
      metalnessFactor = clamp(metalnessFactor, 0.0, 1.0);
      float curvature = length(dFdx(normal)) + length(dFdy(normal));
      float screenEdge = smoothstep(0.0, 1.0, curvature * ${edgeCurvatureScale.toFixed(2)});
      float bakedEdge = bakedWear * mix(1.0, wearNoise, 0.45);
      float edgeMask = mix(screenEdge, bakedEdge, hasMap);
      vec3 edgeTint = vec3(${edgeColor.r.toFixed(3)}, ${edgeColor.g.toFixed(3)}, ${edgeColor.b.toFixed(3)});
      diffuseColor.rgb = mix(diffuseColor.rgb, edgeTint, edgeMask * ${edgeStrength.toFixed(3)});
      ${debugGrimeAsColor ? 'diffuseColor.rgb = vec3(grime);' : ''}
      ${debugBevelAsColor ? 'diffuseColor.rgb = vec3(bakedWear, bakedCavity, 0.0);' : ''}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      ${modifierCode}`
    );
  };
}

export function meshHasBevelUv(mesh: Mesh): boolean {
  const uv = mesh.geometry?.getAttribute('uv');
  return !!uv && uv.count > 0;
}

/** Bevel atlas attached to a weathered material, if any. */
export function getWeatheredBevelMap(mat: unknown): Texture | null {
  if (!isWeatheredMetalMaterial(mat)) return null;
  return (mat.userData[BEVEL_MAP_USERDATA_KEY] as Texture | null | undefined) ?? null;
}

/**
 * Creates a weathered metal material. Object-space procedural noise, plus a
 * baked bevel atlas when `bevelMap` is set.
 */
export function createWeatheredMetalMaterial(
  opts: WeatheredMetalOptions = {}
): MeshStandardMaterial {
  const color = opts.color ?? '#d4a84b';
  const mat = new MeshStandardMaterial({
    color: new Color(color),
    envMapIntensity: opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    metalness: opts.metalness ?? DEFAULT_METALNESS,
    roughness: opts.roughness ?? DEFAULT_ROUGHNESS,
    side: DoubleSide,
    transparent: opts.transparent ?? false,
  });
  mat.name = MATERIAL_NAME;
  (mat as MeshStandardMaterial & { extensions?: { derivatives?: boolean } }).extensions = {
    derivatives: true,
  };
  applyWeatheredMetalModifier(mat, opts);
  return mat;
}

/**
 * Returns a shared weathered metal material. Clone for per-mesh overrides.
 */
export function getWeatheredMetalMaterial(
  color: ColorRepresentation,
  opts: WeatheredMetalOptions = {}
): MeshStandardMaterial {
  const key = cacheKey(color, opts);
  if (!materialCache.has(key)) {
    materialCache.set(key, createWeatheredMetalMaterial({ ...opts, color }));
  }
  return materialCache.get(key)!;
}

/** Returns true if the material is our weathered metal material. */
export function isWeatheredMetalMaterial(m: unknown): m is MeshStandardMaterial {
  return m instanceof MeshStandardMaterial && m.name === MATERIAL_NAME;
}

function isUnderMasks(obj: Object3D): boolean {
  for (let p: Object3D | null = obj.parent; p; p = p.parent) {
    if (p.name === 'Masks') return true;
  }
  return false;
}

function hasAuthoredPbrMaps(mat: unknown): boolean {
  const m = mat as {
    normalMap?: unknown;
    roughnessMap?: unknown;
    metalnessMap?: unknown;
  };
  return !!(m.normalMap || m.roughnessMap || m.metalnessMap);
}

function isExcludedMaterial(mat: unknown, excludeNames: string[]): boolean {
  const name = (mat as { name?: string }).name ?? '';
  return excludeNames.some((n) => name === n);
}

function isExcludedMaterialBySubstring(mat: unknown, substrings: string[]): boolean {
  if (substrings.length === 0) return false;
  const name = ((mat as { name?: string }).name ?? '').toLowerCase();
  return substrings.some((s) => name.includes(s.toLowerCase()));
}

/**
 * Replaces mesh materials with weathered metal. Skips:
 * - Meshes under a node named "Masks" (useMask-injected meshes)
 * - Meshes whose material already has authored PBR maps (normal / roughness / metalness)
 * - Meshes whose material name is in excludeMaterialNames (e.g. Brain, GlowingEyes)
 *
 * When materialColorMap is provided (material name -> hex color), uses it for colors
 * and replaces even existing weathered metal so character switch updates body colors.
 */
export function applyWeatheredMetalToObject(
  object: Object3D | null | undefined,
  opts: WeatheredMetalOptions & {
    excludeMaterialNames?: string[];
    /** Material names containing any of these substrings (case-insensitive) are skipped */
    excludeMaterialNameSubstrings?: string[];
    /** Exact material names (case-insensitive) to skip, e.g. from kit slot config */
    excludeMaterialNamesNormalized?: Set<string>;
    materialColorMap?: Record<string, string>;
    includeNormalMappedMaterials?: boolean;
    preserveExistingMaps?: boolean;
  } = {}
): void {
  if (!object) return;
  const excludeNames = opts.excludeMaterialNames ?? [];
  const excludeSubstrings = opts.excludeMaterialNameSubstrings ?? [];
  const excludeNormalized = opts.excludeMaterialNamesNormalized ?? new Set<string>();
  const materialColorMap = opts.materialColorMap ?? {};
  const includeNormalMappedMaterials = opts.includeNormalMappedMaterials ?? false;
  const preserveExistingMaps = opts.preserveExistingMaps ?? false;
  const hasColorMap = Object.keys(materialColorMap).length > 0;

  const isNormalizedExcluded = (mat: unknown): boolean => {
    const rawName = (mat as { name?: string }).name ?? '';
    if (!rawName) return false;
    return excludeNormalized.has(rawName.trim().toLowerCase());
  };

  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    if (isUnderMasks(mesh)) return;
    const meshOpts: typeof opts = meshHasBevelUv(mesh) ? opts : { ...opts, bevelMap: undefined };
    const rawMaterial = mesh.material;
    const rawMaterials = Array.isArray(rawMaterial) ? rawMaterial : [rawMaterial];
    const meshName = mesh.name ?? '';
    const meshWithUserData = mesh as Mesh & { userData?: { originalMaterialName?: string } };
    let changed = false;

    const nextMaterials = rawMaterials.map((raw) => {
      if (!raw) return raw;
      if (!includeNormalMappedMaterials && hasAuthoredPbrMaps(raw)) return raw;
      if (excludeNames.length > 0 && isExcludedMaterial(raw, excludeNames)) return raw;
      if (excludeSubstrings.length > 0 && isExcludedMaterialBySubstring(raw, excludeSubstrings))
        return raw;
      if (excludeNormalized.size > 0 && isNormalizedExcluded(raw)) return raw;

      const matName = (raw as { name?: string }).name ?? '';
      const lookupName =
        meshWithUserData.userData?.originalMaterialName ??
        (matName && matName !== MATERIAL_NAME ? matName : meshName);

      if (matName && matName !== MATERIAL_NAME) {
        meshWithUserData.userData ??= {};
        meshWithUserData.userData.originalMaterialName = matName;
      }

      const color =
        hasColorMap && lookupName in materialColorMap
          ? materialColorMap[lookupName]
          : hasColorMap
            ? undefined
            : raw instanceof MeshStandardMaterial && raw.color
              ? raw.color.getStyle()
              : '#ffffff';

      if (!hasColorMap && isWeatheredMetalMaterial(raw)) return raw;
      if (hasColorMap && color === undefined) return raw;

      if (preserveExistingMaps && raw instanceof MeshStandardMaterial) {
        const clone = raw.clone();
        clone.name = MATERIAL_NAME;
        clone.roughness = meshOpts.roughness ?? DEFAULT_ROUGHNESS;
        clone.metalness = meshOpts.metalness ?? DEFAULT_METALNESS;
        clone.envMapIntensity = meshOpts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY;
        clone.side = DoubleSide;
        clone.transparent = meshOpts.transparent ?? false;
        clone.color = new Color((color ?? '#ffffff') as ColorRepresentation);
        (clone as MeshStandardMaterial & { extensions?: { derivatives?: boolean } }).extensions = {
          derivatives: true,
        };
        applyWeatheredMetalModifier(clone, meshOpts);
        changed = true;
        return clone;
      }

      changed = true;
      return getWeatheredMetalMaterial((color ?? '#ffffff') as ColorRepresentation, meshOpts);
    });

    if (!changed) return;
    mesh.material = Array.isArray(rawMaterial) ? nextMaterials : nextMaterials[0];
  });
}
