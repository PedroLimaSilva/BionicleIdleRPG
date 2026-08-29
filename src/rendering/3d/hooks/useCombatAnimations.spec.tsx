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

const mixer = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  stopAllAction: jest.fn(),
};

let actions: Record<string, unknown> = {};

jest.mock('./useIdleAnimation', () => ({
  useIdleAnimation: () => ({ actions, mixer }),
}));

jest.mock('./usePlayAnimation', () => ({
  usePlayAnimation: () => jest.fn().mockResolvedValue(undefined),
}));

import { act, renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { Group } from 'three';
import { useCombatAnimations } from './useCombatAnimations';

type FakeAction = {
  fadeIn: jest.Mock;
  fadeOut: jest.Mock;
  play: jest.Mock;
  reset: jest.Mock;
};

function fakeIdleAction(): FakeAction {
  const action: FakeAction = {
    fadeIn: jest.fn(),
    fadeOut: jest.fn(),
    play: jest.fn(),
    reset: jest.fn(),
  };
  action.fadeIn.mockReturnValue(action);
  action.reset.mockReturnValue(action);
  return action;
}

function renderCombatAnimations() {
  return renderHook(() => {
    const groupRef = useRef<Group | null>(null);
    return useCombatAnimations([], groupRef, { modelId: 'test-toa' });
  });
}

describe('useCombatAnimations', () => {
  beforeEach(() => {
    playProceduralCombatAnimation.mockClear();
    actions = { Attack: null, Defeat: null, Hit: null, Idle: null };
  });

  it('uses procedural combat motion when GLB clips are missing', async () => {
    const { result } = renderCombatAnimations();

    await act(async () => {
      await result.current.playAnimation('Attack');
    });

    expect(playProceduralCombatAnimation).toHaveBeenCalledWith(
      'Attack',
      expect.objectContaining({ onAnimationComplete: expect.any(Function) })
    );
  });

  // Toa Lhikan ships an Idle clip but no Attack/Hit/Defeat, so the skeletal idle
  // has to yield to the procedural root motion and then come back afterwards.
  describe('rig with an idle clip but no combat clips', () => {
    let idle: FakeAction;

    beforeEach(() => {
      idle = fakeIdleAction();
      actions = { Attack: null, Defeat: null, Hit: null, Idle: idle };
    });

    it('fades the idle out for a procedural Attack and restores it on completion', async () => {
      const { result } = renderCombatAnimations();

      await act(async () => {
        await result.current.playAnimation('Attack');
      });

      expect(idle.fadeOut).toHaveBeenCalledWith(0.2);
      expect(idle.play).not.toHaveBeenCalled();

      const [, callOptions] = playProceduralCombatAnimation.mock.calls[0];
      act(() => callOptions.onAnimationComplete());

      expect(idle.reset).toHaveBeenCalled();
      expect(idle.play).toHaveBeenCalled();
    });

    it('restores the idle after a procedural Hit', async () => {
      const { result } = renderCombatAnimations();

      await act(async () => {
        await result.current.playAnimation('Hit');
      });

      expect(idle.fadeOut).toHaveBeenCalledWith(0.2);
      expect(idle.play).toHaveBeenCalled();
    });

    it('leaves the idle stopped after a procedural Defeat so the knockdown holds', async () => {
      const { result } = renderCombatAnimations();

      await act(async () => {
        await result.current.playAnimation('Defeat');
      });

      expect(idle.fadeOut).toHaveBeenCalledWith(0.2);
      expect(idle.play).not.toHaveBeenCalled();
    });
  });
});
