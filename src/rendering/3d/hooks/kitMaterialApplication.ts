import {
  Color,
  FrontSide,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import type { BaseMatoran } from '../../../types/Matoran';
import {
  type KitMaterialColorSource,
  type KitMaterialSlotEntry,
  type KitMaterialSlotOverride,
} from '../../../types/KitParts';
import { getBodyPartSlotColor } from '../../../game/characters/matoranColors';
import {
  canonicalKitSlotName,
  normalizeKitMaterialSlotEntry,
  normalizeKitSlotName,
} from '../kit/kitMaterialUtils';
import { metallicColorPbr, type KitMetalPbr } from '../kit/palettes/metalPbr';
import {
  getWeatheredMetalMaterial,
  isWeatheredMetalMaterial,
  meshHasUv,
  type WeatheredMetalOptions,
} from '../CharacterScene/WeatheredMetalMaterial';
import { bindBakedDiscolorationMapNode, getBakedDiscolorationMap } from './bakedDiscoloration';
import {
  buildTransmissiveKitMaterial,
  isTransmissiveKitMaterial,
  resolveTransmissiveKitKind,
  TRANSMISSIVE_KIT_RENDER_ORDER,
} from './transmissiveKitMaterial';
import {
  applySelectiveBloomMrt,
  isSelectiveBloomKitGlowName,
} from '../CharacterScene/selectiveBloom';
import { markSharedGpuResource } from '../utils/disposeThreeObject';
import { setTopologyProgramCacheKey } from '../tsl/topologyCacheKey';

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;
type WeatheredTslMat = StandardMat & {
  colorNode?: unknown;
  metalnessNode?: unknown;
  roughnessNode?: unknown;
};

/** Stashed GLB slot names so a second apply can still resolve `WeatheredMetal`. */
const KIT_SLOT_MATERIAL_NAMES_KEY = 'kitSlotMaterialNames';

function isStandardMat(mat: unknown): mat is StandardMat {
  const candidate = mat as {
    isMeshPhysicalMaterial?: boolean;
    isMeshStandardMaterial?: boolean;
  };
  return candidate?.isMeshPhysicalMaterial === true || candidate?.isMeshStandardMaterial === true;
}

function stashKitSlotMaterialName(mesh: Mesh, index: number, mat: StandardMat): void {
  if (!mat.name || mat.name === 'WeatheredMetal') return;
  const names = (mesh.userData[KIT_SLOT_MATERIAL_NAMES_KEY] as string[] | undefined) ?? [];
  names[index] = mat.name;
  mesh.userData[KIT_SLOT_MATERIAL_NAMES_KEY] = names;
}

function readKitSlotMaterialName(mesh: Mesh, index: number, fallback: string): string {
  const names = mesh.userData[KIT_SLOT_MATERIAL_NAMES_KEY] as string[] | undefined;
  return names?.[index] || fallback;
}

function hasWeatheringGraph(mat: StandardMat): boolean {
  const tsl = mat as WeatheredTslMat;
  return tsl.colorNode != null || tsl.roughnessNode != null || tsl.metalnessNode != null;
}

/** Cached weathered TSL — not a `Material.clone()` that dropped `colorNode`. */
function isLiveWeatheredKitMaterial(mat: StandardMat): boolean {
  return isWeatheredMetalMaterial(mat) && hasWeatheringGraph(mat);
}

export function resolveKitColorSource(
  source: KitMaterialColorSource,
  palette: BaseMatoran['colors']
): string {
  if (source.kind === 'lego') return source.value;
  if (source.kind === 'part') {
    return getBodyPartSlotColor(palette, source.part, source.slot);
  }
  return palette[source.key];
}

function isGlowMaterialName(name: string | undefined): boolean {
  return !!name && name.toLowerCase().includes('glow');
}

const emissiveKitCache = new Map<string, StandardMat>();

function emissiveKitCacheKey(
  mat: StandardMat,
  spec: KitMaterialSlotOverride,
  palette: BaseMatoran['colors']
): string {
  const color = spec.color ? resolveKitColorSource(spec.color, palette) : mat.color.getStyle();
  const emissive = spec.emissive ? resolveKitColorSource(spec.emissive, palette) : '';
  const bloom = isSelectiveBloomKitGlowName(mat.name) ? 1 : 0;
  return [
    mat.name,
    color,
    emissive,
    spec.emissiveIntensity ?? (mat.emissiveIntensity > 0 ? mat.emissiveIntensity : 1),
    spec.metalness ?? '',
    spec.roughness ?? '',
    spec.envMapIntensity ?? '',
    spec.opacity ?? '',
    bloom,
    mat.map?.uuid ?? '',
  ].join('|');
}

function kitGlowProgramCacheKey(name: string | undefined): string {
  return `kitGlow|bloom${isSelectiveBloomKitGlowName(name) ? 1 : 0}`;
}

function buildEmissiveKitMaterial(
  mat: StandardMat,
  spec: KitMaterialSlotOverride,
  palette: BaseMatoran['colors']
): StandardMat {
  const key = emissiveKitCacheKey(mat, spec, palette);
  const cached = emissiveKitCache.get(key);
  if (cached) return cached;

  const cloned = mat.clone();
  cloned.emissiveMap = null;
  if (spec.color) cloned.color = new Color(resolveKitColorSource(spec.color, palette));
  if (spec.emissive) {
    cloned.emissive = new Color(resolveKitColorSource(spec.emissive, palette));
  }
  cloned.emissiveIntensity =
    spec.emissiveIntensity ?? (mat.emissiveIntensity > 0 ? mat.emissiveIntensity : 1);
  if (spec.metalness !== undefined) cloned.metalness = spec.metalness;
  if (spec.roughness !== undefined) cloned.roughness = spec.roughness;
  if (spec.envMapIntensity !== undefined) cloned.envMapIntensity = spec.envMapIntensity;
  if (spec.opacity !== undefined) {
    cloned.opacity = spec.opacity;
    cloned.transparent = spec.opacity < 1;
  }
  if (isSelectiveBloomKitGlowName(cloned.name)) {
    applySelectiveBloomMrt(cloned);
  }
  setTopologyProgramCacheKey(cloned, kitGlowProgramCacheKey(cloned.name));
  markSharedGpuResource(cloned);
  emissiveKitCache.set(key, cloned);
  return cloned;
}

/** When a kit mesh adds a Secondary slot but attachments only tint Main, mirror Main. */
function resolveKitMaterialSlotSpec(
  materialName: string,
  slotLookup: Map<string, KitMaterialSlotOverride>
): KitMaterialSlotOverride | undefined {
  const normalized = normalizeKitSlotName(materialName);
  const direct = slotLookup.get(normalized);
  if (direct) return direct;
  const canonical = canonicalKitSlotName(materialName);
  if (canonical !== normalized) {
    const aliased = slotLookup.get(canonical);
    if (aliased) return aliased;
  }
  if (canonical === 'secondary' && slotLookup.has('main')) {
    return slotLookup.get('main');
  }
  return undefined;
}

/**
 * Printed albedo (Kanoka disk, etc.) keeps the GLB look — unless this pass
 * asked for FBM metalness / roughness (`authoredPbrMaps: 'noise'`).
 */
function isPreservedMappedMaterial(
  mat: StandardMat,
  weatheredBase: WeatheredMetalOptions | undefined
): boolean {
  return !!mat.map && weatheredBase?.authoredPbrMaps !== 'noise';
}

export function buildKitMaterialSlotLookup(
  materialColors: Partial<Record<string, KitMaterialSlotEntry>> | undefined
): Map<string, KitMaterialSlotOverride> {
  const lookup = new Map<string, KitMaterialSlotOverride>();
  if (!materialColors) return lookup;
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    lookup.set(normalizeKitSlotName(slotName), normalizeKitMaterialSlotEntry(entry));
  }
  return lookup;
}

function resolveSlotAlbedo(
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors'],
  fallback: string
): string {
  if (spec?.color) return resolveKitColorSource(spec.color, palette);
  if (spec?.emissive) return resolveKitColorSource(spec.emissive, palette);
  return fallback;
}

function mergeSlotPbr(
  spec: KitMaterialSlotOverride | undefined,
  metalPbr: KitMetalPbr | undefined
): Pick<
  WeatheredMetalOptions,
  | 'envMapIntensity'
  | 'fineScale'
  | 'grimeDarken'
  | 'grimeMetalnessReduce'
  | 'grimeRoughness'
  | 'largeScale'
  | 'metalness'
  | 'roughness'
> {
  return {
    ...metalPbr,
    ...(spec?.roughness !== undefined ? { roughness: spec.roughness } : {}),
    ...(spec?.metalness !== undefined ? { metalness: spec.metalness } : {}),
    ...(spec?.envMapIntensity !== undefined ? { envMapIntensity: spec.envMapIntensity } : {}),
    ...(spec?.grimeDarken !== undefined ? { grimeDarken: spec.grimeDarken } : {}),
    ...(spec?.grimeRoughness !== undefined ? { grimeRoughness: spec.grimeRoughness } : {}),
    ...(spec?.grimeMetalnessReduce !== undefined
      ? { grimeMetalnessReduce: spec.grimeMetalnessReduce }
      : {}),
    ...(spec?.fineScale !== undefined ? { fineScale: spec.fineScale } : {}),
    ...(spec?.largeScale !== undefined ? { largeScale: spec.largeScale } : {}),
  };
}

function stripPreservedMappedMaterial(
  mat: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors']
): StandardMat {
  const cloned = mat.clone();
  cloned.aoMap = null;
  cloned.emissiveMap = null;
  cloned.emissive.set(0, 0, 0);
  cloned.emissiveIntensity = 0;
  if (cloned instanceof MeshPhysicalMaterial) {
    cloned.transmissionMap = null;
    cloned.sheenColorMap = null;
    cloned.clearcoatMap = null;
    cloned.clearcoatNormalMap = null;
    cloned.clearcoatRoughnessMap = null;
  }
  if (spec?.color) cloned.color = new Color(resolveKitColorSource(spec.color, palette));
  if (spec?.opacity !== undefined) {
    cloned.opacity = spec.opacity;
    cloned.transparent = spec.opacity < 1;
  }
  return cloned;
}

/**
 * Skinned battle meshes can skip TSL object-update, so the shared bake sample
 * stays on the black compile dummy. Rebind `aoMap` for the material about to draw.
 */
function rebindDiscolorationBakeOnRender(mesh: Mesh): void {
  const applied = mesh.material;
  const mats = Array.isArray(applied) ? applied : [applied];
  if (!mats.some((mat) => mat && getBakedDiscolorationMap(mat as MeshStandardMaterial))) {
    return;
  }
  const previous = mesh.onBeforeRender.bind(mesh);
  mesh.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
    previous(renderer, scene, camera, geometry, material, group);
    bindBakedDiscolorationMapNode(material as MeshStandardMaterial);
  };
}

export function buildKitMeshMaterials(
  mesh: Mesh,
  slotLookup: Map<string, KitMaterialSlotOverride>,
  palette: BaseMatoran['colors'],
  weatheredBase: WeatheredMetalOptions | undefined
): Material | Material[] | undefined {
  const raw = mesh.material;
  if (!raw) return raw;
  const mats = Array.isArray(raw) ? raw : [raw];
  const next = mats.map((mat, index) => {
    if (!isStandardMat(mat)) return mat;
    stashKitSlotMaterialName(mesh, index, mat);
    const slotName = readKitSlotMaterialName(mesh, index, mat.name);
    const spec = resolveKitMaterialSlotSpec(slotName, slotLookup);
    const transmissiveKind = resolveTransmissiveKitKind(slotName, spec);
    if (transmissiveKind) {
      const color = spec?.color ? resolveKitColorSource(spec.color, palette) : '#ffffff';
      const emissive = spec?.emissive ? resolveKitColorSource(spec.emissive, palette) : '#000000';
      const emissiveIntensity = spec?.emissiveIntensity ?? 0;
      return buildTransmissiveKitMaterial(
        slotName,
        transmissiveKind,
        color,
        emissive,
        emissiveIntensity
      );
    }

    if (spec?.emissive) {
      return buildEmissiveKitMaterial(mat, spec, palette);
    }

    if (isLiveWeatheredKitMaterial(mat)) {
      if (!spec) return mat;
      const slotColor = resolveSlotAlbedo(spec, palette, mat.color.getStyle());
      if (new Color(slotColor).equals(mat.color)) return mat;
    }

    if (
      (isPreservedMappedMaterial(mat, weatheredBase) || !spec) &&
      !isLiveWeatheredKitMaterial(mat)
    ) {
      if (!spec || (!spec.color && !spec.emissive && spec.opacity === undefined)) {
        return stripPreservedMappedMaterial(mat, undefined, palette);
      }
      return stripPreservedMappedMaterial(mat, spec, palette);
    }

    if (!spec) return mat;

    const slotColor = resolveSlotAlbedo(spec, palette, mat.color.getStyle());
    const metalPbr = metallicColorPbr(slotColor);
    const opts: WeatheredMetalOptions = {
      ...weatheredBase,
      ...mergeSlotPbr(spec, metalPbr),
    };
    if (mat.map) opts.map = mat.map;
    if (mat.normalMap) opts.normalMap = mat.normalMap;
    const useNoisePbr = weatheredBase?.authoredPbrMaps === 'noise';
    if (!useNoisePbr && mat.roughnessMap) {
      opts.roughness = mat.roughness;
      opts.roughnessMap = mat.roughnessMap;
    }
    if (!useNoisePbr && mat.metalnessMap) {
      opts.metalness = mat.metalness;
      opts.metalnessMap = mat.metalnessMap;
    }
    const bake = meshHasUv(mesh)
      ? (getBakedDiscolorationMap(mat) ?? mat.emissiveMap ?? undefined)
      : undefined;
    if (bake) opts.discolorationMap = bake;
    if (canonicalKitSlotName(slotName) === 'face') {
      opts.side = FrontSide;
    }
    if (isGlowMaterialName(slotName)) {
      opts.metalness = spec?.metalness ?? 0.05;
      opts.roughness = spec?.roughness ?? 0.45;
    }
    if (spec?.opacity !== undefined) {
      opts.opacity = spec.opacity;
      opts.transparent = spec.opacity < 1;
    }
    return getWeatheredMetalMaterial(slotColor, opts);
  });
  return Array.isArray(raw) ? next : next[0];
}

/** Applies kit-style material overrides to every mesh under `root` (inclusive). */
export function applyKitMaterialsToObject(
  root: Object3D,
  slotLookup: Map<string, KitMaterialSlotOverride>,
  palette: BaseMatoran['colors'],
  weatheredBase: WeatheredMetalOptions | undefined
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const next = buildKitMeshMaterials(mesh, slotLookup, palette, weatheredBase);
    if (next !== undefined) mesh.material = next as Mesh['material'];
    const applied = mesh.material;
    const appliedMats = Array.isArray(applied) ? applied : [applied];
    if (appliedMats.some(isTransmissiveKitMaterial)) {
      mesh.renderOrder = TRANSMISSIVE_KIT_RENDER_ORDER;
    }
    rebindDiscolorationBakeOnRender(mesh);
  });
}
