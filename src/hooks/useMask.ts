import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useGame } from '../context/Game';
import { getEffectiveMataMaskColor } from '../game/maskColor';
import { BaseMatoran, MatoranStage } from '../types/Matoran';
import {
  createMaskTransitionState,
  startMaskTransition,
  useMaskTransitionFrame,
} from './maskTransition';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';

function buildMaskNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
  const nodes: Record<string, Object3D> = {};
  gltf.scene.traverse((child) => {
    if (child.name) nodes[child.name] = child;
  });
  return nodes;
}

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/** Apply mask color and optional glow color to every mesh material under `root` */
function applyMaskColors(
  root: Object3D,
  maskColor: string,
  glowColor?: string,
  maskPowerActive?: boolean
): void {
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        const isGlow = mat.name.toLowerCase().includes('glow');

        if (isGlow && glowColor) {
          const col = new Color(glowColor);
          mat.color = col;
          if (mat.emissive) {
            mat.emissive = col.clone();
          }
        } else {
          mat.color = new Color(maskColor);
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
 * @param maskName    - The name of the mask mesh in masks.glb (must match the Mask enum value)
 * @param matoran     - Character data (Mata/Diminished) for mask color derivation
 * @param glowColor   - Optional color for emissive "glow" materials (e.g. lens glow matching eye color).
 *                      When provided, materials whose names include "glow" (case-insensitive) will use
 *                      this color for both their base color and emissive color instead of maskColor.
 * @param maskPowerActive - When true, non-glow materials emit the mask color at intensity 5.
 */
export function useMask(
  masksParent: Object3D | undefined,
  maskName: string,
  matoran: BaseMatoran & { maskOverride?: string },
  glowColor?: string,
  maskPowerActive?: boolean
) {
  const gltf = useGLTF(MASKS_GLB_PATH); // useDraco=true by default for Draco-compressed GLB
  const masksNodes = useMemo(() => buildMaskNodes(gltf), [gltf]);
  const { completedQuests } = useGame();

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

  const transitionRef = useRef(createMaskTransitionState());

  // Clone the mask and attach to parent; animate transitions between masks
  useEffect(() => {
    if (!masksNodes || !masksParent) return;

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
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const originalMat = mesh.material;
        if (isStandardMat(originalMat)) {
          const mat = originalMat.clone();
          mat.transparent = true;
          mesh.material = mat;
        }
      }
    });

    // Apply colors eagerly so they're correct before the first animation frame.
    // (useEffect runs asynchronously after paint, and useFrame/rAF can fire
    // before the next useEffect — applying colors here avoids the brief flash
    // of un-tinted GLB-default colors during the fade-in.)
    applyMaskColors(clone, maskColorRef.current, glowColorRef.current, maskPowerActiveRef.current);

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
  }, [masksNodes, masksParent, maskName]);

  // Unmount-only cleanup: remove any lingering masks from the scene
  useEffect(() => {
    return () => {
      const parent = masksParentRef.current;
      if (parent) {
        if (maskRef.current) parent.remove(maskRef.current);
        const tr = transitionRef.current;
        if (tr.active && tr.oldMask) parent.remove(tr.oldMask);
      }
      maskRef.current = null;
      transitionRef.current.active = false;
    };
  }, []);

  useMaskTransitionFrame(transitionRef, masksParentRef);

  // Apply color when only the color props change (maskName unchanged)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;

    applyMaskColors(mask, maskColor, glowColor, maskPowerActive);
  }, [masksNodes, masksParent, maskName, maskColor, glowColor, maskPowerActive]);

  return maskRef.current;
}

// Kick off loading early (call from preload.ts)
useMask.preload = () => {
  useGLTF.preload(MASKS_GLB_PATH); // useDraco=true by default
};
