import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useMask } from '../../../hooks/useMask';

export const GaliMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/gali.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.6,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const maskColor = matoran.maskColorOverride || matoran.colors.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, maskColor, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Gali} scale={1} position={[0, 9.6, 0]} />
    </group>
  );
});
