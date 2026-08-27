import { Color, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import type { BaseMatoran } from '../../../types/Matoran';
import {
  KIT_MATERIAL_WEATHERED_OPTION_KEYS,
  type KitMaterialColorSource,
  type KitMaterialSlotEntry,
  type KitMaterialSlotOverride,
} from '../../../types/KitParts';
import { getBodyPartSlotColor } from '../../../game/characters/matoranColors';
import { normalizeKitMaterialSlotEntry } from '../kit/kitMaterialUtils';
import { metallicColorPbr, type KitMetalPbr } from '../kit/palettes/metalPbr';
import {
  getWeatheredMetalMaterial,
  type WeatheredMetalOptions,
} from '../CharacterScene/WeatheredMetalMaterial';
import { hasMaskPbrMaps } from './maskMaterial';

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

function normalizeSlotName(name: string): string {
  return name.trim().toLowerCase();
}

function isGlowMaterialName(name: string | undefined): boolean {
  return !!name && name.toLowerCase().includes('glow');
}

/** Rig meshes with baked PBR (masks, Vakama's Kanoka disk, etc.) keep GLB-authored look. */
function isPreservedBakedMaterial(mat: StandardMat): boolean {
  if (hasMaskPbrMaps(mat)) return true;
  return mat.name.toLowerCase().includes('_baked');
}

export function buildKitMaterialSlotLookup(
  materialColors: Partial<Record<string, KitMaterialSlotEntry>> | undefined
): Map<string, KitMaterialSlotOverride> {
  const lookup = new Map<string, KitMaterialSlotOverride>();
  if (!materialColors) return lookup;
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    lookup.set(normalizeSlotName(slotName), normalizeKitMaterialSlotEntry(entry));
  }
  return lookup;
}

function shouldApplyWeathered(
  spec: KitMaterialSlotOverride | undefined,
  materialName: string
): boolean {
  if (spec?.weathered !== undefined) return spec.weathered;
  if (spec?.emissive) return false;
  if (isGlowMaterialName(materialName)) return false;
  return true;
}

function buildStandardSlotMaterial(
  base: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors'],
  slotColor: string | undefined,
  metalPbr: KitMetalPbr | undefined
): StandardMat {
  if (!spec) return base;
  const cloned = base.clone();
  if (slotColor) cloned.color = new Color(slotColor);
  if (metalPbr) {
    if (metalPbr.roughness !== undefined) cloned.roughness = metalPbr.roughness;
    if (metalPbr.metalness !== undefined) cloned.metalness = metalPbr.metalness;
    if (metalPbr.envMapIntensity !== undefined) cloned.envMapIntensity = metalPbr.envMapIntensity;
  }
  if (spec.roughness !== undefined) cloned.roughness = spec.roughness;
  if (spec.metalness !== undefined) cloned.metalness = spec.metalness;
  if (spec.envMapIntensity !== undefined) cloned.envMapIntensity = spec.envMapIntensity;
  if (spec.emissive) {
    cloned.emissive = new Color(resolveKitColorSource(spec.emissive, palette));
    cloned.emissiveIntensity =
      spec.emissiveIntensity ?? (base.emissiveIntensity > 0 ? base.emissiveIntensity : 1);
  } else if (spec.emissiveIntensity !== undefined) {
    cloned.emissiveIntensity = spec.emissiveIntensity;
  }
  if (spec.opacity !== undefined) {
    cloned.opacity = spec.opacity;
    cloned.transparent = spec.opacity < 1;
  }
  return cloned;
}

function mergeSlotWeatheredOpts(
  spec: KitMaterialSlotOverride | undefined
): Partial<WeatheredMetalOptions> {
  if (!spec) return {};
  const out: Partial<WeatheredMetalOptions> = {};
  if (spec.roughness !== undefined) out.roughness = spec.roughness;
  if (spec.metalness !== undefined) out.metalness = spec.metalness;
  for (const key of KIT_MATERIAL_WEATHERED_OPTION_KEYS) {
    const v = spec[key];
    if (v !== undefined) {
      (out as Record<string, string | number>)[key] = v;
    }
  }
  return out;
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
    if (isPreservedBakedMaterial(mat)) return mat;
    const spec = slotLookup.get(normalizeSlotName(mat.name));
    const slotColor = spec?.color ? resolveKitColorSource(spec.color, palette) : undefined;
    // Metallic plastics (gold) shine on any slot, not just Metal; the slot's own
    // PBR still wins so a Metal entry can tune its own look.
    const metalPbr = slotColor ? metallicColorPbr(slotColor) : undefined;

    // Only tint configured slots — unmapped materials keep their GLB look instead of
    // re-weathering from stale mesh.material.color (character-switch bug on rig meshes).
    if (weatheredBase && spec && shouldApplyWeathered(spec, mat.name)) {
      const opts: WeatheredMetalOptions = {
        ...weatheredBase,
        ...metalPbr,
        ...mergeSlotWeatheredOpts(spec),
      };
      return getWeatheredMetalMaterial(slotColor ?? mat.color.getStyle(), opts);
    }

    return buildStandardSlotMaterial(mat, spec, palette, slotColor, metalPbr);
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
