import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import type { BaseMatoran } from '../types/Matoran';
import type {
  KitMaterialColorSource,
  KitMaterialSlotOverride,
  KitSocketAttachment,
} from '../types/KitParts';
import { normalizeKitMaterialSlotEntry } from '../game/kit/kitMaterialUtils';

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

function buildKitNodeIndex(scene: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  scene.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

function applyKitMaterialSlots(
  root: Object3D,
  materialColors: KitSocketAttachment['materialColors'],
  palette: BaseMatoran['colors'],
  eyesHex: string
): void {
  if (!materialColors || Object.keys(materialColors).length === 0) return;

  const lookup = new Map<string, KitMaterialSlotOverride>();
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    lookup.set(normalizeSlotName(slotName), normalizeKitMaterialSlotEntry(entry));
  }

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    const mats = Array.isArray(raw) ? raw : [raw];
    const next = mats.map((mat) => {
      if (!isStandardMat(mat)) return mat;
      const key = normalizeSlotName(mat.name);
      const spec = lookup.get(key);
      if (!spec) return mat;
      const cloned = mat.clone();
      if (spec.color) {
        cloned.color = new Color(resolveColorSource(spec.color, palette));
      }
      if (spec.roughness !== undefined) cloned.roughness = spec.roughness;
      if (spec.metalness !== undefined) cloned.metalness = spec.metalness;
      if (spec.emissiveFromEyes) {
        cloned.emissive = new Color(eyesHex);
        cloned.emissiveIntensity = spec.emissiveIntensity ?? mat.emissiveIntensity ?? 1;
      } else if (spec.emissiveIntensity !== undefined && cloned.emissive) {
        cloned.emissiveIntensity = spec.emissiveIntensity;
      }
      return cloned;
    });
    mesh.material = Array.isArray(raw) ? next : next[0];
  });
}

export type UseKitAttachmentsParams = {
  /** `nodes` from `useGLTF` on the character (must include socket names as keys when flat) */
  characterNodes: Record<string, Object3D | undefined> | undefined;
  kitUrl: string;
  /** Key = socket name on character; O(1) lookup when matching nodes to kit pieces */
  attachments: Record<string, KitSocketAttachment>;
  colors: BaseMatoran['colors'];
  /** Used for kit slots with `emissiveFromEyes` (bloom / hooks). */
  eyesColorHex: string;
  /** Bump when kit meshes change so callers can re-run effects (e.g. weathered metal) */
  onAttached?: () => void;
};

/**
 * Clones kit meshes from a shared GLB and parents them to named sockets on the character.
 * Clones materials when tinting so instances do not share edited materials.
 */
export function useKitAttachments({
  characterNodes,
  kitUrl,
  attachments,
  colors,
  eyesColorHex,
  onAttached,
}: UseKitAttachmentsParams): void {
  const gltf = useGLTF(kitUrl);
  const kitNodes = useMemo(() => buildKitNodeIndex(gltf.scene), [gltf]);
  const onAttachedRef = useRef(onAttached);
  onAttachedRef.current = onAttached;

  useEffect(() => {
    if (!characterNodes) return;

    const clones: Object3D[] = [];
    console.log('characterNodes', characterNodes);

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
      applyKitMaterialSlots(clone, row.materialColors, colors, eyesColorHex);
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
  }, [characterNodes, kitUrl, attachments, colors, eyesColorHex, kitNodes]);
}

useKitAttachments.preload = (kitUrl: string) => {
  useGLTF.preload(kitUrl);
};
