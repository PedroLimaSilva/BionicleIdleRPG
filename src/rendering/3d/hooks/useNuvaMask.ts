import { useEffect, useMemo, useRef } from 'react';
import { Color, Mesh, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { resolveWornMask } from '../../../game/masks/wornMask';
import { LegoColor } from '../../../types/Colors';
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
import {
  applyMaskMetallicPbr,
  applyNuvaBakedKanohiPbr,
  cloneMaskMeshMaterials,
  forEachMaskMaterial,
  isMaskGlowMaterialName,
  isMaskStandardMat,
  MASK_LENS_GLOW_EMISSIVE_INTENSITY,
} from './maskMaterial';
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

function isNuvaLensMesh(mesh: Mesh): boolean {
  return mesh.name.includes('Lens');
}

/** Infected Hau ships fully baked albedo + PBR maps; no runtime tint or wear shader. */
function isNuvaFullyBakedMask(maskName: string): boolean {
  return maskName === Mask.HauNuvaInfected;
}

function nuvaMaskTintColor(maskName: string, maskColor: string): string | undefined {
  if (isNuvaFullyBakedMask(maskName)) return undefined;
  if (maskName === Mask.Vahi) return LegoColor.PearlGold;
  return maskColor;
}

/** Apply mask color to materials; fully baked infected Hau keeps GLB PBR maps. */
function applyNuvaMaskColors(
  root: Object3D,
  maskColor: string,
  maskName: string,
  maskPowerActive?: boolean
): void {
  const tintColor = nuvaMaskTintColor(maskName, maskColor);
  const fullyBaked = isNuvaFullyBakedMask(maskName);

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;

    forEachMaskMaterial(mesh, (mat) => {
      if (isMaskGlowMaterialName(mat.name) || isNuvaLensMesh(mesh)) {
        if (isMaskGlowMaterialName(mat.name) && mat.emissive) {
          mat.emissiveIntensity = MASK_LENS_GLOW_EMISSIVE_INTENSITY;
        }
        return;
      }

      if (fullyBaked) {
        applyNuvaBakedKanohiPbr(mat);
        return;
      }

      if (!tintColor) return;

      mat.color.copy(new Color(tintColor));
      applyMaskMetallicPbr(mat, tintColor);
      if (mat.emissive) {
        if (maskPowerActive) {
          mat.emissive = new Color(tintColor);
          mat.emissiveIntensity = 2.5;
        } else {
          mat.emissive = new Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      }
    });
  });

  if (tintColor) {
    applyMaskDiscolorationToObject(root, undefined, tintColor);
  }
}

/**
 * Loads a mask from Toa_Nuva/masks.glb, attaches it to the parent, and applies color.
 * Mask selection: matoran.maskOverride || matoran.mask (from matoran dex).
 * Vahi tints gold (PearlGold). Infected Hau keeps baked albedo + metalness/roughness
 * maps from the GLB ({@link applyNuvaBakedKanohiPbr}), not {@link applyMaskMetallicPbr}.
 * Other Kanohi use baked emissive discoloration the same way as Mata/Turaga
 * {@link useMask} whenever the GLB ships an emissiveMap.
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

    const source = masksNodes[maskName];
    if (!source) {
      console.warn(`[useNuvaMask] Mask '${maskName}' not found in Toa_Nuva/masks.glb`);
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
          cloneMaskMeshMaterials(mesh, maskName);
        }
      }
    });

    applyKanohiRenderOrder(clone);

    if (!isNuvaFullyBakedMask(maskNameRef.current)) {
      const tint =
        nuvaMaskTintColor(maskNameRef.current, maskColorRef.current) ?? maskColorRef.current;
      setupMaskDiscolorationShader(clone, tint);
    }

    applyNuvaMaskColors(
      clone,
      maskColorRef.current,
      maskNameRef.current,
      maskPowerActiveRef.current
    );

    const prevMask = maskRef.current;
    const isChange =
      prevMaskFileNameRef.current !== null &&
      prevMaskFileNameRef.current !== maskName &&
      prevMask !== null;

    if (isChange && prevMask) {
      startMaskTransition(transitionRef, masksParent, prevMask);
    } else if (prevMask) {
      masksParent.remove(prevMask);
    }

    masksParent.add(clone);
    maskRef.current = clone;
    prevMaskFileNameRef.current = maskName;
  }, [masksNodes, masksParent, maskName, effectiveShadows]);

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
