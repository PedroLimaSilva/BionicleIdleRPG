import { useEffect, useRef, useState } from 'react';
import {
  Color,
  DoubleSide,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Side,
  Vector3,
} from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';

/** Duration of the mask swap transition in seconds */
const TRANSITION_DURATION = 0.35;

/** How much the old mask scales up during the exit animation (multiplied on top of the original scale) */
const EXIT_SCALE_AMOUNT = 0.5;

// Module-level cache so the file is only fetched once across all instances
let masksNodesCache: Record<string, Object3D> | null = null;
let masksLoadPromise: Promise<Record<string, Object3D>> | null = null;

function loadMasksNodes(): Promise<Record<string, Object3D>> {
  if (masksNodesCache) return Promise.resolve(masksNodesCache);
  if (masksLoadPromise) return masksLoadPromise;

  masksLoadPromise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      MASKS_GLB_PATH,
      (gltf) => {
        const nodes: Record<string, Object3D> = {};
        gltf.scene.traverse((child) => {
          if (child.name) nodes[child.name] = child;
        });
        masksNodesCache = nodes;
        resolve(nodes);
      },
      undefined,
      reject
    );
  });

  return masksLoadPromise;
}

type StandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/** Cubic ease-out: fast start, gentle deceleration */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Snapshot of the material properties we modify during the transition */
interface MatSnapshot {
  opacity: number;
  transparent: boolean;
  side: Side;
}

/** Collect a snapshot of every standard material under an Object3D */
function collectMatState(root: Object3D): Map<string, MatSnapshot> {
  const map = new Map<string, MatSnapshot>();
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        map.set(mat.uuid, {
          opacity: mat.opacity,
          transparent: mat.transparent,
          side: mat.side,
        });
      }
    }
  });
  return map;
}

/**
 * Set every standard material under `root` to a fraction of its base opacity.
 * Forces `transparent = true` and `side = DoubleSide` while animating so that
 * semi-transparent geometry renders correctly from all angles.
 */
function setAnimatedOpacity(root: Object3D, snapshots: Map<string, MatSnapshot>, factor: number): void {
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        const snap = snapshots.get(mat.uuid);
        const baseOpacity = snap?.opacity ?? 1;
        mat.transparent = true;
        mat.side = DoubleSide;
        mat.opacity = baseOpacity * factor;
      }
    }
  });
}

/** Restore every material to its original state from the snapshot */
function restoreMatState(root: Object3D, snapshots: Map<string, MatSnapshot>): void {
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (isStandardMat(mat)) {
        const snap = snapshots.get(mat.uuid);
        if (snap) {
          mat.opacity = snap.opacity;
          mat.transparent = snap.transparent;
          mat.side = snap.side;
        }
      }
    }
  });
}

/** Apply mask color and optional glow color to every mesh material under `root` */
function applyMaskColors(root: Object3D, maskColor: string, glowColor?: string): void {
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
        }
      }
    }
  });
}

interface TransitionState {
  active: boolean;
  progress: number;
  oldMask: Object3D | null;
  newMask: Object3D | null;
  /** Snapshot of the OLD mask's material state (fade from these → 0) */
  oldSnapshots: Map<string, MatSnapshot>;
  /** Snapshot of the NEW mask's material state (fade from 0 → these) */
  newSnapshots: Map<string, MatSnapshot>;
  /** Original scale of the OLD mask before the exit animation began */
  oldScale: Vector3;
}

/**
 * Loads a mask from the shared masks.glb, clones it, and attaches it to the
 * given parent Object3D (typically `nodes.Masks` in a character model).
 *
 * Uses imperative loading (GLTFLoader) instead of useGLTF so it does NOT
 * trigger React Suspense -- the parent component's animation setup and
 * effects are never interrupted.
 *
 * The mask is cloned so each character gets its own geometry instance and
 * material, allowing per-character color overrides without affecting others.
 *
 * When the mask changes (e.g. selecting a different mask in the equipment tab),
 * the old mask scales up and fades out while the new mask fades in. The first
 * mask shown on load appears immediately with no transition.
 *
 * @param masksParent - The Object3D to parent the mask to (e.g. `nodes.Masks`)
 * @param maskName    - The name of the mask mesh in masks.glb (must match the Mask enum value)
 * @param maskColor   - The color to tint the mask
 * @param glowColor   - Optional color for emissive "glow" materials (e.g. lens glow matching eye color).
 *                       When provided, materials whose names include "glow" (case-insensitive) will use
 *                       this color for both their base color and emissive color instead of maskColor.
 */
export function useMask(
  masksParent: Object3D | undefined,
  maskName: string,
  maskColor: string,
  glowColor?: string
) {
  const [masksNodes, setMasksNodes] = useState<Record<string, Object3D> | null>(masksNodesCache);
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

  const transitionRef = useRef<TransitionState>({
    active: false,
    progress: 0,
    oldMask: null,
    newMask: null,
    oldSnapshots: new Map(),
    newSnapshots: new Map(),
    oldScale: new Vector3(1, 1, 1),
  });

  // Load masks.glb imperatively (no Suspense)
  useEffect(() => {
    if (masksNodesCache) {
      setMasksNodes(masksNodesCache);
      return;
    }

    let cancelled = false;
    loadMasksNodes().then((nodes) => {
      if (!cancelled) setMasksNodes(nodes);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Clone the mask and attach to parent; animate transitions between masks
  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    const source = masksNodes[maskName];
    if (!source) {
      console.warn(`[useMask] Mask '${maskName}' not found in masks.glb`);
      return;
    }

    const clone = source.clone(true);

    // Clone materials so color changes are per-instance
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const originalMat = mesh.material;
        if (isStandardMat(originalMat)) {
          mesh.material = originalMat.clone();
        }
      }
    });

    // Apply colors eagerly so they're correct before the first animation frame.
    // (useEffect runs asynchronously after paint, and useFrame/rAF can fire
    // before the next useEffect — applying colors here avoids the brief flash
    // of un-tinted GLB-default colors during the fade-in.)
    applyMaskColors(clone, maskColorRef.current, glowColorRef.current);

    const prevMask = maskRef.current;
    const isChange =
      prevMaskNameRef.current !== null &&
      prevMaskNameRef.current !== maskName &&
      prevMask !== null;

    if (isChange && prevMask) {
      // Cancel any already-running transition and clean up its old mask
      const tr = transitionRef.current;
      if (tr.active && tr.oldMask) {
        masksParent.remove(tr.oldMask);
      }

      const oldSnapshots = collectMatState(prevMask);
      const newSnapshots = collectMatState(clone);

      // Capture the old mask's current scale so the exit animation is relative
      const oldScale = prevMask.scale.clone();

      // Start new mask fully transparent (DoubleSide set inside setAnimatedOpacity)
      setAnimatedOpacity(clone, newSnapshots, 0);

      transitionRef.current = {
        active: true,
        progress: 0,
        oldMask: prevMask,
        newMask: clone,
        oldSnapshots,
        newSnapshots,
        oldScale,
      };
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

  // Per-frame transition animation
  useFrame((_, delta) => {
    const tr = transitionRef.current;
    if (!tr.active) return;

    tr.progress = Math.min(1, tr.progress + delta / TRANSITION_DURATION);
    const t = easeOutCubic(tr.progress);

    // Old mask: scale up relative to its original scale and fade out
    if (tr.oldMask) {
      const factor = 1 + t * EXIT_SCALE_AMOUNT;
      tr.oldMask.scale.set(
        tr.oldScale.x * factor,
        tr.oldScale.y * factor,
        tr.oldScale.z * factor
      );
      setAnimatedOpacity(tr.oldMask, tr.oldSnapshots, 1 - t);
    }

    // New mask: fade in toward each material's original opacity
    if (tr.newMask) {
      setAnimatedOpacity(tr.newMask, tr.newSnapshots, t);
    }

    // Finished — clean up old mask and restore final material state
    if (tr.progress >= 1) {
      const parent = masksParentRef.current;
      if (parent && tr.oldMask) {
        parent.remove(tr.oldMask);
      }

      // Restore the new mask's materials to their exact original state
      if (tr.newMask) {
        restoreMatState(tr.newMask, tr.newSnapshots);
      }

      tr.active = false;
      tr.oldMask = null;
      tr.newMask = null;
    }
  });

  // Apply color when only the color props change (maskName unchanged)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;

    applyMaskColors(mask, maskColor, glowColor);
  }, [masksNodes, masksParent, maskName, maskColor, glowColor]);

  return maskRef.current;
}

// Kick off loading early (call from preload.ts)
useMask.preload = () => {
  // Start the imperative load
  loadMasksNodes();
  // Also warm the drei/useGLTF cache in case anything else needs it
  useGLTF.preload(MASKS_GLB_PATH);
};
