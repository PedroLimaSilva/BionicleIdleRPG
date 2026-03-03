import type { MutableRefObject } from 'react';
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';

/** Duration of the mask swap transition in seconds */
export const TRANSITION_DURATION = 0.35;

/** How much the old mask scales up during the exit animation (multiplied on top of the original scale) */
export const EXIT_SCALE_AMOUNT = 0.5;

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/** Cubic ease-out: fast start, gentle deceleration */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Collect material uuid → its resting opacity for every mesh under an Object3D */
export function collectOpacities(root: Object3D): Map<string, number> {
  const map = new Map<string, number>();
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        map.set(mat.uuid, mat.opacity);
      }
    }
  });
  return map;
}

/**
 * Set every standard material's opacity to `baseOpacity * factor`.
 * Also disables depthWrite so the fading-out mask doesn't depth-clip
 * the new mask that sits behind it in the same parent bone.
 */
export function setAnimatedOpacity(
  root: Object3D,
  opacities: Map<string, number>,
  factor: number
): void {
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        const base = opacities.get(mat.uuid) ?? 1;
        mat.opacity = base * factor;
        mat.depthWrite = false;
      }
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
}

export function createMaskTransitionState(): MaskTransitionState {
  return {
    active: false,
    progress: 0,
    oldMask: null,
    oldOpacities: new Map(),
    oldScale: new Vector3(1, 1, 1),
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

  const oldOpacities = collectOpacities(prevMask);
  const oldScale = prevMask.scale.clone();

  transitionRef.current = {
    active: true,
    progress: 0,
    oldMask: prevMask,
    oldOpacities,
    oldScale,
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
      setAnimatedOpacity(tr.oldMask, tr.oldOpacities, 1 - t);
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
