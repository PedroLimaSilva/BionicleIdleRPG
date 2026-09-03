import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { resolveWornMask } from '../../../game/masks/wornMask';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../../types/Matoran';
import { useGame } from '../../../context/Game';
import { useSettings } from '../../../context/useSettings';
import { shouldEnableShadows } from '../../../utils/testMode';
import { getEffectiveNuvaMaskColor } from '../../../game/characters/maskColor';
import {
  createMaskTransitionState,
  startMaskTransition,
  useMaskTransitionFrame,
} from './maskTransition';
import { ensureMaskSlotPlaceholderHidden } from './ensureMaskSlotPlaceholderHidden';
import { applyKanohiRenderOrder } from './kanohiRenderOrder';
import { applyMaskMetallicPbr, isMaskStandardMat, prepareClonedMaskMaterial } from './maskMaterial';
import { applyMaskDiscolorationToObject, setupMaskDiscolorationShader } from './maskDiscoloration';
import { masksCollected } from '../../../services/matoranUtils';

const NUVA_MASKS_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Nuva/masks.glb';

function buildNuvaMaskNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
  const nodes: Record<string, Object3D> = {};
  gltf.scene.traverse((child) => {
    if (child.name) nodes[child.name] = child;
  });
  return nodes;
}

/** Map Mask enum to node name in Toa_Nuva/masks.glb (user said masks are named Hau, Miru, etc) */
const NUVA_MASK_TO_NODE_NAME: Record<string, string> = {
  Akaku_Nuva: 'Akaku',
  Hau_Nuva: 'Hau',
  Hau_Nuva_Infected: 'HauInfected',
  Kakama_Nuva: 'Kakama',
  Kaukau_Nuva: 'Kaukau',
  Miru_Nuva: 'Miru',
  Pakari_Nuva: 'Pakari',
  Vahi: 'Vahi',
};

function getMaskNodeName(maskName: string): string {
  return NUVA_MASK_TO_NODE_NAME[maskName] ?? maskName;
}

/** Apply mask color to materials; skip Vahi (keeps original color) */
function applyNuvaMaskColors(
  root: Object3D,
  maskColor: string,
  maskName: string,
  maskPowerActive?: boolean
): void {
  const shouldKeepOriginalColor =
    maskName === 'Vahi' || maskName === Mask.Vahi || maskName === Mask.HauNuvaInfected;

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const mat = mesh.material;
    if (mesh.name.includes('Lens')) {
      if ((mat as MeshStandardMaterial).emissive) {
        (mat as MeshStandardMaterial).emissiveIntensity = 5;
      }
      return;
    }

    if (!isMaskStandardMat(mat)) return;

    if (shouldKeepOriginalColor) return;

    mat.color.copy(new Color(maskColor));
    applyMaskMetallicPbr(mat, maskColor);
    if (mat.emissive) {
      if (maskPowerActive) {
        mat.emissive = new Color(maskColor);
        mat.emissiveIntensity = 2.5;
      } else {
        mat.emissive = new Color(0x000000);
        mat.emissiveIntensity = 0;
      }
    }
  });

  if (!shouldKeepOriginalColor) {
    applyMaskDiscolorationToObject(root, undefined, maskColor);
  }
}

/**
 * Loads a mask from Toa_Nuva/masks.glb, attaches it to the parent, and applies color.
 * Mask selection: matoran.maskOverride || matoran.mask (from matoran dex).
 * Vahi mask does not change color.
 */
export function useNuvaMask(
  masksParent: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData & { unlockAllMasks?: boolean },
  maskPowerActive?: boolean
) {
  const { completedQuests } = useGame();
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();
  const collected = matoran.unlockAllMasks ? [] : masksCollected(matoran, completedQuests);
  const maskName = resolveWornMask(matoran, collected);
  const maskNodeName = getMaskNodeName(maskName);
  const maskColor = getEffectiveNuvaMaskColor(matoran, completedQuests);

  const gltf = useGLTF(NUVA_MASKS_GLB_PATH); // useDraco=true by default for Draco-compressed GLB
  const masksNodes = useMemo(() => buildNuvaMaskNodes(gltf), [gltf]);
  const maskRef = useRef<Object3D | null>(null);
  const prevMaskFileNameRef = useRef<string | null>(null);
  const masksParentRef = useRef<Object3D | undefined>(masksParent);
  masksParentRef.current = masksParent;

  const maskColorRef = useRef(maskColor);
  maskColorRef.current = maskColor;
  const maskNameRef = useRef(maskName);
  maskNameRef.current = maskName;
  const maskPowerActiveRef = useRef(maskPowerActive);
  maskPowerActiveRef.current = maskPowerActive;

  const transitionRef = useRef(createMaskTransitionState());

  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    ensureMaskSlotPlaceholderHidden(masksParent);

    const source = masksNodes[maskNodeName];
    if (!source) {
      console.warn(`[useNuvaMask] Mask '${maskNodeName}' not found in Toa_Nuva/masks.glb`);
      return;
    }

    const clone = source.clone(true);

    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = effectiveShadows;
        mesh.receiveShadow = effectiveShadows;
        const originalMat = mesh.material;
        if (isMaskStandardMat(originalMat)) {
          const mat = originalMat.clone();
          prepareClonedMaskMaterial(mat);
          mesh.material = mat;
        }
      }
    });

    applyKanohiRenderOrder(clone);

    setupMaskDiscolorationShader(clone, maskColorRef.current);

    applyNuvaMaskColors(
      clone,
      maskColorRef.current,
      maskNameRef.current,
      maskPowerActiveRef.current
    );

    const prevMask = maskRef.current;
    const isChange =
      prevMaskFileNameRef.current !== null &&
      prevMaskFileNameRef.current !== maskNodeName &&
      prevMask !== null;

    if (isChange && prevMask) {
      startMaskTransition(transitionRef, masksParent, prevMask);
    } else if (prevMask) {
      masksParent.remove(prevMask);
    }

    masksParent.add(clone);
    maskRef.current = clone;
    prevMaskFileNameRef.current = maskNodeName;
  }, [masksNodes, masksParent, maskNodeName, effectiveShadows]);

  useEffect(() => {
    const transition = transitionRef.current;
    return () => {
      const parent = masksParentRef.current;
      if (parent) {
        if (maskRef.current) parent.remove(maskRef.current);
        if (transition.active && transition.oldMask) parent.remove(transition.oldMask);
      }
      maskRef.current = null;
      transition.active = false;
    };
  }, []);

  useMaskTransitionFrame(transitionRef, masksParentRef);

  useEffect(() => {
    const mask = maskRef.current;
    if (!mask) return;
    applyNuvaMaskColors(mask, maskColor, maskName, maskPowerActive);
  }, [maskColor, maskName, maskPowerActive]);
}

useNuvaMask.preload = () => {
  useGLTF.preload(NUVA_MASKS_GLB_PATH); // useDraco=true by default
};
