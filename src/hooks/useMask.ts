import { useEffect, useMemo } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';

const MASKS_GLB_PATH = import.meta.env.BASE_URL + 'masks.glb';

/**
 * Loads a mask from the shared masks.glb, clones it, and attaches it to the
 * given parent Object3D (typically `nodes.Masks` in a character model).
 *
 * The mask is cloned so each character gets its own geometry instance and
 * material, allowing per-character color overrides without affecting others.
 *
 * @param masksParent - The Object3D to parent the mask to (e.g. `nodes.Masks`)
 * @param maskName    - The name of the mask mesh in masks.glb (must match the Mask enum value)
 * @param maskColor   - The color to tint the mask
 */
export function useMask(
  masksParent: Object3D | undefined,
  maskName: string,
  maskColor: string
) {
  const { nodes } = useGLTF(MASKS_GLB_PATH);

  // Clone the mask so each character instance gets its own mesh + material
  const maskInstance = useMemo(() => {
    const source = nodes[maskName];
    if (!source) {
      console.warn(`[useMask] Mask '${maskName}' not found in masks.glb`);
      return null;
    }
    const clone = source.clone(true);

    // Clone materials so color changes are per-instance
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const originalMat = mesh.material;
        if (originalMat instanceof MeshPhysicalMaterial || originalMat instanceof MeshStandardMaterial) {
          mesh.material = originalMat.clone();
        }
      }
    });

    return clone;
  }, [nodes, maskName]);

  // Attach the cloned mask to the parent and clean up on unmount / change
  useEffect(() => {
    if (!masksParent || !maskInstance) return;

    masksParent.add(maskInstance);

    return () => {
      masksParent.remove(maskInstance);
    };
  }, [masksParent, maskInstance]);

  // Apply color to the mask's material(s)
  useEffect(() => {
    if (!maskInstance) return;

    maskInstance.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mat = (child as Mesh).material;
        if (mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial) {
          mat.color = new Color(maskColor);
        }
      }
    });
  }, [maskInstance, maskColor]);

  return maskInstance;
}

// Preload helper for use in preload.ts
useMask.preload = () => useGLTF.preload(MASKS_GLB_PATH);
