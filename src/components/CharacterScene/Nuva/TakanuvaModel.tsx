import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useIdleAnimation } from '../../../hooks/useIdleAnimation';

export const TakanuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/takanuva.glb');
  useIdleAnimation(animations, group);

  useArmor(nodes.ChestPlateHolder, 'Chest', matoran.colors.mask);
  useArmor(nodes.PlateHolderL, 'Shoulder', matoran.colors.mask);
  useArmor(nodes.PlateHolderR, 'Shoulder', matoran.colors.mask);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Takanuva} scale={1} position={[0, 0, -0.4]} />
    </group>
  );
});
