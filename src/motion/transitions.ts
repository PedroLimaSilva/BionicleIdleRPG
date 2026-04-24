import type { Transition } from 'motion/react';

export const MOTION_DURATION = {
  base: 0.3,
  quick: 0.16,
  slow: 0.5,
  verySlow: 1.0,
} as const;

export const MOTION_EASING = {
  emphasized: [0.16, 1, 0.3, 1],
  standard: [0.22, 1, 0.36, 1],
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
