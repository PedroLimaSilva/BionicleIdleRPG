import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useGreatMask } from '../../../hooks/useGreatMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { KIT_2003_GLB_PATH } from '../../../game/kit/kit2003';
import { KIT_2004_GLB_PATH } from '../../../game/kit/kit2004';
import {
  LHIKAN_KIT_2001_ATTACHMENTS,
  LHIKAN_KIT_2003_ATTACHMENTS,
  LHIKAN_KIT_2004_ATTACHMENTS,
} from '../../../game/kit/attachments/Toa Metru/lhikan';
import { METRU_WEATHERED } from '../../../game/kit/palettes/metruKitPlayerPalette';

const LHIKAN_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Metru/Lhikan.glb';

/**
 * `Lhikan.glb` authors the armature at Y≈10.11 so feet sit near 0 and the
 * head near 18 (the CharacterScene framing cylinder). Do not zero Y the way
 * Mata/Nuva roots do — that drops the legs below the camera.
 */
const LHIKAN_BIND_POSE_Y = 10.111;

/** Must match how many `useKitAttachments` calls this component makes. */
const LHIKAN_KIT_ATTACHMENT_RUNS = 3;

export const LhikanModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(LHIKAN_GLB_PATH);

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
      if (kitLayersDone.current >= LHIKAN_KIT_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = nodes as Record<string, Object3D | undefined>;

  useKitAttachments({
    attachments: LHIKAN_KIT_2004_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: LHIKAN_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: LHIKAN_KIT_2003_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useGreatMask(nodes.Masks, matoran, undefined, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.LHIKAN} scale={1} position={[0, LHIKAN_BIND_POSE_Y, -0.4]} />
    </group>
  );
});

useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH, KIT_2004_GLB_PATH);
useGreatMask.preload();
useGLTF.preload(LHIKAN_GLB_PATH);
