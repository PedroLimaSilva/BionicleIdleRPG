import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { Group } from 'three';

export function ToaLewaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'toa_lewa_mata.glb');

  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;
    
    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === maskTarget;
      mask.visible = isTarget;
    });
  }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Toa'>
          <primitive object={nodes.Body} />
        </group>
      </group>
    </group>
  );
}
