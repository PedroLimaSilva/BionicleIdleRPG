import { useEffect, useRef, useState } from 'react';
import { subscribeBattleHitFeedback } from '../../utils/battleHitFeedback';
import { isTestMode } from '../../utils/testMode';

const SHAKE_MS = 400;

/** Subscribes to combat hit feedback: haptics + CSS class for battle-page shake on crit. */
export function useBattlePageHitFeedback(): string {
  const [hitShake, setHitShake] = useState(false);
  const shakeClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = subscribeBattleHitFeedback(({ isCritical, damageDealt }) => {
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (
        damageDealt > 0 &&
        !reduceMotion &&
        !isTestMode() &&
        typeof navigator !== 'undefined' &&
        navigator.vibrate
      ) {
        try {
          navigator.vibrate(50);
        } catch {
          /* ignore unsupported vibrate */
        }
      }

      if (isCritical && !reduceMotion && !isTestMode()) {
        if (shakeClearRef.current) clearTimeout(shakeClearRef.current);
        setHitShake(true);
        shakeClearRef.current = setTimeout(() => {
          setHitShake(false);
          shakeClearRef.current = null;
        }, SHAKE_MS);
      }
    });
    return () => {
      unsub();
      if (shakeClearRef.current) {
        clearTimeout(shakeClearRef.current);
        shakeClearRef.current = null;
      }
    };
  }, []);

  return `battle-page-root${hitShake ? ' battle-page-root--hit-shake' : ''}`;
}
