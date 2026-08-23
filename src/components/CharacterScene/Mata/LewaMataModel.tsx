import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useMask } from '../../../hooks/useMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { LEWA_MATA_KIT_2001_ATTACHMENTS } from '../../../game/kit/attachments/Toa Mata/lewa';
import type { WeatheredMetalOptions } from '../WeatheredMetalMaterial';

const LEWA_WEATHERED: WeatheredMetalOptions = {
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

export const LewaMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/lewa.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.4,
    modelId: matoran.id,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const onAttached = useMemo(
    () => (onKitMeshesAttached ? () => onKitMeshesAttached() : undefined),
    [onKitMeshesAttached]
  );

  useKitAttachments({
    attachments: LEWA_MATA_KIT_2001_ATTACHMENTS,
    characterNodes: nodes as Record<string, Object3D | undefined>,
    colors: matoran.colors,
    kitSlotMap: matoran.kitSlotMap,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached,
    stage: matoran.stage,
    weathered: LEWA_WEATHERED,
  });

  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Lewa} scale={1} position={[0, 0, -0.4]} />
    </group>
  );
});
