import { useEffect, useRef, useState } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';

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
 */
export function useMask(masksParent: Object3D | undefined, maskName: string, maskColor: string) {
  const [masksNodes, setMasksNodes] = useState<Record<string, Object3D> | null>(masksNodesCache);
  const maskRef = useRef<Object3D | null>(null);

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

    const clone = source.clone(true);

    // Clone materials so color changes are per-instance
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const originalMat = mesh.material;
        if (
          originalMat instanceof MeshPhysicalMaterial ||
          originalMat instanceof MeshStandardMaterial
        ) {
          mesh.material = originalMat.clone();
        }
      }
    });

    masksParent.add(clone);
    maskRef.current = clone;

    return () => {
      masksParent.remove(clone);
      maskRef.current = null;
    };
  }, [masksNodes, masksParent, maskName]);

  // Apply color to the mask's material(s)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;

    mask.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mat = (child as Mesh).material;
        if (mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial) {
          mat.color = new Color(maskColor);
        }
      }
    });
  }, [masksNodes, masksParent, maskName, maskColor]);

  return maskRef.current;
}

// Kick off loading early (call from preload.ts)
useMask.preload = () => {
  // Start the imperative load
  loadMasksNodes();
  // Also warm the drei/useGLTF cache in case anything else needs it
  useGLTF.preload(MASKS_GLB_PATH);
};
