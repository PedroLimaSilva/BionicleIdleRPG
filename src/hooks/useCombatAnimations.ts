import type { RefObject } from 'react';
import type { AnimationClip, Group } from 'three';
import { useIdleAnimation } from './useIdleAnimation';
import { usePlayAnimation, type UsePlayAnimationOptions } from './usePlayAnimation';

export type UseCombatAnimationsOptions = UsePlayAnimationOptions;

/**
 * Convenience hook that composes useIdleAnimation + usePlayAnimation.
 * Use for combat models (Tahu, Gali, Bohrok, etc.) that need both idle and playAnimation.
 */
export function useCombatAnimations(
  animations: AnimationClip[],
  groupRef: RefObject<Group | null>,
  options: UseCombatAnimationsOptions = {}
) {
  const { actions, mixer } = useIdleAnimation(animations, groupRef);
  const playAnimation = usePlayAnimation(actions, mixer, {
    ...options,
    groupRef,
  });

  return { playAnimation };
}
