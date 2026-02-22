import type { RefObject } from 'react';
import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { AnimationAction, AnimationMixer, Group, SkinnedMesh } from 'three';
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
  /** Ref to the model group - used to reset skeleton to bind pose before replay (fixes baked quaternion animations playing with less movement on 2nd run) */
  groupRef?: RefObject<Group | null>;
};

export type PlayAnimationCallOptions = {
  /** Called when the animation fully ends (e.g. for Attack, when animation completes, not when promise resolves). */
  onAnimationComplete?: () => void;
};

/**
 * Resets all skeletons in the model to their bind pose.
 * Required before replaying animations when using baked quaternion bone rotations from Blender:
 * without this, bones retain state from the previous play and the second run shows much less movement.
 * @see https://github.com/mrdoob/three.js/issues/24772
 */
function resetSkeletonToBindPose(root: Group): void {
  root.updateMatrixWorld(true);
  root.traverse((object) => {
    if ((object as SkinnedMesh).isSkinnedMesh) {
      (object as SkinnedMesh).skeleton.pose();
    }
  });
}

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
    groupRef,
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
          return resolve();
        }

        if (transitionMode === 'stopAll') {
          mixer.stopAllAction();
        } else {
          actions['Idle']?.fadeOut(0.2);
        }

        // Reset skeleton to bind pose before replay. Fixes baked quaternion animations
        // from Blender playing with much less movement on the second run (bones retain
        // state from previous play otherwise).
        const root = groupRef?.current;
        if (root) {
          resetSkeletonToBindPose(root);
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
            // Must fade out the finished action - otherwise it stays active (clampWhenFinished)
            // and keeps blending its end pose with Idle, causing much less movement on 2nd play
            action.fadeOut(0.2);
            const idle = actions['Idle'];
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
            if (name === 'Defeat') return;
            // Must fade out the finished action - otherwise it stays active (clampWhenFinished)
            // and keeps blending its end pose with Idle, causing much less movement on 2nd play
            action.fadeOut(0.2);
            const idle = actions['Idle'];
            if (idle) {
              idle.reset().fadeIn(0.2).play();
            }
          };

          mixer.addEventListener('finished', onComplete);
        }
      });
    },
    [actions, mixer, modelId, actionTimeScale, transitionMode, attackResolveAtFraction, groupRef]
  );

  return playAnimation;
}
