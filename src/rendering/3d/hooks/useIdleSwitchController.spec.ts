/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import type { AnimationAction, AnimationMixer } from 'three';
import { LoopOnce, LoopRepeat } from 'three';
import { useIdleSwitchController } from './useIdleSwitchController';
import type { IdleSwitchConfig } from './idleSwitchTypes';

const mockInteractionEpoch = jest.fn(() => 0);

jest.mock('../modelInteractionState', () => ({
  useModelInteractionEpoch: () => mockInteractionEpoch(),
}));

jest.mock('../../../utils/testMode', () => ({
  shouldDisableAnimations: () => false,
}));

function fakeAction(overrides: Partial<AnimationAction> = {}): AnimationAction {
  const action = {
    clampWhenFinished: false,
    crossFadeTo: jest.fn(),
    fadeOut: jest.fn(),
    isRunning: jest.fn().mockReturnValue(false),
    play: jest.fn(),
    reset: jest.fn().mockReturnThis(),
    setEffectiveWeight: jest.fn(),
    setLoop: jest.fn(),
    stop: jest.fn(),
    ...overrides,
  };
  return action as unknown as AnimationAction;
}

describe('useIdleSwitchController', () => {
  let mixer: AnimationMixer;
  let addEventListener: jest.Mock;
  let removeEventListener: jest.Mock;

  beforeEach(() => {
    mockInteractionEpoch.mockReturnValue(0);
    addEventListener = jest.fn();
    removeEventListener = jest.fn();
    mixer = {
      addEventListener,
      removeEventListener,
    } as unknown as AnimationMixer;
  });

  it('returns the default idle clip from config', () => {
    const config: IdleSwitchConfig = {
      idles: [{ clip: 'Idle A' }, { clip: 'Idle B' }],
    };
    const actions = {
      'Idle A': fakeAction(),
      'Idle B': fakeAction(),
    };

    const { result } = renderHook(() => useIdleSwitchController(actions, mixer, { config }));

    expect(result.current).toBe('Idle A');
  });

  it('crossfades to the next idle when no transition clip is configured', () => {
    const config: IdleSwitchConfig = {
      cooldownMs: 0,
      idles: [{ clip: 'Idle A' }, { clip: 'Idle B' }],
    };
    const actions = {
      'Idle A': fakeAction(),
      'Idle B': fakeAction(),
    };

    const { rerender, result } = renderHook(() =>
      useIdleSwitchController(actions, mixer, { config })
    );

    mockInteractionEpoch.mockReturnValue(1);
    rerender();

    expect(result.current).toBe('Idle B');
  });

  it('plays a one-shot transition clip before switching idles', () => {
    const transition = fakeAction();
    const toIdle = fakeAction({ isRunning: jest.fn().mockReturnValue(true) });
    const config: IdleSwitchConfig = {
      cooldownMs: 0,
      idles: [{ clip: 'Idle Biped' }, { clip: 'Idle Quadruped' }],
      transitions: {
        'Idle Biped->Idle Quadruped': 'Biped To Quadruped',
      },
    };
    const actions = {
      'Biped To Quadruped': transition,
      'Idle Biped': fakeAction(),
      'Idle Quadruped': toIdle,
    };

    const { rerender, result } = renderHook(() =>
      useIdleSwitchController(actions, mixer, { config })
    );

    mockInteractionEpoch.mockReturnValue(1);
    rerender();

    expect(result.current).toBe('Idle Biped');
    expect(transition.play).toHaveBeenCalled();
    expect(transition.setLoop).toHaveBeenCalledWith(LoopOnce, 1);

    const finishedHandler = addEventListener.mock.calls[0][1] as (event: {
      action: AnimationAction;
    }) => void;

    act(() => {
      finishedHandler({ action: transition });
    });

    expect(transition.crossFadeTo).toHaveBeenCalledWith(toIdle, 0.3, false);
    expect(toIdle.setLoop).toHaveBeenCalledWith(LoopRepeat, Infinity);
    expect(result.current).toBe('Idle Quadruped');
  });

  it('respects cooldown between interactions', () => {
    const nowSpy = jest.spyOn(performance, 'now');
    nowSpy.mockReturnValue(1000);

    const config: IdleSwitchConfig = {
      cooldownMs: 500,
      idles: [{ clip: 'Idle A' }, { clip: 'Idle B' }, { clip: 'Idle C' }],
    };
    const actions = {
      'Idle A': fakeAction(),
      'Idle B': fakeAction(),
      'Idle C': fakeAction(),
    };

    const { rerender, result } = renderHook(() =>
      useIdleSwitchController(actions, mixer, { config })
    );

    mockInteractionEpoch.mockReturnValue(1);
    rerender();
    expect(result.current).toBe('Idle B');

    nowSpy.mockReturnValue(1200);
    mockInteractionEpoch.mockReturnValue(2);
    rerender();
    expect(result.current).toBe('Idle B');

    nowSpy.mockRestore();
  });

  it('defaults to a 5 second cooldown when cooldownMs is omitted', () => {
    const nowSpy = jest.spyOn(performance, 'now');
    nowSpy.mockReturnValue(1000);

    const config: IdleSwitchConfig = {
      idles: [{ clip: 'Idle A' }, { clip: 'Idle B' }],
    };
    const actions = {
      'Idle A': fakeAction(),
      'Idle B': fakeAction(),
    };

    const { rerender, result } = renderHook(() =>
      useIdleSwitchController(actions, mixer, { config })
    );

    mockInteractionEpoch.mockReturnValue(1);
    rerender();
    expect(result.current).toBe('Idle B');

    nowSpy.mockReturnValue(5000);
    mockInteractionEpoch.mockReturnValue(2);
    rerender();
    expect(result.current).toBe('Idle B');

    nowSpy.mockReturnValue(6000);
    mockInteractionEpoch.mockReturnValue(3);
    rerender();
    expect(result.current).toBe('Idle A');

    nowSpy.mockRestore();
  });
});
