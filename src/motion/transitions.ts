import type { Transition } from 'motion/react';

export const MOTION_DURATION = {
  quick: 0.16,
  base: 0.22,
  slow: 0.3,
} as const;

export const MOTION_EASING = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const;

export function buildTransition(transition: Transition, reduceMotion: boolean): Transition {
  if (!reduceMotion) {
    return transition;
  }

  return {
    ...transition,
    duration: 0,
  };
}
