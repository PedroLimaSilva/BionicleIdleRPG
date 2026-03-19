/**
 * Weathered metal material using object-space procedural noise only.
 *
 * Multi-scale FBM creates large grime splotches and fine micro-roughness,
 * emulating a Blender baked look. Grime = darker, less metallic, rougher.
 * No UVs or textures—works globally across all meshes.
 *
 * applyWeatheredMetalToObject skips: meshes with normalMap, meshes under
 * a node named "Masks" (useMask-injected meshes).
 */

import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
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
  /** Edge discoloration at convex/grazing edges. Color to blend toward. */
  edgeColor?: ColorRepresentation;
  /** Strength of edge discoloration (0–1). */
  edgeStrength?: number;
  /** Environment map intensity. */
  envMapIntensity?: number;
  /** Enable transparency (for mask fade-out animations). */
  transparent?: boolean;
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
const DEFAULT_ENV_MAP_INTENSITY = 0.4;

const MATERIAL_NAME = 'WeatheredMetal';

const materialCache = new Map<string, MeshStandardMaterial>();

function cacheKey(color: ColorRepresentation, opts: WeatheredMetalOptions): string {
  const c = new Color(color).getStyle();
  const t = opts.transparent ? 't' : '';
  const ec = opts.edgeColor ? new Color(opts.edgeColor).getStyle() : '';
  const es = opts.edgeStrength ?? 0;
  return `${c}_${opts.roughness ?? DEFAULT_ROUGHNESS}_${opts.largeScale ?? DEFAULT_LARGE_SCALE}_${t}_ec${ec}_es${es}`;
}

/** Injects multi-scale procedural grime and edge discoloration into MeshStandardMaterial. */
function applyWeatheredMetalModifier(mat: MeshStandardMaterial, opts: WeatheredMetalOptions): void {
  const grimeDarken = opts.grimeDarken ?? DEFAULT_GRIME_DARKEN;
  const grimeRoughness = opts.grimeRoughness ?? DEFAULT_GRIME_ROUGHNESS;
  const grimeMetalnessReduce = opts.grimeMetalnessReduce ?? DEFAULT_GRIME_METALNESS_REDUCE;
  const largeScale = opts.largeScale ?? DEFAULT_LARGE_SCALE;
  const fineScale = opts.fineScale ?? DEFAULT_FINE_SCALE;
  const cavityStrength = opts.cavityStrength ?? DEFAULT_CAVITY_STRENGTH;
  const edgeColor = new Color(opts.edgeColor ?? DEFAULT_EDGE_COLOR);
  const edgeStrength = opts.edgeStrength ?? DEFAULT_EDGE_STRENGTH;

  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `varying vec3 vObjectPosition;
      #include <beginnormal_vertex>`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vObjectPosition = position;
      #include <begin_vertex>`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `varying vec3 vObjectPosition;
      #include <common>`
    );

    const modifierCode = `
      vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
      float cavity = 1.0 - max( worldNormal.y, 0.0 );
      float cavityBias = 1.0 + cavity * ${cavityStrength.toFixed(2)};
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
      float largeCloud = fbm(vObjectPosition + 50.0, ${largeScale.toFixed(2)}, 3);
      float fineGrain = fbm(vObjectPosition + 80.0, ${fineScale.toFixed(2)}, 3);
      float grime = clamp((largeCloud - 0.35) * 2.0 * cavityBias, 0.0, 1.0);
      diffuseColor.rgb *= 1.0 - grime * ${grimeDarken.toFixed(3)};
      material.roughness += grime * ${grimeRoughness.toFixed(3)} + (fineGrain - 0.5) * 0.08;
      material.metalness *= 1.0 - grime * ${grimeMetalnessReduce.toFixed(3)};
      material.roughness = clamp(material.roughness, 0.04, 1.0);
      material.metalness = clamp(material.metalness, 0.0, 1.0);
      float NdotV = max(dot(normal, -normalize(vViewPosition)), 0.0);
      float fresnel = pow(1.0 - NdotV, 2.5);
      vec3 edgeTint = vec3(${edgeColor.r.toFixed(3)}, ${edgeColor.g.toFixed(3)}, ${edgeColor.b.toFixed(3)});
      diffuseColor.rgb = mix(diffuseColor.rgb, edgeTint, fresnel * ${edgeStrength.toFixed(3)});
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      ${modifierCode}`
    );
  };
}

/**
 * Creates a weathered metal material. Object-space procedural noise only—no UVs.
 * Grime splotches darken, roughen, and reduce metalness.
 */
export function createWeatheredMetalMaterial(
  opts: WeatheredMetalOptions = {}
): MeshStandardMaterial {
  const color = opts.color ?? '#d4a84b';
  const mat = new MeshStandardMaterial({
    color: new Color(color),
    roughness: opts.roughness ?? DEFAULT_ROUGHNESS,
    metalness: opts.metalness ?? DEFAULT_METALNESS,
    envMapIntensity: opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    side: DoubleSide,
    transparent: opts.transparent ?? false,
  });
  mat.name = MATERIAL_NAME;
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

function hasNormalMap(mat: unknown): boolean {
  return !!(mat as { normalMap?: unknown }).normalMap;
}

/**
 * Replaces mesh materials with weathered metal. Skips:
 * - Meshes under a node named "Masks" (useMask-injected meshes)
 * - Meshes whose material already has a normalMap
 */
export function applyWeatheredMetalToObject(
  object: Object3D | null | undefined,
  opts: WeatheredMetalOptions = {}
): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    if (isUnderMasks(mesh)) return;

    const raw = mesh.material;
    if (!raw) return;
    if (hasNormalMap(raw)) return;
    if (isWeatheredMetalMaterial(raw)) return;

    const color =
      raw instanceof MeshStandardMaterial && raw.color
        ? raw.color.getStyle()
        : '#ffffff';
    mesh.material = getWeatheredMetalMaterial(color as ColorRepresentation, opts);
  });
}
