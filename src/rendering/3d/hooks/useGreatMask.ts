import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { resolveWornMask } from '../../../game/masks/wornMask';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useGame } from '../../../context/Game';
import { useSettings } from '../../../context/useSettings';
import { shouldEnableShadows } from '../../../utils/testMode';
import { getEffectiveMaskColor } from '../../../game/characters/maskColor';
import { getGreatMaskNodeName } from '../greatMasks';
import {
  createMaskTransitionState,
  startMaskTransition,
  useMaskTransitionFrame,
} from './maskTransition';
import { ensureMaskSlotPlaceholderHidden } from './ensureMaskSlotPlaceholderHidden';
import { applyKanohiRenderOrder } from './kanohiRenderOrder';
import {
  applyMaskGlowTint,
  applyMaskMetallicPbr,
  cloneMaskMeshMaterials,
  forEachMaskMaterial,
  isMaskGlowMaterialName,
  isMaskStandardMat,
  MASK_LENS_GLOW_EMISSIVE_INTENSITY,
  syncMaskTransparencyState,
} from './maskMaterial';
import {
  applyMaskDiscolorationToObject,
  applyMaskPowerEmissive,
  setupMaskDiscolorationShader,
} from './maskDiscoloration';
import { masksCollected } from '../../../services/matoranUtils';

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

    forEachMaskMaterial(mesh, (mat) => {
      if (isMaskGlowMaterialName(mat.name)) {
        if (!glowColor) return;
        applyMaskGlowTint(mat, glowColor, MASK_LENS_GLOW_EMISSIVE_INTENSITY);
        return;
      }

      mat.color.copy(new Color(maskColor));
      applyMaskMetallicPbr(mat, maskColor);
      syncMaskTransparencyState(mat);
      applyMaskPowerEmissive(mat, maskColor, maskPowerActive);
    });
  });

  applyMaskDiscolorationToObject(root, undefined, maskColor);
}

/**
 * Loads a Great Kanohi from `Toa_Metru/Masks.glb` and attaches it to the parent.
 * Mask selection: `matoran.maskOverride || matoran.mask` among collected masks.
 * Avatar ids and GLB nodes both use the `_Great` suffix (`Hau_Great`).
 *
 * Baked emissive discoloration is applied whenever the GLB ships an emissiveMap,
 * the same path as Mata/Turaga {@link useMask} and Nuva {@link useNuvaMask}.
 *
 * @param glowColor - Optional color for emissive `Glow` materials (e.g. Matatu scope lens).
 */
export function useGreatMask(
  masksParent: Object3D | undefined,
  matoran: BaseMatoran & RecruitedCharacterData & { unlockAllMasks?: boolean },
  glowColor?: string,
  maskPowerActive?: boolean
) {
  const { completedQuests } = useGame();
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();
  const collected = matoran.unlockAllMasks ? [] : masksCollected(matoran, completedQuests);
  const maskName = resolveWornMask(matoran, collected);
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
        const raw = mesh.material;
        const hasTintable =
          isMaskStandardMat(raw) ||
          (Array.isArray(raw) && raw.some((mat) => isMaskStandardMat(mat)));
        if (hasTintable) {
          cloneMaskMeshMaterials(mesh, maskNodeName);
        }
      }
    });

    applyKanohiRenderOrder(clone);

    setupMaskDiscolorationShader(clone, maskColorRef.current);

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
  }, [effectiveShadows, maskName, maskNodeName, masksNodes, masksParent]);

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
