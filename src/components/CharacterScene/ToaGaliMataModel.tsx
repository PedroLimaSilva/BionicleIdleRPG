import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';

export function ToaGaliMataModel() {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    import.meta.env.BASE_URL + 'toa_gali_mata.glb'
  );

  // const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (materials['Gali Mask']) {
      materials['Gali Mask'].transparent = true;
      materials['Gali Mask'].opacity = 0.8;
    }

    // const idle = actions['Tahu Idle'];
    // if (!idle) return;

    // idle.reset().play();

    // return () => {
    //   idle.fadeOut(0.2);
    // };
  }, [materials]);

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
