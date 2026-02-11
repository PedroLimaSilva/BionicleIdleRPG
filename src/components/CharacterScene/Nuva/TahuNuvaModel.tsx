import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useEffect, useRef } from 'react';
import { Group } from 'three';
import { applyStandardPlasticToObject } from '../StandardPlasticMaterial';

export const ToaTahuNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/tahu.glb');

  useEffect(() => {
    if (group.current) applyStandardPlasticToObject(group.current);
  }, [nodes]);

  // useEffect(() => {
  //   const maskColor = matoran.maskColorOverride || matoran.colors.mask;
  //   nodes.Masks.children.forEach((mask) => {
  //     const mesh = mask as Mesh;
  //     let mat = getStandardPlasticMaterial(maskColor);
  //     mesh.material = mat;
  //   });
  // }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name="Toa" position={[0, 10.2, 0]}>
        <primitive object={nodes.Body} />
      </group>
    </group>
  );
});
