/**
 * Flat kit plastic: MeshStandardMaterial tinted to the attachment slot color.
 * Weather / bake maps / TSL grime are intentionally omitted on this WebGPU
 * feature branch so kit parts stay readable without atlas sampling.
 *
 * Extra `WeatheredMetalOptions` fields are accepted so existing character
 * models keep compiling; only color / roughness / metalness / IBL / side
 * affect the material.
 */

import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Side,
  Texture,
  Vector2,
} from 'three';

export type WeatheredMetalOptions = {
  color?: ColorRepresentation;
  roughness?: number;
  metalness?: number;
  grimeDarken?: number;
  grimeRoughness?: number;
  grimeMetalnessReduce?: number;
  largeScale?: number;
  fineScale?: number;
  cavityStrength?: number;
  edgeColor?: ColorRepresentation;
  edgeStrength?: number;
  edgeCurvatureScale?: number;
  discolorationMap?: Texture;
  normalMap?: Texture;
  normalScale?: Vector2;
  envMapIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  debugGrimeAsColor?: boolean;
  side?: Side;
};

const DEFAULT_ROUGHNESS = 0.55;
const DEFAULT_METALNESS = 0.05;
const DEFAULT_ENV_MAP_INTENSITY = 0.4;

const MATERIAL_NAME = 'WeatheredMetal';

const materialCache = new Map<string, MeshStandardMaterial>();

function cacheKey(color: ColorRepresentation, opts: WeatheredMetalOptions): string {
  return [
    new Color(color).getStyle(),
    opts.roughness ?? DEFAULT_ROUGHNESS,
    opts.metalness ?? DEFAULT_METALNESS,
    opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    opts.opacity ?? 1,
    opts.transparent ? 't' : '',
    opts.side ?? DoubleSide,
  ].join('|');
}

export function stripPbrMapsAndEmission(
  mat: MeshStandardMaterial,
  opts: { keepAlbedo?: boolean } = {}
): void {
  if (!opts.keepAlbedo) mat.map = null;
  mat.aoMap = null;
  mat.bumpMap = null;
  mat.emissiveMap = null;
  mat.lightMap = null;
  mat.metalnessMap = null;
  mat.normalMap = null;
  mat.roughnessMap = null;
  mat.emissive.set(0, 0, 0);
  mat.emissiveIntensity = 0;
}

export function createWeatheredMetalMaterial(
  opts: WeatheredMetalOptions = {}
): MeshStandardMaterial {
  const color = opts.color ?? '#d4a84b';
  const opacity = opts.opacity ?? 1;
  const mat = new MeshStandardMaterial({
    color: new Color(color),
    envMapIntensity: opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    metalness: opts.metalness ?? DEFAULT_METALNESS,
    opacity,
    roughness: opts.roughness ?? DEFAULT_ROUGHNESS,
    side: opts.side ?? DoubleSide,
    transparent: opts.transparent ?? opacity < 1,
  });
  stripPbrMapsAndEmission(mat);
  mat.name = MATERIAL_NAME;
  return mat;
}

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

export function isWeatheredMetalMaterial(m: unknown): m is MeshStandardMaterial {
  return m instanceof MeshStandardMaterial && m.name === MATERIAL_NAME;
}

export function meshHasUv(mesh: Mesh): boolean {
  const uv = mesh.geometry?.getAttribute('uv');
  return !!uv && uv.count > 0;
}

function isUnderMasks(obj: Object3D): boolean {
  for (let p: Object3D | null = obj.parent; p; p = p.parent) {
    if (p.name === 'Masks') return true;
  }
  return false;
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
 * Replaces mesh materials with flat slot-colored plastic. Skips Masks subtrees
 * and excluded material names (Brain, GlowingEyes, …).
 */
export function applyWeatheredMetalToObject(
  object: Object3D | null | undefined,
  opts: WeatheredMetalOptions & {
    excludeMaterialNames?: string[];
    excludeMaterialNameSubstrings?: string[];
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
    const rawMaterial = mesh.material;
    const rawMaterials = Array.isArray(rawMaterial) ? rawMaterial : [rawMaterial];
    const meshName = mesh.name ?? '';
    const meshWithUserData = mesh as Mesh & { userData?: { originalMaterialName?: string } };
    let changed = false;

    const nextMaterials = rawMaterials.map((raw) => {
      if (!raw) return raw;
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

      changed = true;
      return getWeatheredMetalMaterial((color ?? '#ffffff') as ColorRepresentation, opts);
    });

    if (!changed) return;
    mesh.material = Array.isArray(rawMaterial) ? nextMaterials : nextMaterials[0];
  });
}
