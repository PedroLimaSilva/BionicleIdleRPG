import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group, LoopOnce, Mesh, MeshStandardMaterial } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { Color, LegoColor } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../../utils/testMode';

export const ToaTahuMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations, materials } = useGLTF(
    import.meta.env.BASE_URL + 'toa_tahu_mata.glb'
  );

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Set mixer timeScale based on test mode
    mixer.timeScale = getAnimationTimeScale();
  }, [mixer]);

  useImperativeHandle(ref, () => ({
    playAnimation: (name) => {
      return new Promise<void>((resolve) => {
        const action = actions[name];
        if (!action) {
          console.warn(`Animation '${name}' not found for ${matoran.id}`);
          return resolve();
        }
        actions['Tahu Idle']?.fadeOut(0.2);
        action.reset();
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(1.5);
        action.play();

        const onComplete = () => {
          mixer.removeEventListener('finished', onComplete);
          resolve();
          const idle = actions['Tahu Idle'];
          if (!idle) return;
          idle.reset().fadeIn(0.2).play();
        };

        mixer.addEventListener('finished', onComplete);
      });
    },
  }));

  useEffect(() => {
    const idle = actions['Tahu Idle'];
    if (!idle) return;

    idle.reset().play();

    // In test mode, force animation to frame 0 and pause
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    nodes.Masks.children.forEach((mask) => {
      const mesh = mask as Mesh;
      mesh.material = materials['Tahu Red'].clone();
      const mat = mesh.material as MeshStandardMaterial;
      mat.color.set(
        (matoran.maskColorOverride || matoran.colors.mask) as Color
      );
      mat.metalness =
        matoran.maskColorOverride === LegoColor.PearlGold ? 0.5 : 0;
      if (mask.name === Mask.Kaukau) {
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
  }, [nodes, materials, matoran]);

  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === maskTarget;
      mask.visible = isTarget;
    });
  }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name='Toa' position={[0, -7.5, -0.4]}>
        <primitive object={nodes.Body} />
        <primitive object={nodes.Root} />
        <primitive object={nodes.LegIKTargetL} />
        <primitive object={nodes.LegIKTargetR} />
      </group>
    </group>
  );
});
