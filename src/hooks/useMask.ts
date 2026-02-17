import { useEffect, useRef, useState } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';
const MASK_CHANGE_DURATION = 0.35;
const OUTGOING_SCALE_END = 1.2;

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

type MatType = MeshPhysicalMaterial | MeshStandardMaterial;

function captureOriginalOpacities(
  mask: Object3D
): Map<MatType, number> {
  const map = new Map<MatType, number>();
  mask.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial) {
        map.set(mat, mat.opacity);
      }
    }
  });
  return map;
}

function setMaskMaterialsOpacity(
  mask: Object3D,
  t: number,
  opacitiesMap?: Map<MatType, number>,
  /** For outgoing: fade from original to 0. For incoming: fade from 0 to original. */
  direction: 'out' | 'in' = 'in'
) {
  mask.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mat = (child as Mesh).material;
      if (mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial) {
        const original = opacitiesMap?.get(mat) ?? 1;
        const targetOpacity =
          direction === 'in' ? t * original : original * (1 - t);
        mat.transparent = targetOpacity < 1;
        mat.opacity = targetOpacity;
      }
    }
  });
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
  const outgoingMaskRef = useRef<Object3D | null>(null);
  const outgoingOpacitiesRef = useRef<Map<MatType, number> | null>(null);
  const incomingOpacitiesRef = useRef<Map<MatType, number> | null>(null);
  const animationStartRef = useRef<number>(0);
  const prevMaskNameRef = useRef<string | null>(null);
  const latestMaskNameRef = useRef(maskName);
  latestMaskNameRef.current = maskName;
  const masksParentRef = useRef<Object3D | undefined>(masksParent);
  masksParentRef.current = masksParent;

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

  // Clone the mask and attach to parent when data is ready
  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    const source = masksNodes[maskName];
    if (!source) {
      console.warn(`[useMask] Mask '${maskName}' not found in masks.glb`);
      return;
    }

    // If a transition was in progress, abort it and remove the outgoing mask
    const existingOutgoing = outgoingMaskRef.current;
    if (existingOutgoing) {
      masksParent.remove(existingOutgoing);
      outgoingMaskRef.current = null;
      outgoingOpacitiesRef.current = null;
      incomingOpacitiesRef.current = null;
    }

    const isMaskChange =
      prevMaskNameRef.current !== null && prevMaskNameRef.current !== maskName;
    const oldMask = maskRef.current;

    if (isMaskChange && oldMask) {
      // Start transition: keep old mask as outgoing, create new as incoming
      masksParent.remove(oldMask);
      oldMask.scale.setScalar(1);
      masksParent.add(oldMask);
      outgoingMaskRef.current = oldMask;
      outgoingOpacitiesRef.current = captureOriginalOpacities(oldMask);
      animationStartRef.current = performance.now();
      maskRef.current = null;
    }

    const clone = source.clone(true);

    // Clone materials so color changes are per-instance
    let incomingOpacities: Map<MatType, number> | null = null;
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const originalMat = mesh.material;
        if (
          originalMat instanceof MeshPhysicalMaterial ||
          originalMat instanceof MeshStandardMaterial
        ) {
          const mat = originalMat.clone();
          if (isMaskChange) {
            if (!incomingOpacities) incomingOpacities = new Map();
            incomingOpacities.set(mat, mat.opacity);
            mat.transparent = true;
            mat.opacity = 0;
          }
          mesh.material = mat;
        }
      }
    });
    if (isMaskChange && incomingOpacities) {
      incomingOpacitiesRef.current = incomingOpacities;
    }

    masksParent.add(clone);
    maskRef.current = clone;
    prevMaskNameRef.current = maskName;

    return () => {
      // Don't remove the mask in cleanup if we're transitioning to a different mask -
      // the new effect will use it as the outgoing animation
      const isTransitioning = latestMaskNameRef.current !== maskName;
      if (!isTransitioning) {
        if (outgoingMaskRef.current !== clone) {
          masksParent.remove(clone);
        }
        if (maskRef.current === clone) {
          maskRef.current = null;
        }
      }
    };
  }, [masksNodes, masksParent, maskName]);

  // Animate mask change: outgoing scales up + fades out, incoming fades in
  useFrame(() => {
    const outgoing = outgoingMaskRef.current;
    if (!outgoing) return;

    const elapsed = (performance.now() - animationStartRef.current) / 1000;
    const t = Math.min(elapsed / MASK_CHANGE_DURATION, 1);

    const scale = 1 + (OUTGOING_SCALE_END - 1) * t;
    outgoing.scale.setScalar(scale);
    setMaskMaterialsOpacity(
      outgoing,
      t,
      outgoingOpacitiesRef.current ?? undefined,
      'out'
    );

    const incoming = maskRef.current;
    if (incoming) {
      setMaskMaterialsOpacity(
        incoming,
        t,
        incomingOpacitiesRef.current ?? undefined,
        'in'
      );
    }

    if (t >= 1) {
      masksParentRef.current?.remove(outgoing);
      outgoingMaskRef.current = null;
      outgoingOpacitiesRef.current = null;
      if (incoming && incomingOpacitiesRef.current) {
        incoming.traverse((child) => {
          if ((child as Mesh).isMesh) {
            const mat = (child as Mesh).material;
            if (
              mat instanceof MeshPhysicalMaterial ||
              mat instanceof MeshStandardMaterial
            ) {
              const original = incomingOpacitiesRef.current!.get(mat) ?? 1;
              mat.opacity = original;
              mat.transparent = original < 1;
            }
          }
        });
        incomingOpacitiesRef.current = null;
      }
    }
  });

  // Apply color to the mask's material(s)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;

    mask.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mat = (child as Mesh).material;
        if (mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial) {
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
