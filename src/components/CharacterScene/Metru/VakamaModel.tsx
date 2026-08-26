import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useGreatMask } from '../../../hooks/useGreatMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { KIT_2004_GLB_PATH } from '../../../game/kit/kit2004';
import {
  VAKAMA_KIT_2001_ATTACHMENTS,
  VAKAMA_KIT_2004_ATTACHMENTS,
} from '../../../game/kit/attachments/Toa Metru/vakama';
import { METRU_WEATHERED } from '../../../game/kit/palettes/metruKitPlayerPalette';

const VAKAMA_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Metru/Vakama.glb';

/**
 * `Vakama.glb` authors the armature at Y≈10.11 so feet sit near 0 and the
 * head near 18 (the CharacterScene framing cylinder). Do not zero Y the way
 * Mata/Nuva roots do — that drops the legs below the camera.
 */
const VAKAMA_BIND_POSE_Y = 10.111;

/** Must match how many `useKitAttachments` calls this component makes. */
const VAKAMA_ATTACHMENT_RUNS = 2;

export const VakamaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(VAKAMA_GLB_PATH);

  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.5,
    modelId: matoran.id,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const kitLayersDone = useRef(0);
  const onKitLayerAttached = useMemo(() => {
    if (!onKitMeshesAttached) return undefined;
    return () => {
      kitLayersDone.current += 1;
      if (kitLayersDone.current >= VAKAMA_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = useMemo(() => {
    const map: Record<string, Object3D | undefined> = {};
    (nodes.VAKAMA as Object3D | undefined)?.traverse((child) => {
      if (child.name) map[child.name] = child;
    });
    return map;
  }, [nodes]);

  useKitAttachments({
    attachments: VAKAMA_KIT_2004_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: VAKAMA_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  const glowColor = matoran.colors.eyes;
  useGreatMask(nodes.Masks, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.VAKAMA} scale={1} position={[0, VAKAMA_BIND_POSE_Y, -0.4]} />
    </group>
  );
});

useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2004_GLB_PATH);
useGreatMask.preload();
useGLTF.preload(VAKAMA_GLB_PATH);
