import { useEffect, useMemo, useRef } from 'react';
import { Color, Material, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import type { BaseMatoran } from '../types/Matoran';
import type {
  KitMaterialColorSource,
  KitMaterialSlotOverride,
  KitSocketAttachment,
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

function resolveColorSource(
  source: KitMaterialColorSource,
  palette: BaseMatoran['colors']
): string {
  return source.kind === 'lego' ? source.value : palette[source.key];
}

function normalizeSlotName(name: string): string {
  return name.trim().toLowerCase();
}

function isGlowMaterialName(name: string | undefined): boolean {
  return !!name && name.toLowerCase().includes('glow');
}

function buildKitNodeIndex(scene: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  scene.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

function buildSlotLookup(
  materialColors: KitSocketAttachment['materialColors']
): Map<string, KitMaterialSlotOverride> {
  const lookup = new Map<string, KitMaterialSlotOverride>();
  if (!materialColors) return lookup;
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    lookup.set(normalizeSlotName(slotName), normalizeKitMaterialSlotEntry(entry));
  }
  return lookup;
}

/**
 * Whether this slot should receive the character's weathered-metal pass.
 * Emissive slots and glow-named materials default to plain (skip weathering);
 * anything else defaults to weathered. Config can override both directions via
 * `weathered: true | false`.
 */
function shouldApplyWeathered(
  spec: KitMaterialSlotOverride | undefined,
  materialName: string
): boolean {
  if (spec?.weathered !== undefined) return spec.weathered;
  if (spec?.emissive) return false;
  if (isGlowMaterialName(materialName)) return false;
  return true;
}

/**
 * Builds a standard cloned material with per-slot color / PBR / emissive applied.
 * Used for glow slots, weathered opt-outs, and the baseline when no character
 * weathered pass is configured.
 */
function buildStandardSlotMaterial(
  base: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors']
): StandardMat {
  if (!spec) return base;
  const cloned = base.clone();
  if (spec.color) cloned.color = new Color(resolveColorSource(spec.color, palette));
  if (spec.roughness !== undefined) cloned.roughness = spec.roughness;
  if (spec.metalness !== undefined) cloned.metalness = spec.metalness;
  if (spec.emissive) {
    cloned.emissive = new Color(resolveColorSource(spec.emissive, palette));
    cloned.emissiveIntensity =
      spec.emissiveIntensity ?? (base.emissiveIntensity > 0 ? base.emissiveIntensity : 1);
  } else if (spec.emissiveIntensity !== undefined) {
    cloned.emissiveIntensity = spec.emissiveIntensity;
  }
  return cloned;
}

/**
 * Resolves the target color for a weathered material: slot-config color takes
 * precedence, otherwise we fall back to whatever the GLB shipped with.
 */
function resolveWeatheredColor(
  base: StandardMat,
  spec: KitMaterialSlotOverride | undefined,
  palette: BaseMatoran['colors']
): string {
  if (spec?.color) return resolveColorSource(spec.color, palette);
  return base.color.getStyle();
}

function buildMeshMaterials(
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

    if (weatheredBase && shouldApplyWeathered(spec, mat.name)) {
      const opts: WeatheredMetalOptions = {
        ...weatheredBase,
        ...(spec?.roughness !== undefined ? { roughness: spec.roughness } : null),
        ...(spec?.metalness !== undefined ? { metalness: spec.metalness } : null),
      };
      const color = resolveWeatheredColor(mat, spec, palette);
      return getWeatheredMetalMaterial(color, opts);
    }

    return buildStandardSlotMaterial(mat, spec, palette);
  });
  return Array.isArray(raw) ? next : next[0];
}

export type UseKitAttachmentsParams = {
  /** `nodes` from `useGLTF` on the character (must include socket names as keys when flat) */
  characterNodes: Record<string, Object3D | undefined> | undefined;
  kitUrl: string;
  /** Key = socket name on character; O(1) lookup when matching nodes to kit pieces */
  attachments: Record<string, KitSocketAttachment>;
  colors: BaseMatoran['colors'];
  /**
   * Character-level weathered-metal options. When set, kit materials default to
   * weathered; individual slots opt out via `emissive`, a glow material name,
   * or an explicit `weathered: false`. Omit to keep the kit GLB's raw look.
   */
  weathered?: WeatheredMetalOptions;
  /** After kit clones attach (e.g. refresh selective bloom). */
  onAttached?: () => void;
};

/**
 * Clones kit meshes from a shared GLB, parents them to named sockets on the
 * character, and finalizes their materials in a single traversal:
 *   - glow / opt-out slots get cloned `MeshStandardMaterial`s with per-slot overrides;
 *   - everything else (when `weathered` is provided) gets a cached weathered metal
 *     material keyed by color + effective PBR options.
 *
 * No post-hoc tree walk is needed — materials are decided once here, and the
 * weathered shared cache is reused across instances with the same spec.
 */
export function useKitAttachments({
  attachments,
  characterNodes,
  colors,
  kitUrl,
  onAttached,
  weathered,
}: UseKitAttachmentsParams): void {
  const gltf = useGLTF(kitUrl);
  const kitNodes = useMemo(() => buildKitNodeIndex(gltf.scene), [gltf]);
  const onAttachedRef = useRef(onAttached);
  onAttachedRef.current = onAttached;

  useEffect(() => {
    if (!characterNodes) return;

    console.log('characterNodes', characterNodes);

    const clones: Object3D[] = [];

    for (const [socketName, row] of Object.entries(attachments)) {
      const socket = characterNodes[socketName];
      const template = kitNodes[row.kitNodeName];

      if (!socket) {
        console.warn(`[useKitAttachments] Socket '${socketName}' not found on character`);
        continue;
      }
      if (!template) {
        console.warn(`[useKitAttachments] Kit node '${row.kitNodeName}' not found in ${kitUrl}`);
        continue;
      }

      const clone = template.clone(true);
      clone.position.set(0, 0, 0);
      clone.rotation.set(0, 0, 0);
      clone.scale.set(1, 1, 1);

      const slotLookup = buildSlotLookup(row.materialColors);
      clone.traverse((child) => {
        if (!(child as Mesh).isMesh) return;
        const mesh = child as Mesh;
        const next = buildMeshMaterials(mesh, slotLookup, colors, weathered);
        if (next !== undefined) mesh.material = next as Mesh['material'];
      });

      socket.add(clone);
      clones.push(clone);
    }

    onAttachedRef.current?.();

    return () => {
      for (const clone of clones) {
        const p = clone.parent;
        if (p) p.remove(clone);
      }
    };
  }, [characterNodes, kitUrl, attachments, colors, kitNodes, weathered]);
}

useKitAttachments.preload = (kitUrl: string) => {
  useGLTF.preload(kitUrl);
};
