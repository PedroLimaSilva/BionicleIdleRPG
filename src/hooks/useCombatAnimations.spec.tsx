/**
 * @jest-environment jsdom
 */
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn(),
}));

const playProceduralCombatAnimation = jest.fn().mockResolvedValue(undefined);

jest.mock('./useModelProceduralCombatMotion', () => ({
  useModelProceduralCombatMotion: () => ({ playProceduralCombatAnimation }),
}));

jest.mock('./useIdleAnimation', () => ({
  useIdleAnimation: () => ({
    actions: {
      Attack: null,
      Defeat: null,
      Hit: null,
      Idle: null,
    },
    mixer: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      stopAllAction: jest.fn(),
    },
  }),
}));

jest.mock('./usePlayAnimation', () => ({
  usePlayAnimation: () => jest.fn().mockResolvedValue(undefined),
}));

import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { Group } from 'three';
import { useCombatAnimations } from './useCombatAnimations';

describe('useCombatAnimations', () => {
  beforeEach(() => {
    playProceduralCombatAnimation.mockClear();
  });

  it('uses procedural combat motion when GLB clips are missing', async () => {
    const { result } = renderHook(() => {
      const groupRef = useRef<Group | null>(null);
      return useCombatAnimations([], groupRef, { modelId: 'test-toa' });
    });

    await act(async () => {
      await result.current.playAnimation('Attack');
    });

    expect(playProceduralCombatAnimation).toHaveBeenCalledWith(
      'Attack',
      expect.objectContaining({ onAnimationComplete: expect.any(Function) })
    );
  });
});
