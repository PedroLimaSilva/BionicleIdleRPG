import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { AnimationAction, AnimationMixer } from 'three';
import { LoopOnce } from 'three';

export type UsePlayAnimationOptions = {
  /** ID for console warnings when animation not found (e.g. matoran.id) */
  modelId?: string;
  /** Time scale for one-shot actions (Attack, Hit). Default: 1 */
  actionTimeScale?: number;
  /** How to transition before playing an action. Default: 'fadeIdle' */
  transitionMode?: 'fadeIdle' | 'stopAll';
  /** For Attack: resolve promise at this fraction through (0-1). Default: 0.5. Hit/Defeat always resolve at end. */
  attackResolveAtFraction?: number;
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
  const {
    modelId,
    actionTimeScale = 1,
    transitionMode = 'fadeIdle',
    attackResolveAtFraction = 0.5,
  } = options;

  const pendingAttackResolve = useRef<{
    action: AnimationAction;
    resolve: () => void;
    resolveAtTime: number;
    hasResolved: boolean;
  } | null>(null);

  useFrame(() => {
    const pending = pendingAttackResolve.current;
    if (!pending || pending.hasResolved) return;
    if (pending.action.time >= pending.resolveAtTime) {
      pending.hasResolved = true;
      pending.resolve();
    }
  });

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

        const isAttackWithEarlyResolve = name === 'Attack';

        if (isAttackWithEarlyResolve) {
          const clip = action.getClip();
          const resolveAtTime = clip.duration * attackResolveAtFraction;
          pendingAttackResolve.current = {
            action,
            resolve,
            resolveAtTime,
            hasResolved: false,
          };

          const onFinished = (e: { action: AnimationAction }) => {
            if (e.action !== action) return;
            mixer.removeEventListener('finished', onFinished);
            const pending = pendingAttackResolve.current;
            if (pending && pending.action === action) {
              pendingAttackResolve.current = null;
              if (!pending.hasResolved) pending.resolve();
            }
            const idle = actions['Idle'];
            if (idle) {
              idle.reset().fadeIn(0.2).play();
            }
          };

          mixer.addEventListener('finished', onFinished);
        } else {
          const onComplete = () => {
            mixer.removeEventListener('finished', onComplete);
            resolve();
            if (name === 'Defeat') return;
            const idle = actions['Idle'];
            if (idle) {
              idle.reset().fadeIn(0.2).play();
            }
          };

          mixer.addEventListener('finished', onComplete);
        }
      });
    },
    [actions, mixer, modelId, actionTimeScale, transitionMode, attackResolveAtFraction]
  );

  return playAnimation;
}
