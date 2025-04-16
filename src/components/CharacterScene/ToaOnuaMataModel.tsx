import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';

export function ToaOnuaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'toa_onua_mata.glb');

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
