import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../types/Matoran';
import { useGame } from '../context/Game';
import { useSettings } from '../context/useSettings';
import { shouldEnableShadows } from '../utils/testMode';
import { getEffectiveMaskColor } from '../game/maskColor';
import { getGreatMaskNodeName } from '../game/greatMasks';
import {
  createMaskTransitionState,
  startMaskTransition,
  useMaskTransitionFrame,
} from './maskTransition';
import { ensureMaskSlotPlaceholderHidden } from './ensureMaskSlotPlaceholderHidden';
import {
  applyMaskMetallicPbr,
  isMaskGlowMaterialName,
  isMaskStandardMat,
  prepareClonedMaskMaterial,
} from './maskMaterial';
import { masksCollected } from '../services/matoranUtils';

const GREAT_MASKS_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Metru/Masks.glb';

function buildGreatMaskNodes(gltf: { scene: Object3D }): Record<string, Object3D> {
  const nodes: Record<string, Object3D> = {};
  gltf.scene.traverse((child) => {
    if (child.name) nodes[child.name] = child;
  });
  return nodes;
}

function applyGreatMaskColors(
  root: Object3D,
  maskColor: string,
  glowColor?: string,
  maskPowerActive?: boolean
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const mat = mesh.material;
    if (!isMaskStandardMat(mat)) return;

    if (isMaskGlowMaterialName(mat.name)) {
      if (!glowColor) return;
      const col = new Color(glowColor);
      mat.color.copy(col);
      if (mat.emissive) {
        mat.emissive.copy(col);
        mat.emissiveIntensity = 50;
      }
      return;
    }

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
}

/**
 * Loads a Great Kanohi from `Toa_Metru/Masks.glb` and attaches it to the parent.
 * Mask selection: `matoran.maskOverride || matoran.mask` among collected masks.
 * Avatar ids use the `_Great` suffix (`Hau_Great`); GLB nodes stay `Hau`, `Huna`, …
 *
 * @param glowColor - Optional color for emissive `Glow` materials (e.g. Matatu scope lens).
 */
export function useGreatMask(
  masksParent: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData,
  glowColor?: string,
  maskPowerActive?: boolean
) {
  const { completedQuests } = useGame();
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();
  const collected = masksCollected(matoran, completedQuests);
  const effectiveMask = collected.includes(matoran.mask) ? matoran.mask : collected[0];
  const override = matoran.maskOverride;
  const maskName = override && collected.includes(override) ? override : effectiveMask;
  const maskNodeName = getGreatMaskNodeName(maskName);
  const maskColor = getEffectiveMaskColor(matoran, completedQuests);

  const gltf = useGLTF(GREAT_MASKS_GLB_PATH);
  const masksNodes = useMemo(() => buildGreatMaskNodes(gltf), [gltf]);
  const maskRef = useRef<Object3D | null>(null);
  const prevMaskFileNameRef = useRef<string | null>(null);
  const masksParentRef = useRef<Object3D | undefined>(masksParent);
  masksParentRef.current = masksParent;

  const maskColorRef = useRef(maskColor);
  maskColorRef.current = maskColor;
  const glowColorRef = useRef(glowColor);
  glowColorRef.current = glowColor;
  const maskPowerActiveRef = useRef(maskPowerActive);
  maskPowerActiveRef.current = maskPowerActive;

  const transitionRef = useRef(createMaskTransitionState());

  useEffect(() => {
    if (!masksNodes || !masksParent) return;

    ensureMaskSlotPlaceholderHidden(masksParent);

    const source = masksNodes[maskNodeName];
    if (!source) {
      console.warn(`[useGreatMask] Mask '${maskNodeName}' not found in Toa_Metru/Masks.glb`);
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

    applyGreatMaskColors(
      clone,
      maskColorRef.current,
      glowColorRef.current,
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
  }, [effectiveShadows, maskNodeName, masksNodes, masksParent]);

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
    applyGreatMaskColors(mask, maskColor, glowColor, maskPowerActive);
  }, [maskColor, glowColor, maskPowerActive]);
}

useGreatMask.preload = () => {
  useGLTF.preload(GREAT_MASKS_GLB_PATH);
};
