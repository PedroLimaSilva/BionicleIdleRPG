import { useEffect, useMemo, useRef } from 'react';
import { Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import type { BaseMatoran } from '../../../types/Matoran';
import type { KitSocketAttachment } from '../../../types/KitParts';
import { KIT_2001_NODES } from '../kit/nodes/kit2001Nodes';
import type { WeatheredMetalOptions } from '../CharacterScene/WeatheredMetalMaterial';
import { normalizeMatoranColors } from '../../../game/characters/matoranColors';
import { applyKitMaterialsToObject, buildKitMaterialSlotLookup } from './kitMaterialApplication';
import { notifyModelReadyForTestMode } from '../../../utils/testMode';

function buildKitNodeIndex(scene: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  scene.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

export type UseKitAttachmentsParams = {
  /** `nodes` from `useGLTF` on the character (must include socket names as keys when flat) */
  characterNodes: Record<string, Object3D | undefined> | undefined;
  kitUrl: string;
  /** Key = socket name on character; O(1) lookup when matching nodes to kit pieces */
  attachments: Record<string, KitSocketAttachment>;
  colors: BaseMatoran['colors'];
  /** When set, expands legacy flat custom palettes for this stage. */
  stage?: BaseMatoran['stage'];
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
 *
 * For multiple kit GLBs on one character, call this hook once per `kitUrl` with
 * disjoint `attachments` keys (each socket should appear in at most one map).
 */
export function useKitAttachments({
  attachments,
  characterNodes,
  colors,
  kitUrl,
  onAttached,
  stage,
  weathered,
}: UseKitAttachmentsParams): void {
  const gltf = useGLTF(kitUrl);
  const kitNodes = useMemo(() => buildKitNodeIndex(gltf.scene), [gltf]);
  const resolvedColors = useMemo(
    () => (stage !== undefined ? normalizeMatoranColors(colors, stage) : colors),
    [colors, stage]
  );
  const onAttachedRef = useRef(onAttached);
  onAttachedRef.current = onAttached;

  useEffect(() => {
    if (!characterNodes) return;

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
      if (row.kitNodeName === KIT_2001_NODES.MataBrain) {
        // Slightly inset brain gel so it stays inside the Kanohi cavity (avoids forehead z-fight).
        clone.scale.multiplyScalar(0.96);
      }

      const slotLookup = buildKitMaterialSlotLookup(row.materialColors);
      applyKitMaterialsToObject(clone, slotLookup, resolvedColors, weathered);

      socket.add(clone);
      clones.push(clone);
    }

    onAttachedRef.current?.();
    notifyModelReadyForTestMode();

    return () => {
      for (const clone of clones) {
        const p = clone.parent;
        if (p) p.remove(clone);
      }
    };
  }, [attachments, characterNodes, kitUrl, resolvedColors, kitNodes, weathered]);
}

useKitAttachments.preload = (...kitUrls: string[]) => {
  for (const url of kitUrls) {
    useGLTF.preload(url);
  }
};
