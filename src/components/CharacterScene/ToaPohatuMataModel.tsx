import { useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';

export function ToaPohatuMataModel() {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(import.meta.env.BASE_URL + 'toa_pohatu_mata.glb');

  // const { actions } = useAnimations(animations, group);

  // useEffect(() => {

  //   // const idle = actions['Tahu Idle'];
  //   // if (!idle) return;

  //   // idle.reset().play();

  //   // return () => {
  //   //   idle.fadeOut(0.2);
  //   // };
  // }, [materials]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Toa' position={[0, -0.5,-0.4]} scale={37}>
          <primitive object={nodes.Waist} />
        </group>
      </group>
    </group>
  );
}
