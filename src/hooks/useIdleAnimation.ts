import { useEffect, type RefObject } from 'react';
import { type AnimationClip, type Group } from 'three';
import { useAnimations } from '@react-three/drei';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../utils/testMode';

/**
 * Sets up idle animation for a model: mixer timeScale, starts Idle, configures test mode.
 * Use for models that only need idle (CharacterScene) or as the base for combat models.
 */
export function useIdleAnimation(animations: AnimationClip[], groupRef: RefObject<Group | null>) {
  const { actions, mixer } = useAnimations(animations, groupRef);

  useEffect(() => {
    mixer.timeScale = getAnimationTimeScale();
  }, [mixer]);

  useEffect(() => {
    const idle = actions['Idle'];
    if (!idle) return;

    idle.reset().play();
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  return { actions, mixer };
}
