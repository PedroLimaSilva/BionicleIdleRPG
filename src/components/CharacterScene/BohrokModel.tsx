import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Group, LoopOnce, Mesh, MeshStandardMaterial } from 'three';
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

    const { nodes, animations } = useGLTF(
      import.meta.env.BASE_URL + 'bohrok_master.glb'
    );

    const bodyInstance = useMemo(() => nodes.Body.clone(true), [nodes]);

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
          mixer.stopAllAction()
          action.reset();
          action.setLoop(LoopOnce, 1);
          action.clampWhenFinished = true;
          action.setEffectiveTimeScale(2);
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
      const colorScheme = BOHROK_COLORS[name];

      bodyInstance.traverse((child) => {
        if (!(child instanceof Mesh)) return;

        const originalMaterial = child.material as MeshStandardMaterial;
        const cloned = originalMaterial.clone();

        // Set custom color logic based on mesh name or usage
        if (cloned.name === 'Bohrok_Main') {
          cloned.color.set(colorScheme.main as Color);
        } else if (cloned.name === 'Bohrok_Secondary') {
          cloned.color.set(colorScheme.secondary as Color);
        } else if (
          cloned.name === 'Bohrok_Eye' ||
          cloned.name === 'Bohrok_Iris' ||
          cloned.name === 'Krana'
        ) {
          cloned.color.set(colorScheme.eyes as Color);
          if (cloned.name === 'Bohrok_Eye' || cloned.name === 'Bohrok_Iris') {
            cloned.emissive.set(colorScheme.eyes as Color);
          }
        }

        child.material = cloned;
      });

      const shieldTarget = name;
      ['R', 'L'].forEach((suffix) => {
        bodyInstance.traverse((child) => {
          if (child.name === `Hand${suffix}`) {
            child.children.forEach((shield) => {
              const isTarget = shield.name === `${shieldTarget}${suffix}`;
              shield.visible = isTarget;
            });
          }
        });
      });
    }, [bodyInstance, name]);

    return (
      <group ref={group} dispose={null}>
        <primitive object={bodyInstance} />
      </group>
    );
  }
);
useGLTF.preload(import.meta.env.BASE_URL + 'bohrok_master.glb');
