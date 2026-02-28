import { useState, useEffect, useRef, useCallback } from 'react';
import { isTestMode } from '../../utils/testMode';

const DEFAULT_SPEED_MS = 30;

type UseTypewriterOptions = {
  /** Milliseconds per character. Default 30. */
  speed?: number;
};

/**
 * Hook that reveals text character-by-character (typewriter effect).
 * Returns displayed text, completion state, and a skip function to reveal all instantly.
 * Skips the effect in test mode to avoid flaky E2E screenshots.
 */
export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const { speed = DEFAULT_SPEED_MS } = options;
  const [displayedLength, setDisplayedLength] = useState(() =>
    isTestMode() && text.length > 0 ? text.length : 0
  );
  const [isComplete, setIsComplete] = useState(() =>
    isTestMode() && text.length > 0
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const skip = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedLength(text.length);
    setIsComplete(true);
  }, [text.length]);

  useEffect(() => {
    if (text.length === 0) {
      setIsComplete(true);
      return;
    }

    if (isTestMode()) {
      setDisplayedLength(text.length);
      setIsComplete(true);
      return;
    }

    setDisplayedLength(0);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed]);

  return {
    displayedText: text.slice(0, displayedLength),
    isComplete,
    skip,
  };
}
