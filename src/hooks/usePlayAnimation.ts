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
  /** Name of the clip to use as idle (e.g. 'Idle', 'Empty'). Passed to useIdleAnimation for crossfade when changed. */
  idleActionName?: string;
};

export type PlayAnimationCallOptions = {
  /** Called when the animation fully ends (e.g. for Attack, when animation completes, not when promise resolves). */
  onAnimationComplete?: () => void;
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
    actionTimeScale = 1,
    attackResolveAtFraction = 0.5,
    idleActionName = 'Idle',
    modelId,
    transitionMode = 'fadeIdle',
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
    (name: string, callOptions?: PlayAnimationCallOptions): Promise<void> => {
      return new Promise((resolve) => {
        const action = actions[name];
        if (!action) {
          if (modelId) {
            console.warn(`Animation '${name}' not found for ${modelId}`);
          }
          // Outer CombatantModel uses onAnimationComplete for waitForAttackComplete; fire it when
          // there is no clip (and when useCombatAnimations uses procedural motion only) so combat
          // does not hang.
          callOptions?.onAnimationComplete?.();
          resolve();
          return;
        }

        if (transitionMode === 'stopAll') {
          mixer.stopAllAction();
        } else {
          actions[idleActionName]?.fadeOut(0.2);
        }

        // Stop fully deactivates before reset+play - required for clean replay
        action.stop();
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
            hasResolved: false,
            resolve,
            resolveAtTime,
          };

          const onFinished = (e: { action: AnimationAction }) => {
            if (e.action !== action) return;
            mixer.removeEventListener('finished', onFinished);
            const pending = pendingAttackResolve.current;
            if (pending && pending.action === action) {
              pendingAttackResolve.current = null;
              if (!pending.hasResolved) pending.resolve();
            }
            // Must fade out the finished action - otherwise it stays active (clampWhenFinished)
            // and keeps blending its end pose with Idle, causing much less movement on 2nd play
            action.fadeOut(0.2);
            const idle = actions[idleActionName];
            if (idle) {
              idle.reset().fadeIn(0.2).play();
            }
            callOptions?.onAnimationComplete?.();
          };

          mixer.addEventListener('finished', onFinished);
        } else {
          const onComplete = () => {
            mixer.removeEventListener('finished', onComplete);
            resolve();
            if (name === 'Defeat') {
              // Hold the final frame: fade out idle only. Do not stopAllAction — that zeros
              // weights and snaps the skeleton to bind pose before the sink phase.
              actions[idleActionName]?.fadeOut(0);
              actions[idleActionName]?.stop();
              return;
            }
            // Must fade out the finished action - otherwise it stays active (clampWhenFinished)
            // and keeps blending its end pose with Idle, causing much less movement on 2nd play
            action.fadeOut(0.2);
            const idle = actions[idleActionName];
            if (idle) {
              idle.reset().fadeIn(0.2).play();
            }
          };

          mixer.addEventListener('finished', onComplete);
        }
      });
    },
    [
      actions,
      mixer,
      modelId,
      actionTimeScale,
      transitionMode,
      attackResolveAtFraction,
      idleActionName,
    ]
  );

  return playAnimation;
}
