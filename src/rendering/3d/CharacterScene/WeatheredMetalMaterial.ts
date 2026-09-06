/**
 * Weathered kit plastic/metal: object-space FBM that darkens albedo, raises
 * roughness, lowers metalness, and bumps the shading normal in the same
 * local-space patches. Optional baked emissive discoloration (glTF `emissiveMap`)
 * mixes on top. Edgewear stays off.
 */

import {
  ClampToEdgeWrapping,
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  Object3D,
  Side,
  Texture,
  Vector2,
} from 'three';
import {
  faceDirection,
  materialColor,
  materialMetalness,
  materialRoughness,
  mix,
  mx_noise_float,
  normalView,
  positionLocal,
  positionView,
  vec2,
} from 'three/tsl';
import {
  bakedDiscolorationAmountNode,
  createBakedDiscolorationUniforms,
  DISCOLORATION_MAP_USERDATA_KEY,
} from '../hooks/bakedDiscoloration';

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
const DEFAULT_GRIME_DARKEN = 0.5;
const DEFAULT_GRIME_ROUGHNESS = 0.35;
const DEFAULT_GRIME_METALNESS_REDUCE = 0.7;
/** Object-space scale for large grime/dent clouds. Lower = bigger patches. 2.6 is slightly broader than master's 3.5 because MaterialX noise is finer than the old hash FBM. */
const DEFAULT_LARGE_SCALE = 2.6;
const DEFAULT_FINE_SCALE = 18.0;
const DEFAULT_ENV_MAP_INTENSITY = 0.4;
/** Screen-space bump from the master large-cloud FBM (`largeScale`, not fine grain). */
const DEFAULT_DENT_STRENGTH = 2;
/**
 * Metalness kills dent bump. Specular/env highlights turn tiny slopes into
 * crumpled foil, so 0.9 metal keeps ~20% of the plastic gain.
 */
const METAL_DENT_ATTENUATION = 0.88;
/** Fine-grain roughness wobble around the base, matching the master FBM path. */
const FINE_ROUGHNESS_VARIATION = 0.08;

const MATERIAL_NAME = 'WeatheredMetal';

const materialCache = new Map<string, MeshStandardMaterial>();

type WeatheredTslMaterial = MeshStandardMaterial & {
  colorNode?: unknown;
  metalnessNode?: unknown;
  normalNode?: unknown;
  roughnessNode?: unknown;
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
    opts.envMapIntensity ?? DEFAULT_ENV_MAP_INTENSITY,
    opts.opacity ?? 1,
    opts.transparent ? 't' : '',
    opts.side ?? DoubleSide,
  ].join('|');
}

/** Three-octave 0–1 FBM in the mesh's local position, same layout as master's GLSL. */
function objectSpaceFbm(offset: number, scale: number) {
  const p = positionLocal.add(offset).mul(scale);
  const n1 = mx_noise_float(p, 0.5, 0.5);
  const n2 = mx_noise_float(p.mul(2), 0.5, 0.5);
  const n3 = mx_noise_float(p.mul(4), 0.5, 0.5);
  return n1.mul(0.5).add(n2.mul(0.25)).add(n3.mul(0.125));
}

/**
 * Dent height skips the 4× octave. Screen-space dFdx/dFdy lock onto the finest
 * term, which turned the large-cloud bump into pockmarks in E2E snapshots.
 */
function objectSpaceDentHeight(offset: number, scale: number) {
  const p = positionLocal.add(offset).mul(scale);
  const n1 = mx_noise_float(p, 0.5, 0.5);
  const n2 = mx_noise_float(p.mul(2), 0.5, 0.5);
  return n1.mul(0.7).add(n2.mul(0.3));
}

/**
 * Mikkelsen screen-space bump from a scalar height, same as Three's `bumpMap`
 * but for a procedural float instead of a texture.
 */
function perturbViewNormalFromHeight(
  height: ReturnType<typeof objectSpaceFbm> | ReturnType<typeof objectSpaceDentHeight>,
  bumpScale: number
) {
  const dHdxy = vec2(height.dFdx(), height.dFdy()).mul(bumpScale);
  const vSigmaX = positionView.dFdx().normalize();
  const vSigmaY = positionView.dFdy().normalize();
  const vN = normalView;
  const R1 = vSigmaY.cross(vN);
  const R2 = vN.cross(vSigmaX);
  const fDet = vSigmaX.dot(R1).mul(faceDirection);
  const vGrad = fDet.sign().mul(dHdxy.x.mul(R1).add(dHdxy.y.mul(R2)));
  return fDet.abs().mul(vN).sub(vGrad).normalize();
}

function applyObjectSpaceWeathering(mat: WeatheredTslMaterial, opts: WeatheredMetalOptions): void {
  const grimeDarken = opts.grimeDarken ?? DEFAULT_GRIME_DARKEN;
  const grimeRoughness = opts.grimeRoughness ?? DEFAULT_GRIME_ROUGHNESS;
  const grimeMetalnessReduce = opts.grimeMetalnessReduce ?? DEFAULT_GRIME_METALNESS_REDUCE;
  const metalness = opts.metalness ?? DEFAULT_METALNESS;
  const dentStrength =
    (opts.dentStrength ?? DEFAULT_DENT_STRENGTH) *
    (1 - Math.min(1, Math.max(0, metalness)) * METAL_DENT_ATTENUATION);
  const largeScale = opts.largeScale ?? DEFAULT_LARGE_SCALE;
  const fineScale = opts.fineScale ?? DEFAULT_FINE_SCALE;
  const largeCloud = objectSpaceFbm(50, largeScale);
  const fineGrain = objectSpaceFbm(80, fineScale);
  const grime = largeCloud.sub(0.35).mul(2).clamp(0, 1);
  const discolorMap = opts.discolorationMap ?? null;
  if (discolorMap) {
    discolorMap.colorSpace = NoColorSpace;
    discolorMap.wrapS = ClampToEdgeWrapping;
    discolorMap.wrapT = ClampToEdgeWrapping;
    mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = discolorMap;
  } else {
    mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = null;
  }

  const colorHex = `#${new Color(opts.color ?? mat.color).getHexString()}`;
  const bakeUniforms = createBakedDiscolorationUniforms(discolorMap, colorHex);
  const grimyAlbedo =
    grimeDarken > 0 ? materialColor.mul(grime.mul(grimeDarken).oneMinus()) : materialColor;
  if (discolorMap) {
    mat.colorNode = mix(
      grimyAlbedo,
      bakeUniforms.color,
      bakedDiscolorationAmountNode(discolorMap, bakeUniforms)
    );
  } else if (grimeDarken > 0) {
    mat.colorNode = grimyAlbedo;
  }
  mat.roughnessNode = materialRoughness
    .add(grime.mul(grimeRoughness))
    .add(fineGrain.sub(0.5).mul(FINE_ROUGHNESS_VARIATION))
    .clamp(0.04, 1);
  mat.metalnessNode = materialMetalness.mul(grime.mul(grimeMetalnessReduce).oneMinus()).clamp(0, 1);
  if (dentStrength > 0) {
    mat.normalNode = perturbViewNormalFromHeight(
      objectSpaceDentHeight(50, largeScale),
      dentStrength
    );
  }
  mat.customProgramCacheKey = () =>
    `WeatheredMetal|d${grimeDarken}|r${grimeRoughness}|m${grimeMetalnessReduce}|n${dentStrength}|L${largeScale}|F${fineScale}|dc${discolorMap?.uuid ?? 'none'}`;
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
 * Replaces mesh materials with slot-colored weathered plastic. Skips Masks
 * subtrees and excluded material names (Brain, GlowingEyes, …). Samples baked
 * emissive discoloration maps when the mesh has UVs.
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
      const discolorationMap =
        meshHasUv(mesh) && raw instanceof MeshStandardMaterial
          ? (raw.emissiveMap ?? undefined)
          : undefined;
      const nextColor = (color ?? '#ffffff') as ColorRepresentation;
      return opts.uniqueMaterials
        ? createWeatheredMetalMaterial({ ...opts, color: nextColor, discolorationMap })
        : getWeatheredMetalMaterial(nextColor, { ...opts, discolorationMap });
    });

    if (!changed) return;
    mesh.material = Array.isArray(rawMaterial) ? nextMaterials : nextMaterials[0];
  });
}
