import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';

export const TakanuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/takanuva.glb');

  useArmor(nodes.ChestPlateHolder, 'Chest', matoran.colors.mask, undefined, 38);
  useArmor(nodes.PlateHolderL, 'Shoulder', matoran.colors.mask, undefined, 38);
  useArmor(nodes.PlateHolderR, 'Shoulder', matoran.colors.mask, undefined, 38);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Takanuva} scale={1} position={[0, 0, -0.4]} />
    </group>
  );
});
