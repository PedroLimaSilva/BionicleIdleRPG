import { useCallback } from 'react';
import type { AnimationAction, AnimationMixer } from 'three';
import { LoopOnce } from 'three';

export type UsePlayAnimationOptions = {
  /** ID for console warnings when animation not found (e.g. matoran.id) */
  modelId?: string;
  /** Time scale for one-shot actions (Attack, Hit). Default: 1.5 */
  actionTimeScale?: number;
  /** How to transition before playing an action. Default: 'fadeIdle' */
  transitionMode?: 'fadeIdle' | 'stopAll';
};

/**
 * Provides playAnimation to run one-shot actions (Attack, Hit) with return-to-idle.
 * Requires useIdleAnimation to be called first - pass its actions and mixer.
 */
export function usePlayAnimation(
  actions: Record<string, AnimationAction | null>,
  mixer: AnimationMixer,
  options: UsePlayAnimationOptions = {}
) {
  const { modelId, actionTimeScale = 1.5, transitionMode = 'fadeIdle' } = options;

  const playAnimation = useCallback(
    (name: string): Promise<void> => {
      return new Promise((resolve) => {
        const action = actions[name];
        if (!action) {
          if (modelId) {
            console.warn(`Animation '${name}' not found for ${modelId}`);
          }
          return resolve();
        }

        if (transitionMode === 'stopAll') {
          mixer.stopAllAction();
        } else {
          actions['Idle']?.fadeOut(0.2);
        }

        action.reset();
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(actionTimeScale);
        action.play();

        const onComplete = () => {
          mixer.removeEventListener('finished', onComplete);
          resolve();
          const idle = actions['Idle'];
          if (idle) {
            idle.reset().fadeIn(0.2).play();
          }
        };

        mixer.addEventListener('finished', onComplete);
      });
    },
    [actions, mixer, modelId, actionTimeScale, transitionMode]
  );

  return playAnimation;
}
