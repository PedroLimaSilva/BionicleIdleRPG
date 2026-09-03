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
  meshHasUv,
  type WeatheredMetalOptions,
} from '../CharacterScene/WeatheredMetalMaterial';
import { hasMaskPbrMaps } from './maskMaterial';
import {
  buildTransmissiveKitMaterial,
  isTransmissiveKitMaterial,
  resolveTransmissiveKitKind,
  TRANSMISSIVE_KIT_RENDER_ORDER,
} from './transmissiveKitMaterial';

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

/** When a kit mesh adds a Secondary slot but attachments only tint Main, mirror Main. */
function resolveKitMaterialSlotSpec(
  materialName: string,
  slotLookup: Map<string, KitMaterialSlotOverride>
): KitMaterialSlotOverride | undefined {
  const direct = slotLookup.get(normalizeSlotName(materialName));
  if (direct) return direct;
  if (normalizeSlotName(materialName) === 'secondary' && slotLookup.has('main')) {
    return slotLookup.get('main');
  }
  return undefined;
}

/** Rig meshes with authored PBR maps (Kanoka disk, Great Kanohi masks, etc.) keep GLB look. */
function isPreservedMappedMaterial(mat: StandardMat): boolean {
  return hasMaskPbrMaps(mat);
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
    const spec = resolveKitMaterialSlotSpec(mat.name, slotLookup);
    const transmissiveKind = resolveTransmissiveKitKind(mat.name, spec);
    if (transmissiveKind) {
      const color = spec?.color ? resolveKitColorSource(spec.color, palette) : mat.color.getStyle();
      const emissive = spec?.emissive ? resolveKitColorSource(spec.emissive, palette) : color;
      const emissiveIntensity =
        spec?.emissiveIntensity ??
        (spec?.emissive ? (mat.emissiveIntensity > 0 ? mat.emissiveIntensity : 1) : 0);
      return buildTransmissiveKitMaterial(
        mat.name,
        transmissiveKind,
        color,
        emissive,
        emissiveIntensity
      );
    }
    // Mapped materials keep GLB textures (Kanoka disk, etc.).
    if (isPreservedMappedMaterial(mat)) {
      if (!spec || (!spec.color && !spec.emissive && spec.emissiveIntensity === undefined)) {
        return mat;
      }
      const mappedColor = spec.color ? resolveKitColorSource(spec.color, palette) : undefined;
      return buildStandardSlotMaterial(mat, spec, palette, mappedColor, undefined);
    }
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
        discolorationMap: mat.emissiveMap && meshHasUv(mesh) ? mat.emissiveMap : undefined,
      };
      const weathered = getWeatheredMetalMaterial(slotColor ?? mat.color.getStyle(), opts);
      // MataFace stalk shares a plane with brain gel — DoubleSide back-faces z-fight the gel.
      if (normalizeSlotName(mat.name) === 'face') {
        const faceMat = weathered.clone();
        faceMat.side = FrontSide;
        return faceMat;
      }
      return weathered;
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
    const applied = mesh.material;
    const appliedMats = Array.isArray(applied) ? applied : [applied];
    if (appliedMats.some(isTransmissiveKitMaterial)) {
      mesh.renderOrder = TRANSMISSIVE_KIT_RENDER_ORDER;
    }
  });
}
