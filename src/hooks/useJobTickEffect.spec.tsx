/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';
import { MatoranJob } from '../types/Jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { useJobTickEffect } from './useJobTickEffect';

const jobMatoran = (assignedAt: number): RecruitedCharacterData => ({
  assignment: {
    assignedAt,
    expRatePerSecond: 1,
    job: MatoranJob.CharcoalMaker,
  },
  exp: 0,
  id: 'Jala',
});

function useJobTickHarness(paused: boolean) {
  const [recruitedCharacters, setRecruitedCharacters] = useState<RecruitedCharacterData[]>([
    jobMatoran(0),
  ]);
  const [protodermis, setProtodermis] = useState(0);

  useJobTickEffect(
    setRecruitedCharacters,
    (amount) => setProtodermis((prev) => prev + amount),
    paused
  );

  return { protodermis, recruitedCharacters };
}

describe('useJobTickEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('ticks job exp on interval when not paused', () => {
    const { result } = renderHook(() => useJobTickHarness(false));

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.recruitedCharacters[0].exp).toBe(5);
  });

  test('does not tick while paused', () => {
    const { rerender, result } = renderHook(({ paused }) => useJobTickHarness(paused), {
      initialProps: { paused: false },
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    rerender({ paused: true });

    act(() => {
      jest.advanceTimersByTime(20_000);
    });

    // Flush at pause start (2s) only; no further ticks during battle.
    expect(result.current.recruitedCharacters[0].exp).toBe(2);
  });

  test('applies battle elapsed time when resuming after pause', () => {
    const { rerender, result } = renderHook(({ paused }) => useJobTickHarness(paused), {
      initialProps: { paused: false },
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    rerender({ paused: true });

    act(() => {
      jest.setSystemTime(61_000);
      jest.advanceTimersByTime(0);
    });

    rerender({ paused: false });

    // 1s flushed at battle start + 60s battle duration = 61 exp
    expect(result.current.recruitedCharacters[0].exp).toBe(61);
  });
});
