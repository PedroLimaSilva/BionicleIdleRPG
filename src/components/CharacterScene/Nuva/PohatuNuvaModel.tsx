import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useMemo, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useNuvaMask } from '../../../hooks/useNuvaMask';

export const PohatuNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/pohatu.glb');
  const modelClone = useMemo(() => scene.clone(true), [scene]);

  useArmor(modelClone.getObjectByName('ChestPlateHolder') ?? undefined, 'Chest');
  useArmor(modelClone.getObjectByName('PlateHolderL') ?? undefined, 'Shoulder');
  useArmor(modelClone.getObjectByName('PlateHolderR') ?? undefined, 'Shoulder');

  useNuvaMask(modelClone, matoran);

  return (
    <group ref={group} dispose={null}>
      <primitive object={modelClone} scale={36.5} position={[0, 8.78, -0.8]} />
    </group>
  );
});
