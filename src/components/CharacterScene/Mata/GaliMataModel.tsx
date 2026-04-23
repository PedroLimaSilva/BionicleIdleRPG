import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useMask } from '../../../hooks/useMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { GALI_MATA_KIT_2001_ATTACHMENTS } from './galiMataKitAttach';
import type { WeatheredMetalOptions } from '../WeatheredMetalMaterial';

const GALI_WEATHERED: WeatheredMetalOptions = {
  roughness: 0.55,
  metalness: 0.05,
  grimeDarken: 0.4,
  grimeRoughness: 0.2,
  grimeMetalnessReduce: 0.5,
  largeScale: 3.5,
  fineScale: 18.0,
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeStrength: 0.15,
  edgeCurvatureScale: 2,
};

export const GaliMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/gali.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.6,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const onAttached = useMemo(
    () => (onKitMeshesAttached ? () => onKitMeshesAttached() : undefined),
    [onKitMeshesAttached]
  );

  useKitAttachments({
    characterNodes: nodes as Record<string, Object3D | undefined>,
    kitUrl: KIT_2001_GLB_PATH,
    attachments: GALI_MATA_KIT_2001_ATTACHMENTS,
    colors: matoran.colors,
    weathered: GALI_WEATHERED,
    onAttached,
  });

  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Gali} position={[0, 0, -0.4]} />
    </group>
  );
});
