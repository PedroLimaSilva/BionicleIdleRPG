import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';

export function ToaTahuMataModel() {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(
    import.meta.env.BASE_URL + 'toa_mata_master.glb'
  );

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions['Tahu Idle'];
    if (!idle) return;

    idle.reset().play();

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

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
