import { useMemo, useRef } from 'react';
import { BaseMatoran, Mask } from '../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { useKitAttachments } from '../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../game/kit/kit2001';
import { DIMINISHED_KIT_2001_ATTACHMENTS } from '../../game/kit/attachments/diminished';
import type { WeatheredMetalOptions } from './WeatheredMetalMaterial';

const DIMINISHED_WEATHERED: WeatheredMetalOptions = {
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

export function DiminishedMatoranModel({
  matoran,
  onKitMeshesAttached,
}: {
  matoran: BaseMatoran & { maskOverride?: Mask };
  onKitMeshesAttached?: () => void;
}) {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'matoran_master.glb');
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

  /** Body’s face socket is also named `Head`; expose it as `McToranFace` for kit lookup. */
  const kitCharacterNodes = useMemo(() => {
    const body = nodes.Body as Object3D | undefined;
    const faceSocket = body?.children.find((child) => child.name === 'Head');
    return {
      ...(nodes as Record<string, Object3D | undefined>),
      McToranFace: faceSocket,
    };
  }, [nodes]);

  useKitAttachments({
    attachments: DIMINISHED_KIT_2001_ATTACHMENTS,
    characterNodes: kitCharacterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached,
    weathered: DIMINISHED_WEATHERED,
  });

  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, matoran, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Matoran} position={[0, 0, -1.4]} />
    </group>
  );
}
