import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useNuvaMask } from '../../../hooks/useNuvaMask';
import { useIdleAnimation } from '../../../hooks/useIdleAnimation';

export const OnuaNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/onua.glb');
  useIdleAnimation(animations, group);

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes.PlateHolderL, 'Shoulder');
  useArmor(nodes.PlateHolderR, 'Shoulder');

  useNuvaMask(nodes.Masks, matoran, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Onua} scale={1} position={[0, 0, -0.8]} />
    </group>
  );
});
