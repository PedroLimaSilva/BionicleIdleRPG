/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { AutoActivateButton, BATTLE_AUTO_ACTIVATE_MS } from './index';

jest.mock('../../utils/testMode', () => ({
  isTestMode: () => false,
}));

jest.mock('./index.scss', () => ({}));

describe('AutoActivateButton', () => {
  let now = 0;
  let rafId = 0;
  const rafCallbacks = new Map<number, FrameRequestCallback>();

  beforeEach(() => {
    now = 0;
    rafId = 0;
    rafCallbacks.clear();
    jest.spyOn(performance, 'now').mockImplementation(() => now);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafId += 1;
      rafCallbacks.set(rafId, cb);
      return rafId;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const runFramesUntil = (targetMs: number, stepMs = 50) => {
    while (now < targetMs) {
      now = Math.min(targetMs, now + stepMs);
      const callbacks = [...rafCallbacks.values()];
      rafCallbacks.clear();
      act(() => {
        callbacks.forEach((cb) => cb(now));
      });
    }
  };

  test('auto-clicks after the configured duration', () => {
    const onClick = jest.fn();
    render(
      <AutoActivateButton durationMs={1000} onClick={onClick}>
        Run Round
      </AutoActivateButton>
    );

    runFramesUntil(999);
    expect(onClick).not.toHaveBeenCalled();

    runFramesUntil(1000);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('shrinks the fill overlay horizontally over time', () => {
    render(
      <AutoActivateButton durationMs={1000} onClick={() => undefined}>
        Run Round
      </AutoActivateButton>
    );

    const fill = screen
      .getByText('Run Round')
      .parentElement?.querySelector('.auto-activate-button__fill') as HTMLElement;

    runFramesUntil(0);
    expect(fill.style.transform).toBe('scaleX(1)');

    runFramesUntil(500);
    expect(fill.style.transform).toBe('scaleX(0.5)');

    runFramesUntil(1000);
    expect(fill.style.transform).toBe('scaleX(0)');
  });

  test('restarts countdown when resetToken changes', () => {
    const onClick = jest.fn();
    const { rerender } = render(
      <AutoActivateButton durationMs={1000} resetToken={0} onClick={onClick}>
        Run Round
      </AutoActivateButton>
    );

    runFramesUntil(800);
    rerender(
      <AutoActivateButton durationMs={1000} resetToken={1} onClick={onClick}>
        Run Round
      </AutoActivateButton>
    );

    runFramesUntil(900);
    expect(onClick).not.toHaveBeenCalled();

    runFramesUntil(1800);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not auto-click while disabled', () => {
    const onClick = jest.fn();
    render(
      <AutoActivateButton disabled durationMs={1000} onClick={onClick}>
        Run Round
      </AutoActivateButton>
    );

    runFramesUntil(2000);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('manual click still works immediately', () => {
    const onClick = jest.fn();
    render(
      <AutoActivateButton durationMs={BATTLE_AUTO_ACTIVATE_MS} onClick={onClick}>
        Run Round
      </AutoActivateButton>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run Round' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
