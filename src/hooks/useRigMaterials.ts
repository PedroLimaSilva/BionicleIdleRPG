import { useEffect, useRef } from 'react';
import { Object3D } from 'three';
import type { BaseMatoran } from '../types/Matoran';
import type { KitMaterialSlotEntry } from '../types/KitParts';
import type { WeatheredMetalOptions } from '../components/CharacterScene/WeatheredMetalMaterial';
import { applyKitMaterialsToObject, buildKitMaterialSlotLookup } from './kitMaterialApplication';
import { notifyModelReadyForTestMode } from '../utils/testMode';

export type RigMaterialTarget = {
  /** Map from rig **material** name to color / PBR overrides (same as kit attachments). */
  materialColors?: Partial<Record<string, KitMaterialSlotEntry>>;
};

export type UseRigMaterialsParams = {
  characterNodes: Record<string, Object3D | undefined> | undefined;
  /** Key = rig node name; tints embedded meshes under that node without cloning kit parts. */
  targets: Record<string, RigMaterialTarget>;
  colors: BaseMatoran['colors'];
  weathered?: WeatheredMetalOptions;
  onApplied?: () => void;
};

/**
 * Applies player palette / weathered materials to meshes baked into the character rig
 * (e.g. Metru torso geometry under `MetruMatoranTorso:Body`). Sockets with no kit
 * counterpart stay in place; only their materials are updated.
 */
export function useRigMaterials({
  characterNodes,
  colors,
  onApplied,
  targets,
  weathered,
}: UseRigMaterialsParams): void {
  const onAppliedRef = useRef(onApplied);
  onAppliedRef.current = onApplied;

  useEffect(() => {
    if (!characterNodes) return;

    for (const [nodeName, row] of Object.entries(targets)) {
      const node = characterNodes[nodeName];
      if (!node) {
        console.warn(`[useRigMaterials] Node '${nodeName}' not found on character`);
        continue;
      }

      const slotLookup = buildKitMaterialSlotLookup(row.materialColors);
      applyKitMaterialsToObject(node, slotLookup, colors, weathered);
    }

    onAppliedRef.current?.();
    notifyModelReadyForTestMode();
  }, [characterNodes, colors, targets, weathered]);
}
