import { useEffect, useRef, useState } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three';
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

/** Collect material uuid → its resting opacity for every mesh under an Object3D */
function collectOpacities(root: Object3D): Map<string, number> {
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
function setAnimatedOpacity(root: Object3D, opacities: Map<string, number>, factor: number): void {
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
  /** Resting opacities of the OLD mask's materials (fade from these → 0) */
  oldOpacities: Map<string, number>;
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
    oldOpacities: new Map(),
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

      const oldOpacities = collectOpacities(prevMask);
      const oldScale = prevMask.scale.clone();

      transitionRef.current = {
        active: true,
        progress: 0,
        oldMask: prevMask,
        oldOpacities,
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
