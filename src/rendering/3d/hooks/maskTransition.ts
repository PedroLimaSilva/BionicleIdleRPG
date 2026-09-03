import type { MutableRefObject } from 'react';
import { Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { forEachMaskMaterial } from './maskMaterial';

/** Duration of the mask swap transition in seconds */
export const TRANSITION_DURATION = 0.35;

/** How much the old mask scales up during the exit animation (multiplied on top of the original scale) */
export const EXIT_SCALE_AMOUNT = 0.5;

/** Cubic ease-out: fast start, gentle deceleration */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function forEachMaskMeshMaterial(
  root: Object3D,
  fn: Parameters<typeof forEachMaskMaterial>[1]
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    forEachMaskMaterial(child as Mesh, fn);
  });
}

/** Collect material uuid → its resting opacity for every mesh under an Object3D */
export function collectOpacities(root: Object3D): Map<string, number> {
  const map = new Map<string, number>();
  forEachMaskMeshMaterial(root, (mat) => {
    map.set(mat.uuid, mat.opacity);
  });
  return map;
}

/** Collect transmission-based mask materials for exit fades (Mata Kaukau). */
export function collectTransmissions(root: Object3D): Map<string, number> {
  const map = new Map<string, number>();
  forEachMaskMeshMaterial(root, (mat) => {
    if (mat instanceof MeshPhysicalMaterial && (mat.transmission ?? 0) > 0) {
      map.set(mat.uuid, mat.transmission);
    }
  });
  return map;
}

/**
 * Animate exit fade on the outgoing mask.
 *
 * Always fade `opacity` — that is what makes the outgoing sculpt disappear. Mata
 * Kaukau reads at full alpha while `transmission` alone is reduced (opacity stays 1
 * at rest), so transmission masks also scale `transmission` during the swap.
 *
 * Resting Kaukau keeps `transparent: false` + depthWrite on for hollow-shell
 * occlusion (#454); only this short exit animation uses the transparent pass.
 */
export function setAnimatedOpacity(
  root: Object3D,
  opacities: Map<string, number>,
  factor: number,
  transmissions?: Map<string, number>
): void {
  forEachMaskMeshMaterial(root, (mat) => {
    const base = opacities.get(mat.uuid) ?? 1;
    mat.transparent = true;
    mat.opacity = base * factor;
    mat.depthWrite = false;

    const baseTransmission = transmissions?.get(mat.uuid);
    if (mat instanceof MeshPhysicalMaterial && baseTransmission !== undefined) {
      mat.transmission = baseTransmission * factor;
    }
  });
}

export interface MaskTransitionState {
  active: boolean;
  progress: number;
  oldMask: Object3D | null;
  /** Resting opacities of the OLD mask's materials (fade from these → 0) */
  oldOpacities: Map<string, number>;
  /** Original scale of the OLD mask before the exit animation began */
  oldScale: Vector3;
  /** Resting transmission for transmission-rendered masks (Mata Kaukau). */
  oldTransmissions: Map<string, number>;
}

export function createMaskTransitionState(): MaskTransitionState {
  return {
    active: false,
    oldMask: null,
    oldOpacities: new Map(),
    oldScale: new Vector3(1, 1, 1),
    oldTransmissions: new Map(),
    progress: 0,
  };
}

/**
 * Starts a mask transition: captures the old mask's state and prepares it for
 * the scale-up + fade-out animation. Call when the mask identity changes.
 */
export function startMaskTransition(
  transitionRef: MutableRefObject<MaskTransitionState>,
  masksParent: Object3D,
  prevMask: Object3D
): void {
  const tr = transitionRef.current;
  if (tr.active && tr.oldMask) {
    masksParent.remove(tr.oldMask);
  }

  // Fade-out requires alpha blending even on normally opaque Kanohi. Recompile
  // patched materials (discoloration onBeforeCompile) in the transparent pass.
  forEachMaskMeshMaterial(prevMask, (mat) => {
    if (!mat.transparent) {
      mat.transparent = true;
      mat.needsUpdate = true;
    }
  });

  const oldOpacities = collectOpacities(prevMask);
  const oldTransmissions = collectTransmissions(prevMask);
  const oldScale = prevMask.scale.clone();

  transitionRef.current = {
    active: true,
    oldMask: prevMask,
    oldOpacities,
    oldScale,
    oldTransmissions,
    progress: 0,
  };
}

/**
 * Hook that runs the per-frame mask transition animation. Call from any hook
 * that manages mask swapping and uses MaskTransitionState.
 */
export function useMaskTransitionFrame(
  transitionRef: MutableRefObject<MaskTransitionState>,
  masksParentRef: MutableRefObject<Object3D | undefined>
): void {
  useFrame((_, delta) => {
    const tr = transitionRef.current;
    if (!tr.active) return;

    tr.progress = Math.min(1, tr.progress + delta / TRANSITION_DURATION);
    const t = easeOutCubic(tr.progress);

    // Old mask: scale up relative to its original scale and fade out
    if (tr.oldMask) {
      const factor = 1 + t * EXIT_SCALE_AMOUNT;
      tr.oldMask.scale.set(tr.oldScale.x * factor, tr.oldScale.y * factor, tr.oldScale.z * factor);
      setAnimatedOpacity(tr.oldMask, tr.oldOpacities, 1 - t, tr.oldTransmissions);
    }

    // Finished — remove the old mask from the scene
    if (tr.progress >= 1) {
      const parent = masksParentRef.current;
      if (parent && tr.oldMask) {
        parent.remove(tr.oldMask);
      }

      tr.active = false;
      tr.oldMask = null;
    }
  });
}
