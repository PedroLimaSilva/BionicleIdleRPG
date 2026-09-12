import type { RootState } from '@react-three/fiber';
import { getFrameElapsed } from './getFrameElapsed';

describe('getFrameElapsed', () => {
  it('uses timer.getElapsed when the patched fiber store exposes timer', () => {
    const state = {
      timer: { getElapsed: () => 1.25 },
      clock: { elapsedTime: 999 },
    } as unknown as RootState;

    expect(getFrameElapsed(state)).toBe(1.25);
  });

  it('falls back to clock.elapsedTime when timer is missing', () => {
    const state = {
      clock: { elapsedTime: 2.5 },
    } as unknown as RootState;

    expect(getFrameElapsed(state)).toBe(2.5);
  });
});
