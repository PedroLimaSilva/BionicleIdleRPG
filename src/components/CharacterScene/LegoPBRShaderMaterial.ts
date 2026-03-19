/**
 * Lego-style PBR material using MeshStandardMaterial with UV-based texture maps.
 *
 * Takes a legoColor and optional non-tileable diffuse, roughness, metallic, and
 * normal maps. Uses standard Three.js PBR so environment lighting (IBL) works
 * correctly. Maps are sampled via mesh UVs.
 *
 * To verify the material is applied: materials are named "LegoPBR" and can be
 * inspected in the scene. With debug mode on, a small indicator can show the mode.
 */

import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Texture,
} from 'three';

export type LegoPBROptions = {
  /** Base color / tint. Multiplies with diffuse map; used as sole color if no map. */
  color?: ColorRepresentation;
  /** Non-tileable diffuse map (UV-based). */
  diffuseMap?: Texture | null;
  /** Non-tileable roughness map (UV-based, grayscale). */
  roughnessMap?: Texture | null;
  /** Non-tileable metallic map (UV-based, grayscale). */
  metalnessMap?: Texture | null;
  /** Non-tileable normal map (UV-based). */
  normalMap?: Texture | null;
  /** Base roughness when no roughness map (0–1). */
  roughness?: number;
  /** Base metalness when no metalness map (0–1). */
  metalness?: number;
  /** Environment map intensity. Match scene (e.g. 0.35–0.4). */
  envMapIntensity?: number;
  /** Procedural noise strength (0–1). Adds object-space FBM variation to roughness. 0 = off. */
  noiseStrength?: number;
  /** Object-space scale for noise. Higher = finer grain. */
  noiseScale?: number;
};

const DEFAULT_ROUGHNESS = 0.55;
const DEFAULT_METALNESS = 0.05;
const DEFAULT_ENV_MAP_INTENSITY = 0.4;
const DEFAULT_NOISE_STRENGTH = 0.2;
const DEFAULT_NOISE_SCALE = 12.0;

const MATERIAL_NAME = 'LegoPBR';

const materialCache = new Map<string, MeshStandardMaterial>();

function cacheKey(color: ColorRepresentation, opts: LegoPBROptions): string {
  const c = new Color(color).getStyle();
  const hasD = opts.diffuseMap ? 'd' : '';
  const hasR = opts.roughnessMap ? 'r' : '';
  const hasM = opts.metalnessMap ? 'm' : '';
  const hasN = opts.normalMap ? 'n' : '';
  const ns = opts.noiseStrength !== undefined ? opts.noiseStrength : DEFAULT_NOISE_STRENGTH;
  const nsc = opts.noiseScale ?? DEFAULT_NOISE_SCALE;
  return `${c}_${hasD}${hasR}${hasM}${hasN}_ns${ns}_nsc${nsc}`;
}

/** Injects object-space FBM noise into the fragment shader for visible grain. */
function applyProceduralNoise(
  material: MeshStandardMaterial,
  strength: number,
  scale: number
): void {
  if (strength <= 0) return;
  material.onBeforeCompile = (shader) => {
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
    const noiseCode = `
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
      float fbm(vec3 p) {
        float v = 0.0, a = 0.5, f = 1.0;
        for (int i = 0; i < 3; i++) {
          v += a * noise3(p * f);
          a *= 0.5;
          f *= 2.0;
        }
        return v;
      }
      float n = fbm(vObjectPosition * ${scale.toFixed(2)} + 50.0);
      gl_FragColor.rgb *= 1.0 + (n - 0.5) * ${strength.toFixed(3)};
    `;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
      ${noiseCode}`
    );
  };
}

/**
 * Creates a Lego PBR material using MeshStandardMaterial with optional maps.
 * Environment lighting works automatically.
 */
export function createLegoPBRMaterial(opts: LegoPBROptions = {}): MeshStandardMaterial {
  const color = opts.color ?? '#ffffff';
  const noiseStrength =
    opts.noiseStrength !== undefined ? opts.noiseStrength : DEFAULT_NOISE_STRENGTH;
  const noiseScale = opts.noiseScale ?? DEFAULT_NOISE_SCALE;

  const mat = new MeshStandardMaterial({
    color: new Color(color),
    roughness: opts.roughness ?? DEFAULT_ROUGHNESS,
    metalness: opts.metalness ?? DEFAULT_METALNESS,
    envMapIntensity: opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    side: DoubleSide,
    map: opts.diffuseMap ?? null,
    roughnessMap: opts.roughnessMap ?? null,
    metalnessMap: opts.metalnessMap ?? null,
    normalMap: opts.normalMap ?? null,
  });
  mat.name = MATERIAL_NAME;

  if (noiseStrength > 0) {
    applyProceduralNoise(mat, noiseStrength, noiseScale);
  }

  return mat;
}

/**
 * Returns a shared Lego PBR material. Clone for per-mesh overrides.
 */
export function getLegoPBRMaterial(
  color: ColorRepresentation,
  opts: LegoPBROptions = {}
): MeshStandardMaterial {
  const key = cacheKey(color, opts);
  if (!materialCache.has(key)) {
    materialCache.set(key, createLegoPBRMaterial({ ...opts, color }));
  }
  return materialCache.get(key)!;
}

/** Returns true if the material is our Lego PBR material. */
export function isLegoPBRMaterial(m: unknown): m is MeshStandardMaterial {
  return m instanceof MeshStandardMaterial && m.name === MATERIAL_NAME;
}

type MeshLike = {
  transparent?: boolean;
  opacity?: number;
  color?: Color | { getStyle(): string };
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
};

function copySpecialProperties(
  lego: MeshStandardMaterial,
  original: MeshLike
): MeshStandardMaterial {
  const needsTransparent = original.transparent === true;
  const emissiveIntensity = (original as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
  const needsEmissive = 'emissiveIntensity' in original && emissiveIntensity > 0;
  const originalMetalness = (original as { metalness?: number }).metalness ?? 0;
  const hasMetalnessMap =
    'metalnessMap' in original && !!(original as { metalnessMap?: unknown }).metalnessMap;
  const needsMetalness = originalMetalness > 0 || hasMetalnessMap;
  if (!needsTransparent && !needsEmissive && !needsMetalness) return lego;

  const cloned = lego.clone();
  if (needsTransparent && 'opacity' in original && original.opacity !== undefined) {
    cloned.transparent = true;
    cloned.opacity = original.opacity;
    cloned.roughness = 0;
    cloned.metalness = 0.85;
  }
  if (needsEmissive && 'emissive' in original && original.emissive && emissiveIntensity) {
    cloned.emissive = (original.emissive as Color).clone();
    cloned.emissiveIntensity = emissiveIntensity;
    const originalName = (original as { name?: string }).name;
    if (originalName?.includes('Eyes')) {
      cloned.emissiveIntensity = 25;
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
 * Traverses the object and replaces every mesh's material with a Lego PBR
 * material (MeshStandardMaterial with optional maps). Environment lighting
 * works correctly. Materials are named "LegoPBR" for inspection.
 */
export function applyLegoPBRToObject(
  object: Object3D | null | undefined,
  opts: LegoPBROptions = {}
): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    if (!raw) return;
    if (isLegoPBRMaterial(raw)) return;
    const original = raw as MeshLike;
    const color = original.color;
    if (!color) return;
    const colorStyle =
      color instanceof Color
        ? color.getStyle()
        : new Color(color as ColorRepresentation).getStyle();
    let lego = getLegoPBRMaterial(colorStyle as ColorRepresentation, opts);
    lego = copySpecialProperties(lego, original);
    mesh.material = lego;
  });
}
