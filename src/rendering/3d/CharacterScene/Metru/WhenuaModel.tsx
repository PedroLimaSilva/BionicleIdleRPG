import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../../types/Matoran';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { useGreatMask } from '../../hooks/useGreatMask';
import { useKitAttachments } from '../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../kit/kit2001';
import { KIT_2004_GLB_PATH } from '../../kit/kit2004';
import {
  WHENUA_KIT_2001_ATTACHMENTS,
  WHENUA_KIT_2004_ATTACHMENTS,
} from '../../kit/attachments/Toa Metru/whenua';
import { METRU_WEATHERED } from '../../kit/palettes/metruKitPlayerPalette';

const WHENUA_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Metru/Whenua.glb';

/**
 * `Whenua.glb` authors the armature at Y≈10.10 so feet sit near 0 and the
 * head near 18 (the CharacterScene framing cylinder). Do not zero Y the way
 * Mata/Nuva roots do — that drops the legs below the camera.
 */
const WHENUA_BIND_POSE_Y = 10.105;

/** Must match how many `useKitAttachments` calls this component makes. */
const WHENUA_ATTACHMENT_RUNS = 2;

export const WhenuaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(WHENUA_GLB_PATH);

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
      if (kitLayersDone.current >= WHENUA_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = useMemo(() => {
    const map: Record<string, Object3D | undefined> = {};
    (nodes.WHENUA as Object3D | undefined)?.traverse((child) => {
      if (child.name) map[child.name] = child;
    });
    return map;
  }, [nodes]);

  useKitAttachments({
    attachments: WHENUA_KIT_2004_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: WHENUA_KIT_2001_ATTACHMENTS,
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
      <primitive object={nodes.WHENUA} scale={1} position={[0, WHENUA_BIND_POSE_Y, -0.4]} />
    </group>
  );
});

useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2004_GLB_PATH);
useGreatMask.preload();
useGLTF.preload(WHENUA_GLB_PATH);
