/**
 * Weathered kit plastic/metal: object-space FBM that darkens albedo, raises
 * roughness, lowers metalness, and bumps the shading normal in the same
 * local-space patches. Authored normal / roughness / metalness maps replace the
 * matching FBM channel. Optional baked emissive discoloration (glTF `emissiveMap`)
 * mixes on top. Edgewear stays off.
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
import { getBakedDiscolorationMap } from '../hooks/bakedDiscoloration';
import { applySharedWeatheringGraph, type WeatheredTslMaterial } from './weatheredMetalGraph';

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
  /** Height-to-normal scale for FBM dents. 0 skips the bump. */
  dentStrength?: number;
  edgeColor?: ColorRepresentation;
  edgeStrength?: number;
  edgeCurvatureScale?: number;
  discolorationMap?: Texture;
  map?: Texture;
  metalnessMap?: Texture;
  normalMap?: Texture;
  normalScale?: Vector2;
  roughnessMap?: Texture;
  envMapIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  debugGrimeAsColor?: boolean;
  side?: Side;
};

const DEFAULT_ROUGHNESS = 0.55;
const DEFAULT_METALNESS = 0.05;
const DEFAULT_GRIME_DARKEN = 0.5;
const DEFAULT_GRIME_ROUGHNESS = 0.35;
const DEFAULT_GRIME_METALNESS_REDUCE = 0.7;
/** Object-space scale for large grime/dent clouds. Lower = bigger patches. 2.6 is slightly broader than master's 3.5 because MaterialX noise is finer than the old hash FBM. */
const DEFAULT_LARGE_SCALE = 2.6;
const DEFAULT_FINE_SCALE = 18.0;
const DEFAULT_ENV_MAP_INTENSITY = 0.4;
/** Screen-space bump from the master large-cloud FBM (`largeScale`, not fine grain). */
const DEFAULT_DENT_STRENGTH = 2;

const MATERIAL_NAME = 'WeatheredMetal';

const materialCache = new Map<string, MeshStandardMaterial>();

const WEATHERING_DEFAULTS = {
  dentStrength: DEFAULT_DENT_STRENGTH,
  fineScale: DEFAULT_FINE_SCALE,
  grimeDarken: DEFAULT_GRIME_DARKEN,
  grimeMetalnessReduce: DEFAULT_GRIME_METALNESS_REDUCE,
  grimeRoughness: DEFAULT_GRIME_ROUGHNESS,
  largeScale: DEFAULT_LARGE_SCALE,
  metalness: DEFAULT_METALNESS,
};

function cacheKey(color: ColorRepresentation, opts: WeatheredMetalOptions): string {
  return [
    new Color(color).getStyle(),
    opts.roughness ?? DEFAULT_ROUGHNESS,
    opts.metalness ?? DEFAULT_METALNESS,
    opts.grimeDarken ?? DEFAULT_GRIME_DARKEN,
    opts.grimeRoughness ?? DEFAULT_GRIME_ROUGHNESS,
    opts.grimeMetalnessReduce ?? DEFAULT_GRIME_METALNESS_REDUCE,
    opts.largeScale ?? DEFAULT_LARGE_SCALE,
    opts.fineScale ?? DEFAULT_FINE_SCALE,
    opts.dentStrength ?? DEFAULT_DENT_STRENGTH,
    opts.discolorationMap?.uuid ?? '',
    opts.discolorationMap?.channel ?? 0,
    opts.map?.uuid ?? '',
    opts.metalnessMap?.uuid ?? '',
    opts.normalMap?.uuid ?? '',
    opts.roughnessMap?.uuid ?? '',
    opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    opts.opacity ?? 1,
    opts.transparent ? 't' : '',
    opts.side ?? DoubleSide,
  ].join('|');
}

function applyObjectSpaceWeathering(mat: WeatheredTslMaterial, opts: WeatheredMetalOptions): void {
  const colorHex = `#${new Color(opts.color ?? mat.color).getHexString()}`;
  applySharedWeatheringGraph(mat, { ...opts, color: colorHex }, WEATHERING_DEFAULTS);
}

export function stripPbrMapsAndEmission(
  mat: MeshStandardMaterial,
  opts: {
    keepAlbedo?: boolean;
    keepMetalness?: boolean;
    keepNormal?: boolean;
    keepRoughness?: boolean;
  } = {}
): void {
  if (!opts.keepAlbedo) mat.map = null;
  mat.aoMap = null;
  mat.bumpMap = null;
  mat.emissiveMap = null;
  mat.lightMap = null;
  if (!opts.keepMetalness) mat.metalnessMap = null;
  if (!opts.keepNormal) mat.normalMap = null;
  if (!opts.keepRoughness) mat.roughnessMap = null;
  mat.emissive.set(0, 0, 0);
  mat.emissiveIntensity = 0;
}

export function createWeatheredMetalMaterial(
  opts: WeatheredMetalOptions = {}
): MeshStandardMaterial {
  const color = opts.color ?? '#d4a84b';
  const opacity = opts.opacity ?? 1;
  const hasMetalnessMap = !!opts.metalnessMap;
  const hasRoughnessMap = !!opts.roughnessMap;
  const mat = new MeshStandardMaterial({
    color: new Color(color),
    envMapIntensity: opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    metalness: hasMetalnessMap ? (opts.metalness ?? 1) : (opts.metalness ?? DEFAULT_METALNESS),
    opacity,
    roughness: hasRoughnessMap ? (opts.roughness ?? 1) : (opts.roughness ?? DEFAULT_ROUGHNESS),
    side: opts.side ?? DoubleSide,
    transparent: opts.transparent ?? opacity < 1,
    ...(opts.map ? { map: opts.map } : {}),
    ...(hasMetalnessMap ? { metalnessMap: opts.metalnessMap } : {}),
    ...(opts.normalMap ? { normalMap: opts.normalMap } : {}),
    ...(hasRoughnessMap ? { roughnessMap: opts.roughnessMap } : {}),
  });
  stripPbrMapsAndEmission(mat, {
    keepAlbedo: !!opts.map,
    keepMetalness: hasMetalnessMap,
    keepNormal: !!opts.normalMap,
    keepRoughness: hasRoughnessMap,
  });
  applyObjectSpaceWeathering(mat, opts);
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

function mapsFromSource(
  mat: MeshStandardMaterial,
  opts: WeatheredMetalOptions
): Pick<
  WeatheredMetalOptions,
  'map' | 'metalness' | 'metalnessMap' | 'normalMap' | 'roughness' | 'roughnessMap'
> {
  const keepAuthoredMetalness = opts.metalness === undefined;
  return {
    ...(mat.map ? { map: mat.map } : {}),
    ...(mat.normalMap ? { normalMap: mat.normalMap } : {}),
    ...(mat.roughnessMap ? { roughness: mat.roughness, roughnessMap: mat.roughnessMap } : {}),
    ...(keepAuthoredMetalness && mat.metalnessMap
      ? { metalness: mat.metalness, metalnessMap: mat.metalnessMap }
      : {}),
  };
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

/** Mesh nodes (e.g. `RahkshiShoulders`) often differ from baked slot keys (`RahkshiShoulders_baked`). */
function resolveMaterialColorFromMap(
  lookupName: string,
  meshName: string,
  materialColorMap: Record<string, string>
): string | undefined {
  if (lookupName in materialColorMap) return materialColorMap[lookupName];
  if (meshName in materialColorMap) return materialColorMap[meshName];

  const bakedCandidates = new Set<string>();
  if (meshName && !meshName.endsWith('_baked')) bakedCandidates.add(`${meshName}_baked`);
  if (lookupName && !lookupName.endsWith('_baked')) bakedCandidates.add(`${lookupName}_baked`);

  for (const key of bakedCandidates) {
    if (key in materialColorMap) return materialColorMap[key];
  }
  return undefined;
}

/**
 * Replaces mesh materials with slot-colored weathered plastic. Skips Masks
 * subtrees and excluded material names (Brain, GlowingEyes, …). Authored
 * albedo / normal / roughness maps stay on the material and replace the
 * matching procedural FBM channel. Caller `metalness` is the weathered
 * plastic/metal amount and replaces packed metallicRoughness metalness (Rahkshi
 * roughness bakes ship a full-white B channel). Samples baked emissive
 * discoloration maps when the mesh has UVs.
 */
export function applyWeatheredMetalToObject(
  object: Object3D | null | undefined,
  opts: WeatheredMetalOptions & {
    excludeMaterialNames?: string[];
    excludeMaterialNameSubstrings?: string[];
    excludeMaterialNamesNormalized?: Set<string>;
    materialColorMap?: Record<string, string>;
    /**
     * Battle enemies that share a GLB (Rahkshi gauntlet) must not reuse the
     * weathered-material cache. Defeat dispose would otherwise poison later waves.
     */
    uniqueMaterials?: boolean;
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

      const color = hasColorMap
        ? resolveMaterialColorFromMap(lookupName, meshName, materialColorMap)
        : raw instanceof MeshStandardMaterial && raw.color
          ? raw.color.getStyle()
          : '#ffffff';

      if (!hasColorMap && isWeatheredMetalMaterial(raw)) return raw;
      if (hasColorMap && color === undefined) return raw;

      changed = true;
      const discolorationMap =
        meshHasUv(mesh) && raw instanceof MeshStandardMaterial
          ? (getBakedDiscolorationMap(raw) ?? undefined)
          : undefined;
      const nextColor = (color ?? '#ffffff') as ColorRepresentation;
      const sourceMaps = raw instanceof MeshStandardMaterial ? mapsFromSource(raw, opts) : {};
      const nextOpts = { ...opts, ...sourceMaps, color: nextColor, discolorationMap };
      return opts.uniqueMaterials
        ? createWeatheredMetalMaterial(nextOpts)
        : getWeatheredMetalMaterial(nextColor, nextOpts);
    });

    if (!changed) return;
    mesh.material = Array.isArray(rawMaterial) ? nextMaterials : nextMaterials[0];
  });
}
