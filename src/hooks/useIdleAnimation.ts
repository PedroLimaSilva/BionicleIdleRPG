import { useEffect, useRef, type RefObject } from 'react';
import type { AnimationAction } from 'three';
import { type AnimationClip, type Group } from 'three';
import { useAnimations } from '@react-three/drei';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../utils/testMode';

const CROSSFADE_DURATION = 0.3;

export type UseIdleAnimationOptions = {
  /** Name of the clip to use as idle. Default: 'Idle'. When this changes, crossfades to the new action. */
  idleActionName?: string;
};

/**
 * Sets up idle animation for a model: mixer timeScale, starts idle action, configures test mode.
 * Use for models that only need idle (CharacterScene) or as the base for combat models.
 * When idleActionName is provided and changes, crossfades from the previous action to the new one.
 */
export function useIdleAnimation(
  animations: AnimationClip[],
  groupRef: RefObject<Group | null>,
  options: UseIdleAnimationOptions = {}
) {
  const { idleActionName = 'Idle' } = options;
  const { actions, mixer } = useAnimations(animations, groupRef);
  const currentIdleRef = useRef<AnimationAction | null>(null);

  useEffect(() => {
    mixer.timeScale = getAnimationTimeScale();
  }, [mixer]);

  useEffect(() => {
    const nextIdle = actions[idleActionName];
    if (!nextIdle) return;

    const prevIdle = currentIdleRef.current;
    const isCrossfade = prevIdle && prevIdle !== nextIdle && prevIdle.isRunning();
    if (isCrossfade) {
      prevIdle.fadeOut(CROSSFADE_DURATION);
    }

    currentIdleRef.current = nextIdle;
    nextIdle.reset();
    if (isCrossfade) {
      nextIdle.fadeIn(CROSSFADE_DURATION);
    }
    nextIdle.play();
    setupAnimationForTestMode(nextIdle);

    return () => {
      nextIdle.fadeOut(0.2);
      if (currentIdleRef.current === nextIdle) {
        currentIdleRef.current = null;
      }
    };
  }, [actions, idleActionName]);

  return { actions, mixer };
}
