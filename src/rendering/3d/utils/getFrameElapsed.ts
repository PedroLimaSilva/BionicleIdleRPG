import type { RootState } from '@react-three/fiber';

/** Elapsed scene time in seconds from the R3F frame loop. */
export function getFrameElapsed(state: RootState): number {
  if (state.timer) {
    return state.timer.getElapsed();
  }
  return state.clock.elapsedTime;
}
