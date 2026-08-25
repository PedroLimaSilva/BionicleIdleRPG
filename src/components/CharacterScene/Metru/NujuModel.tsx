import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useGreatMask } from '../../../hooks/useGreatMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { useRigMaterials } from '../../../hooks/useRigMaterials';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { KIT_2003_GLB_PATH } from '../../../game/kit/kit2003';
import { KIT_2004_GLB_PATH } from '../../../game/kit/kit2004';
import {
  NUJU_KIT_2001_ATTACHMENTS,
  NUJU_KIT_2003_ATTACHMENTS,
  NUJU_KIT_2004_ATTACHMENTS,
  NUJU_RIG_MATERIALS,
} from '../../../game/kit/attachments/Toa Metru/nuju';
import { METRU_WEATHERED } from '../../../game/kit/palettes/metruKitPlayerPalette';

const NUJU_GLB_PATH = import.meta.env.BASE_URL + 'Toa_Metru/Nuju.glb';

/**
 * `Nuju.glb` authors the armature at Y≈10.11 so feet sit near 0 and the
 * head near 18 (the CharacterScene framing cylinder). Do not zero Y the way
 * Mata/Nuva roots do — that drops the legs below the camera.
 */
const NUJU_BIND_POSE_Y = 10.115;

/** Must match how many kit / rig material hooks this component runs. */
const NUJU_ATTACHMENT_RUNS = 4;

export const NujuModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(NUJU_GLB_PATH);

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
      if (kitLayersDone.current >= NUJU_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = useMemo(() => {
    const map: Record<string, Object3D | undefined> = {};
    (nodes.NUJU as Object3D | undefined)?.traverse((child) => {
      if (child.name) map[child.name] = child;
    });
    return map;
  }, [nodes]);

  useKitAttachments({
    attachments: NUJU_KIT_2004_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: NUJU_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: NUJU_KIT_2003_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useRigMaterials({
    characterNodes,
    colors: matoran.colors,
    onApplied: onKitLayerAttached,
    targets: NUJU_RIG_MATERIALS,
    weathered: METRU_WEATHERED,
  });

  useGreatMask(nodes.Masks, matoran, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.NUJU} scale={1} position={[0, NUJU_BIND_POSE_Y, -0.4]} />
    </group>
  );
});

useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH, KIT_2004_GLB_PATH);
useGreatMask.preload();
useGLTF.preload(NUJU_GLB_PATH);
