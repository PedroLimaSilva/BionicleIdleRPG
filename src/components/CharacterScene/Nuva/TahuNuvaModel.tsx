import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useIdleAnimation } from '../../../hooks/useIdleAnimation';
import { useNuvaMask } from '../../../hooks/useNuvaMask';

export const TahuNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/tahu.glb');

  useIdleAnimation(animations, group);

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes.PlateHolderL, 'Shoulder');
  useArmor(nodes.PlateHolderR, 'Shoulder');

  useNuvaMask(nodes.Masks, matoran);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Tahu} scale={1} position={[0, 10.15, 0]} />
    </group>
  );
});
