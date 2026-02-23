import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { Color } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { MATORAN_DEX } from '../../data/matoran';

export const BohrokModel = forwardRef<CombatantModelHandle, { id: string }>(({ id }, ref) => {
  const group = useRef<Group>(null);

  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'bohrok_master.glb');

  const bodyInstance = useMemo(() => nodes.Body.clone(true), [nodes]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: id,
    actionTimeScale: 2,
    transitionMode: 'stopAll',
    attackResolveAtFraction: 0.1,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useEffect(() => {
    const colorScheme = MATORAN_DEX[id].colors;

    bodyInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const originalMaterial = child.material as MeshStandardMaterial;
      const cloned = originalMaterial.clone();

      // Set custom color logic based on mesh name or usage
      if (cloned.name === 'Bohrok_Main') {
        cloned.color.set(colorScheme.body as Color);
      } else if (cloned.name === 'Bohrok_Secondary') {
        cloned.color.set(colorScheme.arms as Color);
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

    const shieldTarget = id.replace(/^./, (char) => char.toUpperCase());
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
  }, [bodyInstance, id]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={bodyInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
useGLTF.preload(import.meta.env.BASE_URL + 'bohrok_master.glb');
