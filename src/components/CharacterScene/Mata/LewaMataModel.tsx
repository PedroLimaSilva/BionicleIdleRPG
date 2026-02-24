import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useMask } from '../../../hooks/useMask';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';

export const LewaMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/lewa.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.4,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));
  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Lewa} scale={1} position={[0, 9.6, 0]} />
    </group>
  );
});
