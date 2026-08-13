import { Color, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import type { BaseMatoran } from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import {
  KIT_MATERIAL_WEATHERED_OPTION_KEYS,
  type KitMaterialColorSource,
  type KitMaterialSlotEntry,
  type KitMaterialSlotOverride,
} from '../types/KitParts';
import { normalizeKitMaterialSlotEntry } from '../game/kit/kitMaterialUtils';
import {
  getWeatheredMetalMaterial,
  type WeatheredMetalOptions,
} from '../components/CharacterScene/WeatheredMetalMaterial';

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

export function resolveKitColorSource(
  source: KitMaterialColorSource,
  palette: BaseMatoran['colors']
): string {
  if (source.kind === 'lego') return source.value;
  if (source.key === 'weaponGlow') {
    return palette.weaponGlow ?? LegoColor.TransNeonYellow;
  }
  return palette[source.key];
}

function normalizeSlotName(name: string): string {
  return name.trim().toLowerCase();
}

function isGlowMaterialName(name: string | undefined): boolean {
  return !!name && name.toLowerCase().includes('glow');
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
  palette: BaseMatoran['colors']
): StandardMat {
  if (!spec) return base;
  const cloned = base.clone();
  if (spec.color) cloned.color = new Color(resolveKitColorSource(spec.color, palette));
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
  return cloned;
}

function resolveWeatheredColor(
  base: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors']
): string {
  if (spec?.color) return resolveKitColorSource(spec.color, palette);
  return base.color.getStyle();
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
    const spec = slotLookup.get(normalizeSlotName(mat.name));

    // Only tint configured slots — unmapped materials keep their GLB look instead of
    // re-weathering from stale mesh.material.color (character-switch bug on rig meshes).
    if (weatheredBase && spec && shouldApplyWeathered(spec, mat.name)) {
      const opts: WeatheredMetalOptions = {
        ...weatheredBase,
        ...mergeSlotWeatheredOpts(spec),
      };
      const color = resolveWeatheredColor(mat, spec, palette);
      return getWeatheredMetalMaterial(color, opts);
    }

    return buildStandardSlotMaterial(mat, spec, palette);
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
