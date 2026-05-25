import { useCallback, useEffect, type RefObject } from 'react';
import type { AnimationClip, Group } from 'three';
import { useIdleAnimation } from './useIdleAnimation';
import { getBattleSpeedMultiplier, subscribeBattleSpeed } from '../utils/battleSpeed';
import { getAnimationTimeScale } from '../utils/testMode';
import {
  usePlayAnimation,
  type PlayAnimationCallOptions,
  type UsePlayAnimationOptions,
} from './usePlayAnimation';
import { useModelProceduralCombatMotion } from './useModelProceduralCombatMotion';

export type UseCombatAnimationsOptions = UsePlayAnimationOptions;

/**
 * Convenience hook that composes useIdleAnimation + usePlayAnimation.
 * Use for combat models (Tahu, Gali, Bohrok, etc.) that need both idle and playAnimation.
 * When Attack/Hit/Defeat clips are missing from the GLB, applies the same procedural root
 * motion timing as Rahi placeholders (lunge / shake / knockdown).
 */
export function useCombatAnimations(
  animations: AnimationClip[],
  groupRef: RefObject<Group | null>,
  options: UseCombatAnimationsOptions = {}
) {
  const { idleActionName = 'Idle', transitionMode = 'fadeIdle' } = options;

  const { actions, mixer } = useIdleAnimation(animations, groupRef, {
    idleActionName: options.idleActionName,
  });

  useEffect(() => {
    const syncMixerTimeScale = () => {
      mixer.timeScale = getAnimationTimeScale() * getBattleSpeedMultiplier();
    };
    syncMixerTimeScale();
    return subscribeBattleSpeed(syncMixerTimeScale);
  }, [mixer]);

  const basePlay = usePlayAnimation(actions, mixer, options);
  const { playProceduralCombatAnimation } = useModelProceduralCombatMotion(groupRef);

  const playAnimation = useCallback(
    async (name: string, callOptions?: PlayAnimationCallOptions) => {
      const isCombatMotion = name === 'Attack' || name === 'Hit' || name === 'Defeat';
      if (!isCombatMotion) {
        return basePlay(name, callOptions);
      }

      const action = actions[name];
      const hasClip = !!action;

      const fadeOutIdleForProcedural = () => {
        if (transitionMode === 'stopAll') {
          mixer.stopAllAction();
        } else {
          actions[idleActionName]?.fadeOut(0.2);
        }
      };

      if (name === 'Attack') {
        if (hasClip) {
          await basePlay(name, callOptions);
        } else {
          fadeOutIdleForProcedural();
          await playProceduralCombatAnimation('Attack', {
            ...callOptions,
            onAnimationComplete: () => {
              const idle = actions[idleActionName];
              if (idle) {
                idle.reset().fadeIn(0.2).play();
              }
              callOptions?.onAnimationComplete?.();
            },
          });
        }
        return;
      }

      if (hasClip) {
        await basePlay(name, callOptions);
      } else {
        fadeOutIdleForProcedural();
        await playProceduralCombatAnimation(name as 'Hit' | 'Defeat', callOptions);
        if (name === 'Hit') {
          const idle = actions[idleActionName];
          if (idle) {
            idle.reset().fadeIn(0.2).play();
          }
        }
      }
    },
    [actions, basePlay, idleActionName, mixer, playProceduralCombatAnimation, transitionMode]
  );

  return { playAnimation };
}
