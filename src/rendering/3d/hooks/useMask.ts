import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useGame } from '../../../context/Game';
import { useSettings } from '../../../context/useSettings';
import { shouldEnableShadows } from '../../../utils/testMode';
import { getEffectiveMataMaskColor } from '../../../game/characters/maskColor';
import { masksCollected } from '../../../services/matoranUtils';
import { resolveWornMask } from '../../../game/masks/wornMask';
import { BaseMatoran, Mask, MatoranStage } from '../../../types/Matoran';
import {
  createMaskTransitionState,
  startMaskTransition,
  useMaskTransitionFrame,
} from './maskTransition';
import { ensureMaskSlotPlaceholderHidden } from './ensureMaskSlotPlaceholderHidden';
import { applyKanohiRenderOrder } from './kanohiRenderOrder';
import { applyMaskMetallicPbr, isMaskStandardMat, prepareClonedMaskMaterial } from './maskMaterial';
import {
  applyMaskDiscolorationToObject,
  setupMaskDiscolorationShader,
  type MaskDiscoloration,
} from './maskDiscoloration';

export type { MaskDiscoloration } from './maskDiscoloration';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';

/** Scale on Toa Mata `Masks` sockets so Kanohi from `masks.glb` fit the face. */
export const MATA_MASK_SLOT_SCALE: [number, number, number] = [
  37.19623565673828, 37.19623565673828, 37.1963005065918,
];

function applyMataMaskSlotScale(masksParent: Object3D): void {
  masksParent.scale.set(...MATA_MASK_SLOT_SCALE);
}

function buildMaskNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
  const nodes: Record<string, Object3D> = {};
  gltf.scene.traverse((child) => {
    if (child.name) nodes[child.name] = child;
  });
  return nodes;
}

/** Apply mask color and optional glow color to every mesh material under `root` */
function applyMaskColors(
  root: Object3D,
  maskColor: string,
  maskName: Mask,
  glowColor?: string,
  maskPowerActive?: boolean,
  discoloration?: MaskDiscoloration
): void {
  const shouldKeepOriginalColor = maskName === Mask.Avohkii;

  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (!isMaskStandardMat(mat)) return;
      if (shouldKeepOriginalColor) return;

      if (isMaskStandardMat(mat)) {
        const isGlow = mat.name.toLowerCase().includes('glow');

        if (isGlow && glowColor) {
          const col = new Color(glowColor);
          mat.color = col;
          if (mat.emissive) {
            mat.emissive = col.clone();
          }
        } else {
          mat.color = new Color(maskColor);
          applyMaskMetallicPbr(mat, maskColor);
          if (mat.emissive) {
            if (maskPowerActive) {
              mat.emissive = new Color(maskColor);
              mat.emissiveIntensity = 2.5;
            } else {
              mat.emissive = new Color(0x000000);
              mat.emissiveIntensity = 0;
            }
          }
        }
      }
    }
  });

  applyMaskDiscolorationToObject(root, discoloration);
}

/**
 * Loads a mask from the shared masks.glb, clones it, and attaches it to the
 * given parent Object3D (typically `nodes.Masks` in a character model).
 *
 * Uses useGLTF (with useDraco for Draco-compressed models from gltfjsx --transform).
 *
 * The mask is cloned so each character gets its own geometry instance and
 * material, allowing per-character color overrides without affecting others.
 * All cloned materials are marked `transparent` so that alpha blending is
 * always available (needed for the exit animation and for masks like Kaukau
 * that have sub-1 opacity).
 *
 * When the mask changes (e.g. selecting a different mask in the character inventory tab),
 * the new mask appears immediately while the old mask scales up and fades out.
 * The first mask shown on load appears immediately with no transition.
 *
 * @param masksParent - The Object3D to parent the mask to (e.g. `nodes.Masks`)
 * @param matoran     - Character data (Mata/Diminished) for mask selection and color
 * @param glowColor   - Optional color for emissive "glow" materials (e.g. lens glow matching eye color).
 *                      When provided, materials whose names include "glow" (case-insensitive) will use
 *                      this color for both their base color and emissive color instead of maskColor.
 * @param maskPowerActive - When true, non-glow materials emit the mask color at intensity 5.
 * @param applyMataSlotScale - When true, scale the parent socket to match Toa Mata rigs (needed
 *                             when using `masks.glb` on a character whose GLB omits that scale).
 * @param discoloration - Optional vertical crown tint (Metru double-injected Kanohi).
 */
export function useMask(
  masksParent: Object3D | undefined,
  matoran: BaseMatoran & { maskOverride?: Mask; unlockAllMasks?: boolean },
  glowColor?: string,
  maskPowerActive?: boolean,
  applyMataSlotScale?: boolean,
  discoloration?: MaskDiscoloration
) {
  const gltf = useGLTF(MASKS_GLB_PATH); // useDraco=true by default for Draco-compressed GLB
  const masksNodes = useMemo(() => buildMaskNodes(gltf), [gltf]);
  const { completedQuests } = useGame();
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();

  const collected = useMemo(
    () => (matoran.unlockAllMasks ? [] : masksCollected(matoran, completedQuests)),
    [matoran, completedQuests]
  );
  const maskName = useMemo(() => resolveWornMask(matoran, collected), [collected, matoran]);

  const maskColor =
    matoran.stage === MatoranStage.ToaMata
      ? getEffectiveMataMaskColor(matoran, completedQuests)
      : matoran.colors.mask;
  const maskRef = useRef<Object3D | null>(null);
  const prevMaskNameRef = useRef<string | null>(null);
  const masksParentRef = useRef<Object3D | undefined>(masksParent);
  masksParentRef.current = masksParent;

  // Keep color props in refs so the attachment effect can read them eagerly
  // without adding them to its dependency array (which would re-clone on color change)
  const maskColorRef = useRef(maskColor);
  maskColorRef.current = maskColor;
  const glowColorRef = useRef(glowColor);
  glowColorRef.current = glowColor;
  const maskPowerActiveRef = useRef(maskPowerActive);
  maskPowerActiveRef.current = maskPowerActive;
  const discolorationRef = useRef(discoloration);
  discolorationRef.current = discoloration;

  const transitionRef = useRef(createMaskTransitionState());

  // Clone the mask and attach to parent; animate transitions between masks
  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    if (applyMataSlotScale) {
      applyMataMaskSlotScale(masksParent);
    }

    ensureMaskSlotPlaceholderHidden(masksParent);

    const source = masksNodes[maskName];
    if (!source) {
      console.warn(`[useMask] Mask '${maskName}' not found in masks.glb`);
      return;
    }

    const clone = source.clone(true);

    // Clone materials so color changes are per-instance.
    // Mark transparent so alpha blending is always available (needed for
    // cross-fade and for masks like Kaukau that have opacity < 1).
    // Enable castShadow so masks cast shadows onto the face behind them.
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = effectiveShadows;
        mesh.receiveShadow = effectiveShadows;
        const originalMat = mesh.material;
        if (isMaskStandardMat(originalMat)) {
          mesh.material = prepareClonedMaskMaterial(originalMat.clone());
        }
      }
    });

    applyKanohiRenderOrder(clone);

    if (discolorationRef.current) {
      setupMaskDiscolorationShader(clone);
    }

    // Apply colors eagerly so they're correct before the first animation frame.
    // (useEffect runs asynchronously after paint, and useFrame/rAF can fire
    // before the next useEffect — applying colors here avoids the brief flash
    // of un-tinted GLB-default colors during the fade-in.)
    applyMaskColors(
      clone,
      maskColorRef.current,
      maskName as Mask,
      glowColorRef.current,
      maskPowerActiveRef.current,
      discolorationRef.current
    );

    const prevMask = maskRef.current;
    const isChange =
      prevMaskNameRef.current !== null && prevMaskNameRef.current !== maskName && prevMask !== null;

    if (isChange && prevMask) {
      startMaskTransition(transitionRef, masksParent, prevMask);
    } else if (prevMask) {
      // Not a mask-name change (e.g. masksNodes just loaded); swap silently
      masksParent.remove(prevMask);
    }

    masksParent.add(clone);
    maskRef.current = clone;
    prevMaskNameRef.current = maskName;

    // NOTE: We intentionally do NOT return a cleanup that removes the clone.
    // Mask lifecycle is managed imperatively at the top of each effect run and
    // in the unmount-only effect below, so the old mask can remain in the scene
    // during the exit animation.
  }, [masksNodes, masksParent, maskName, effectiveShadows, applyMataSlotScale, discoloration]);

  // Unmount-only cleanup: remove any lingering masks from the scene
  useEffect(() => {
    const transition = transitionRef.current;
    return () => {
      const parent = masksParentRef.current;
      if (parent) {
        if (maskRef.current) parent.remove(maskRef.current);
        if (transition.active && transition.oldMask) parent.remove(transition.oldMask);
      }
      maskRef.current = null;
      transition.active = false;
    };
  }, []);

  useMaskTransitionFrame(transitionRef, masksParentRef);

  // Apply color when only the color props change (maskName unchanged)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;

    applyMaskColors(mask, maskColor, maskName as Mask, glowColor, maskPowerActive, discoloration);
  }, [masksNodes, masksParent, maskName, maskColor, glowColor, maskPowerActive, discoloration]);

  return maskRef.current;
}

// Kick off loading early (call from preload.ts)
useMask.preload = () => {
  useGLTF.preload(MASKS_GLB_PATH); // useDraco=true by default
};
