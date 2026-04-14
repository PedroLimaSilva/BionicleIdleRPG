/**
 * @jest-environment jsdom
 */
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

import { act, useMemo } from 'react';
import { renderHook } from '@testing-library/react';
import { AnimationMixer, Group } from 'three';
import type { AnimationAction } from 'three';
import { usePlayAnimation } from './usePlayAnimation';

describe('usePlayAnimation', () => {
  it('calls onAnimationComplete when the Attack clip is missing so combat can unblock', async () => {
    const onComplete = jest.fn();

    const { result } = renderHook(() => {
      const mixer = useMemo(() => new AnimationMixer(new Group()), []);
      const actions = useMemo<Record<string, AnimationAction | null>>(
        () => ({ Attack: null, Idle: null }),
        []
      );
      return usePlayAnimation(actions, mixer);
    });

    await act(async () => {
      await result.current('Attack', { onAnimationComplete: onComplete });
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
