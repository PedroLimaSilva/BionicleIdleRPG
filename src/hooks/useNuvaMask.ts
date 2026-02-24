import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../types/Matoran';
import { useGame } from '../context/Game';
import { getEffectiveNuvaMaskColor } from '../game/maskColor';

const NUVA_MASKS_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Nuva/masks.glb';

function buildNuvaMaskNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
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

/** Map Mask enum to node name in Toa_Nuva/masks.glb (user said masks are named Hau, Miru, etc) */
const NUVA_MASK_TO_FILE_NAME: Record<string, string> = {
  Hau_Nuva: 'Hau',
  Kaukau_Nuva: 'Kaukau',
  Kakama_Nuva: 'Kakama',
  Akaku_Nuva: 'Akaku',
  Pakari_Nuva: 'Pakari',
  Miru_Nuva: 'Miru',
  Vahi: 'Vahi',
};

function getMaskFileName(maskName: string): string {
  return NUVA_MASK_TO_FILE_NAME[maskName] ?? maskName;
}

/** Apply mask color to materials; skip Vahi (keeps original color) */
function applyNuvaMaskColors(root: Object3D, maskColor: string, maskName: string): void {
  const isVahi = maskName === 'Vahi' || maskName === Mask.Vahi;

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const mat = mesh.material;
    if (!isStandardMat(mat)) return;

    if (isVahi) return; // Vahi does not change color

    mat.color.copy(new Color(maskColor));
  });
}

/**
 * Loads a mask from Toa_Nuva/masks.glb, attaches it to the parent, and applies color.
 * Mask selection: matoran.maskOverride || matoran.mask (from matoran dex).
 * Vahi mask does not change color.
 */
export function useNuvaMask(
  masksParent: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData
) {
  const { completedQuests } = useGame();
  const maskName = matoran.maskOverride || matoran.mask;
  const maskFileName = getMaskFileName(maskName);
  const maskColor = getEffectiveNuvaMaskColor(matoran, completedQuests);

  const gltf = useGLTF(NUVA_MASKS_GLB_PATH); // useDraco=true by default for Draco-compressed GLB
  const masksNodes = useMemo(() => buildNuvaMaskNodes(gltf), [gltf]);
  const maskRef = useRef<Object3D | null>(null);

  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    const source = masksNodes[maskFileName];
    if (!source) {
      console.warn(`[useNuvaMask] Mask '${maskFileName}' not found in Toa_Nuva/masks.glb`);
      return;
    }

    const clone = source.clone(true);

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

    applyNuvaMaskColors(clone, maskColor, maskName);

    if (maskRef.current) {
      masksParent.remove(maskRef.current);
    }
    masksParent.add(clone);
    maskRef.current = clone;

    return () => {
      masksParent.remove(clone);
      maskRef.current = null;
    };
  }, [masksNodes, masksParent, maskFileName, maskName]);

  // Update color when maskColor changes (mask name unchanged)
  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;
    applyNuvaMaskColors(mask, maskColor, maskName);
  }, [maskColor, maskName]);
}

useNuvaMask.preload = () => {
  useGLTF.preload(NUVA_MASKS_GLB_PATH); // useDraco=true by default
};
