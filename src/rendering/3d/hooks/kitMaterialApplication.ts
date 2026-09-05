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
  type WeatheredMetalOptions,
} from '../CharacterScene/WeatheredMetalMaterial';

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
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

/** Printed albedo (Kanoka disk, etc.) keeps the GLB look. */
function isPreservedMappedMaterial(mat: StandardMat): boolean {
  return !!mat.map;
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
): Pick<WeatheredMetalOptions, 'roughness' | 'metalness' | 'envMapIntensity'> {
  return {
    ...metalPbr,
    ...(spec?.roughness !== undefined ? { roughness: spec.roughness } : {}),
    ...(spec?.metalness !== undefined ? { metalness: spec.metalness } : {}),
    ...(spec?.envMapIntensity !== undefined ? { envMapIntensity: spec.envMapIntensity } : {}),
  };
}

function stripPreservedMappedMaterial(
  mat: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors']
): StandardMat {
  const cloned = mat.clone();
  cloned.normalMap = null;
  cloned.roughnessMap = null;
  cloned.metalnessMap = null;
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

export function buildKitMeshMaterials(
  mesh: Mesh,
  slotLookup: Map<string, KitMaterialSlotOverride>,
  palette: BaseMatoran['colors'],
  weatheredBase: WeatheredMetalOptions | undefined
): Material | Material[] | undefined {
  const raw = mesh.material;
  if (!raw) return raw;
  const mats = Array.isArray(raw) ? raw : [raw];
  const next = mats.map((mat) => {
    if (!isStandardMat(mat)) return mat;
    const spec = resolveKitMaterialSlotSpec(mat.name, slotLookup);

    if (isPreservedMappedMaterial(mat) || !spec) {
      if (!spec || (!spec.color && !spec.emissive && spec.opacity === undefined)) {
        return stripPreservedMappedMaterial(mat, undefined, palette);
      }
      return stripPreservedMappedMaterial(mat, spec, palette);
    }

    const slotColor = resolveSlotAlbedo(spec, palette, mat.color.getStyle());
    const metalPbr = metallicColorPbr(slotColor);
    const opts: WeatheredMetalOptions = {
      ...weatheredBase,
      ...mergeSlotPbr(spec, metalPbr),
    };
    if (canonicalKitSlotName(mat.name) === 'face') {
      opts.side = FrontSide;
    }
    if (isGlowMaterialName(mat.name) || spec?.emissive) {
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
  });
}
