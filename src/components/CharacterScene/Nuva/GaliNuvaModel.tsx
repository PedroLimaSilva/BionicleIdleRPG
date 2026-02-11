import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useEffect, useRef } from 'react';
import { Group, Mesh } from 'three';
import {
  applyStandardPlasticToObject,
  getStandardPlasticMaterial,
} from '../StandardPlasticMaterial';

export const ToaGaliNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }) => {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/gali.glb');
  useEffect(() => {
    if (group.current) applyStandardPlasticToObject(group.current);
  }, [nodes]);

  useEffect(() => {
    const maskColor = matoran.maskColorOverride || matoran.colors.mask;
    // TODO: add all masks to the blender and reexport
    const mesh = nodes.Kaukau as Mesh;
    const mat = getStandardPlasticMaterial(maskColor);
    mesh.material = mat;
  }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name="Toa" position={[0, 9.6, -0.4]}>
        <primitive object={nodes.Waist} scale={1} />
      </group>
    </group>
  );
});
