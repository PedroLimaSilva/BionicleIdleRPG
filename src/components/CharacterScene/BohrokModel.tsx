import { useEffect, useRef } from 'react';
import { Group, MeshStandardMaterial, Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { Color, LegoColor } from '../../types/Colors';

const BOHROK_COLORS: Record<
  string,
  { main: LegoColor; secondary: LegoColor; eyes: LegoColor }
> = {
  Tahnok: {
    main: LegoColor.Red,
    secondary: LegoColor.Orange,
    eyes: LegoColor.Blue,
  },
  Gahlok: {
    main: LegoColor.Blue,
    secondary: LegoColor.MediumBlue,
    eyes: LegoColor.Orange,
  },
  Lehvak: {
    main: LegoColor.Green,
    secondary: LegoColor.Lime,
    eyes: LegoColor.Red,
  },
  Pahrak: {
    main: LegoColor.Brown,
    secondary: LegoColor.Tan,
    eyes: LegoColor.Green,
  },
  Nuhvok: {
    main: LegoColor.Black,
    secondary: LegoColor.DarkGray,
    eyes: LegoColor.Lime,
  },
  Kohrak: {
    main: LegoColor.White,
    secondary: LegoColor.LightGray,
    eyes: LegoColor.MediumBlue,
  },
};

export function BohrokModel({ bohrok }: { bohrok: { name: string } }) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    import.meta.env.BASE_URL + 'bohrok_master.glb'
  );

  useEffect(() => {
    (materials.Bohrok_Main as MeshStandardMaterial).color.set(
      BOHROK_COLORS[bohrok.name].main as Color
    );
    (materials.Bohrok_Secondary as MeshStandardMaterial).color.set(
      BOHROK_COLORS[bohrok.name].secondary as Color
    );
    (materials.Bohrok_Eye as MeshStandardMaterial).color.set(
      BOHROK_COLORS[bohrok.name].eyes as Color
    );
    (materials.Bohrok_Eye as MeshStandardMaterial).emissive.set(
      BOHROK_COLORS[bohrok.name].eyes as Color
    );
    (materials.Bohrok_Iris as MeshStandardMaterial).color.set(
      BOHROK_COLORS[bohrok.name].eyes as Color
    );
    (materials.Bohrok_Iris as MeshStandardMaterial).emissive.set(
      BOHROK_COLORS[bohrok.name].eyes as Color
    );
    (materials.Krana as MeshStandardMaterial).color.set(
      BOHROK_COLORS[bohrok.name].eyes as Color
    );
  }, [nodes, materials, bohrok]);

  useEffect(() => {
    console.log(nodes);
    const shieldTarget = bohrok.name;
    ['R', 'L'].forEach((suffix) => {
      nodes[`Hand${suffix}`].children.forEach((shield) => {
        const isTarget = shield.name === `${shieldTarget}${suffix}`;
        shield.visible = isTarget;
      });
    });
  }, [nodes, bohrok]);

  return (
    <group ref={group} dispose={null}>
      <primitive
        object={nodes.Body}
        scale={4}
        position={new Vector3(0, -5, 0)}
      />
    </group>
  );
}
