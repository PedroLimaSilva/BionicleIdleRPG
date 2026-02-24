import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';

const ARMOR_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Nuva/armor.glb';

function buildArmorNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
  const nodes: Record<string, Object3D> = {};
  gltf.scene.traverse((child) => {
    if (child.name) nodes[child.name] = child;
  });
  return nodes;
}

/**
 * Loads an armor piece from the shared Toa_Nuva/armor.glb, clones it, and
 * attaches it to the given Object3D (an attachment node in the character model).
 *
 * Uses useGLTF (with useDraco for Draco-compressed models from gltfjsx --transform).
 *
 * The armor is cloned so each character gets its own geometry instance and
 * material, allowing per-character color overrides without affecting others.
 *
 * Toa Nuva share 3 pieces of armor (e.g. chest, shoulders). Each character
 * model exposes attachment nodes by name; pass the appropriate node for each
 * piece.
 *
 * @param attachNode  - The Object3D in the character model to attach the armor to
 *                      (e.g. nodes.ChestPlateHolder, nodes.PlateHolderL, nodes.PlateHolderR)
 * @param armorName   - The name of the armor mesh in armor.glb
 * @param armorColor  - Optional color to tint the armor (e.g. matoran.colors.body)
 * @param glowColor   - Optional color for emissive "glow" materials. When provided,
 *                      materials whose names include "glow" (case-insensitive) will
 *                      use this color for both base and emissive color.
 */
export function useArmor(
  attachNode: Object3D | undefined,
  armorName: string,
  armorColor?: string,
  glowColor?: string
) {
  const gltf = useGLTF(ARMOR_GLB_PATH); // useDraco=true by default for Draco-compressed GLB
  const armorNodes = useMemo(() => buildArmorNodes(gltf), [gltf]);
  const armorRef = useRef<Object3D | null>(null);

  // Clone the armor and attach to parent when data is ready
  useEffect(() => {
    if (!armorNodes || !attachNode) return;

    const source = armorNodes[armorName];
    if (!source) {
      console.warn(`[useArmor] Armor '${armorName}' not found in armor.glb`);
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

    clone.position.set(0, 0, 0);
    attachNode.add(clone);
    armorRef.current = clone;

    return () => {
      attachNode.remove(clone);
      armorRef.current = null;
    };
  }, [armorNodes, attachNode, armorName]);

  // Apply color to the armor's material(s) when provided
  useEffect(() => {
    const armor = armorRef.current;
    if (!armor || (!armorColor && !glowColor)) return;

    armor.traverse((child) => {
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
          } else if (armorColor) {
            mat.color = new Color(armorColor);
          }
        }
      }
    });
  }, [armorNodes, attachNode, armorName, armorColor, glowColor]);

  return armorRef.current;
}

// Kick off loading early (call from preload.ts)
useArmor.preload = () => {
  useGLTF.preload(ARMOR_GLB_PATH); // useDraco=true by default
};
