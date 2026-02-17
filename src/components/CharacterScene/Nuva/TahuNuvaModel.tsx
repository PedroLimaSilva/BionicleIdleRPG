import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';

export const ToaTahuNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/tahu.glb');

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes.PlateHolderL, 'Shoulder');
  useArmor(nodes.PlateHolderR, 'Shoulder');

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Body} scale={1} position={[0, 9.75, 0]} />
    </group>
  );
});
