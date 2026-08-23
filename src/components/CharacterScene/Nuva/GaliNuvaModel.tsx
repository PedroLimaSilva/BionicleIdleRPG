import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useArmor } from '../../../hooks/useArmor';
import { useNuvaMask } from '../../../hooks/useNuvaMask';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { KIT_2003_GLB_PATH } from '../../../game/kit/kit2003';
import {
  GALI_NUVA_KIT_2001_ATTACHMENTS,
  GALI_NUVA_KIT_2003_ATTACHMENTS,
} from '../../../game/kit/attachments/Toa Nuva/gali';
import type { WeatheredMetalOptions } from '../WeatheredMetalMaterial';

const GALI_NUVA_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18.0,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  largeScale: 3.5,
  metalness: 0.05,
  roughness: 0.55,
};

/** Must match how many `useKitAttachments` calls this component makes. */
const GALI_NUVA_KIT_ATTACHMENT_RUNS = 2;

export const GaliNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/gali.glb');

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
      if (kitLayersDone.current >= GALI_NUVA_KIT_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = nodes as Record<string, Object3D | undefined>;

  useKitAttachments({
    attachments: GALI_NUVA_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitSlotMap: matoran.kitSlotMap,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: GALI_NUVA_WEATHERED,
  });

  useKitAttachments({
    attachments: GALI_NUVA_KIT_2003_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitSlotMap: matoran.kitSlotMap,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: matoran.stage,
    weathered: GALI_NUVA_WEATHERED,
  });

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes['PlateHolderL'], 'Shoulder');
  useArmor(nodes['PlateHolderR'], 'Shoulder');

  useNuvaMask(nodes.Masks, matoran, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Gali} scale={1} position={[0, 0.25, -0.4]} />
    </group>
  );
});

useKitAttachments.preload(KIT_2001_GLB_PATH);
