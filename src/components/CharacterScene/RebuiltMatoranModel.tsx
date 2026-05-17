import { useMemo, useRef } from 'react';
import { BaseMatoran, Mask } from '../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { useKitAttachments } from '../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../game/kit/kit2001';
import { KIT_2003_GLB_PATH } from '../../game/kit/kit2003';
import { REBUILT_KIT_2001_ATTACHMENTS } from '../../game/kit/attachments/rebuilt';
import type { WeatheredMetalOptions } from './WeatheredMetalMaterial';

const REBUILT_WEATHERED: WeatheredMetalOptions = {
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

export function RebuiltMatoranModel({
  matoran,
  onKitMeshesAttached,
}: {
  matoran: BaseMatoran & { maskOverride?: Mask };
  onKitMeshesAttached?: () => void;
}) {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'rebuilt.glb');
  const { actions, mixer } = useIdleAnimation(animations, group);

  useAnimationController({
    flavors: [actions['Tilt Head']].filter(Boolean),
    idle: actions['Idle'],
    mixer,
  });

  const onAttached = useMemo(
    () => (onKitMeshesAttached ? () => onKitMeshesAttached() : undefined),
    [onKitMeshesAttached]
  );

  useKitAttachments({
    attachments: REBUILT_KIT_2001_ATTACHMENTS,
    characterNodes: nodes as Record<string, Object3D | undefined>,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached,
    secondaryKitUrl: KIT_2003_GLB_PATH,
    weathered: REBUILT_WEATHERED,
  });

  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Matoran} position={[0, 0, -1.4]} />
    </group>
  );
}
