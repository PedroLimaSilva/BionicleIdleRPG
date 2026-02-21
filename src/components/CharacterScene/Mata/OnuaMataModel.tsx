import { useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useIdleAnimation } from '../../../hooks/useIdleAnimation';
import { useMask } from '../../../hooks/useMask';

export function OnuaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran & { maskGlow?: boolean };
}) {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/onua.glb');

  useIdleAnimation(animations, group);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const maskColor = matoran.maskColorOverride || matoran.colors.mask;
  const glowColor = matoran.maskGlow ? '#aaffff' : matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, maskColor, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Onua} scale={1} position={[0, 9.6, 0]} />
    </group>
  );
}
