import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Group, LoopOnce } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../../utils/testMode';
import { useMask } from '../../hooks/useMask';

export const ToaKopakaMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/kopaka.glb');
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
        actions['Idle']?.fadeOut(0.2);
        action.reset();
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(1.5);
        action.play();

        const onComplete = () => {
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
    const idle = actions['Idle'];
    if (!idle) return;
    idle.reset().play();

    // In test mode, force animation to frame 0 and pause
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const maskColor = matoran.maskColorOverride || matoran.colors.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, maskColor, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Kopaka} scale={1} position={[0, 9.4, -0.4]} />
    </group>
  );
});
