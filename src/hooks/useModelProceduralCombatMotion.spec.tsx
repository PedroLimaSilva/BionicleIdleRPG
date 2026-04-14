/**
 * @jest-environment jsdom
 */
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { Group } from 'three';
import { useModelProceduralCombatMotion } from './useModelProceduralCombatMotion';

describe('useModelProceduralCombatMotion', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fires onAnimationComplete after procedural Attack total duration', async () => {
    const rootRef = { current: new Group() };
    const onComplete = jest.fn();

    const { result } = renderHook(() => useModelProceduralCombatMotion(rootRef));

    let attackPromise: Promise<void>;
    await act(async () => {
      attackPromise = result.current.playProceduralCombatAnimation('Attack', {
        onAnimationComplete: onComplete,
      });
    });

    expect(onComplete).not.toHaveBeenCalled();

    // Contact delay, then full-attack timer before onAnimationComplete.
    await act(async () => {
      await jest.advanceTimersByTimeAsync(140 + 420);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);

    await act(async () => {
      await attackPromise!;
    });
  });
});
