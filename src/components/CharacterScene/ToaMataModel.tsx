import { useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';

export function ToaMataModel() {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'toa_mata_master.glb');

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
