import type { RootState } from '@react-three/fiber';

/** Elapsed scene time in seconds from the R3F frame timer. */
export function getFrameElapsed(state: RootState): number {
  return state.timer.getElapsed();
}
