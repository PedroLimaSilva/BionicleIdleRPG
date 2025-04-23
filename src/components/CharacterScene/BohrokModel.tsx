import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group, LoopOnce, MeshStandardMaterial } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { Color, LegoColor } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';

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

export const BohrokModel = forwardRef<CombatantModelHandle, { name: string }>(
  ({ name }, ref) => {
    const group = useRef<Group>(null);

    const { nodes, materials, animations } = useGLTF(
      import.meta.env.BASE_URL + 'bohrok_master.glb'
    );

    const { actions, mixer } = useAnimations(animations, group);

    useEffect(() => {
      const idle = actions['Idle'];
      if (!idle) return;

      idle.reset().play();

      return () => {
        idle.fadeOut(0.2);
      };
    }, [actions]);

    useImperativeHandle(ref, () => ({
      playAnimation: (actionName) => {
        return new Promise<void>((resolve) => {
          const action = actions[actionName];
          console.log(`Playing '${actionName}' on ${name}`);
          if (!action) {
            console.warn(`Animation '${actionName}' not found for ${name}`);
            return resolve();
          }
          actions['Idle']?.fadeOut(0.2);
          action.reset();
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();

          const onComplete = () => {
            console.log(`Completed '${actionName}' on ${name}`);
            mixer.removeEventListener('finished', onComplete);
            resolve();
            const idle = actions['Idle'];
            if (!idle) return;
            idle.reset().fadeIn(0.2).play();
          };

          mixer.addEventListener('finished', onComplete);
        });
      },
    }));

    useEffect(() => {
      (materials.Bohrok_Main as MeshStandardMaterial).color.set(
        BOHROK_COLORS[name].main as Color
      );
      (materials.Bohrok_Secondary as MeshStandardMaterial).color.set(
        BOHROK_COLORS[name].secondary as Color
      );
      (materials.Bohrok_Eye as MeshStandardMaterial).color.set(
        BOHROK_COLORS[name].eyes as Color
      );
      (materials.Bohrok_Eye as MeshStandardMaterial).emissive.set(
        BOHROK_COLORS[name].eyes as Color
      );
      (materials.Bohrok_Iris as MeshStandardMaterial).color.set(
        BOHROK_COLORS[name].eyes as Color
      );
      (materials.Bohrok_Iris as MeshStandardMaterial).emissive.set(
        BOHROK_COLORS[name].eyes as Color
      );
      (materials.Krana as MeshStandardMaterial).color.set(
        BOHROK_COLORS[name].eyes as Color
      );
    }, [nodes, materials, name]);

    useEffect(() => {
      const shieldTarget = name;
      ['R', 'L'].forEach((suffix) => {
        nodes[`Hand${suffix}`].children.forEach((shield) => {
          const isTarget = shield.name === `${shieldTarget}${suffix}`;
          shield.visible = isTarget;
        });
      });
    }, [nodes, name]);

    return (
      <group ref={group} dispose={null}>
        <primitive object={nodes.Body} />
      </group>
    );
  }
);
