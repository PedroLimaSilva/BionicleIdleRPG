import { useEffect, useRef } from 'react';
import { RecruitedCharacterData } from '../types/Matoran';
import { tickRecruitedCharactersJobExp } from '../services/jobUtils';

export function useJobTickEffect(
  setRecruitedCharacters: (
    fn: (prev: RecruitedCharacterData[]) => RecruitedCharacterData[]
  ) => void,
  addProtodermis: (amount: number) => void,
  /** When true (e.g. during battle), interval ticks stop; elapsed time is applied on resume. */
  paused: boolean,
  intervalMs: number = 5000
) {
  const setRecruitedCharactersRef = useRef(setRecruitedCharacters);
  const addProtodermisRef = useRef(addProtodermis);
  setRecruitedCharactersRef.current = setRecruitedCharacters;
  addProtodermisRef.current = addProtodermis;

  const pauseStartedAtRef = useRef<number | null>(null);
  const wasPausedRef = useRef<boolean | null>(null);

  useEffect(() => {
    const wasPaused = wasPausedRef.current;
    wasPausedRef.current = paused;

    if (wasPaused === null) {
      return;
    }

    if (!wasPaused && paused) {
      const pauseStartedAt = Date.now();
      pauseStartedAtRef.current = pauseStartedAt;

      // Flush the partial interval since the last tick so battle-start time is not lost.
      setRecruitedCharactersRef.current((prev) => {
        const { protodermisGain, updated } = tickRecruitedCharactersJobExp(prev, pauseStartedAt);
        if (protodermisGain > 0) {
          addProtodermisRef.current(protodermisGain);
        }
        return updated;
      });
    } else if (wasPaused && !paused) {
      if (pauseStartedAtRef.current === null) return;
      pauseStartedAtRef.current = null;

      const now = Date.now();

      // assignedAt was reset to battle start on pause; applyJobExp(now) covers battle elapsed.
      setRecruitedCharactersRef.current((prev) => {
        const { protodermisGain, updated } = tickRecruitedCharactersJobExp(prev, now);
        if (protodermisGain > 0) {
          addProtodermisRef.current(protodermisGain);
        }
        return updated;
      });
    }
  }, [paused]);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      const now = Date.now();

      setRecruitedCharactersRef.current((prev) => {
        const { protodermisGain, updated } = tickRecruitedCharactersJobExp(prev, now);
        if (protodermisGain > 0) {
          addProtodermisRef.current(protodermisGain);
        }
        return updated;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [paused, intervalMs]);
}
