import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { scaleBattleDurationMs } from '../../utils/battleSpeed';

/** Fade-out after the 3D scene reports ready; keep in sync with `battle.scss`. */
export const BATTLE_SCENE_REVEAL_MS = 400;

export type BattleSceneMaskState = {
  /** Full-screen mask while combatants mount or a new wave loads. */
  sceneMaskVisible: boolean;
  /** When true, the mask is fading out after `sceneReady` flipped true. */
  sceneMaskRevealing: boolean;
  sceneMaskStyle: CSSProperties | undefined;
};

/**
 * Drives the battle arena blackout while `sceneReady` is false, then a short
 * fade-out once models have mounted (same full-screen cover as wave transitions).
 */
export function useBattleSceneMask(
  sceneReady: boolean,
  shouldReduceMotion: boolean
): BattleSceneMaskState {
  const [sceneMaskRevealing, setSceneMaskRevealing] = useState(false);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (!sceneReady) {
      setSceneMaskRevealing(false);
      return;
    }

    if (shouldReduceMotion) {
      setSceneMaskRevealing(false);
      return;
    }

    setSceneMaskRevealing(true);
    const revealMs = scaleBattleDurationMs(BATTLE_SCENE_REVEAL_MS);
    revealTimerRef.current = setTimeout(() => {
      revealTimerRef.current = null;
      setSceneMaskRevealing(false);
    }, revealMs);

    return () => {
      if (revealTimerRef.current) {
        clearTimeout(revealTimerRef.current);
        revealTimerRef.current = null;
      }
    };
  }, [sceneReady, shouldReduceMotion]);

  const sceneMaskVisible = !sceneReady || sceneMaskRevealing;
  const sceneMaskStyle = sceneMaskRevealing
    ? {
        ['--battle-scene-reveal-ms' as string]: `${scaleBattleDurationMs(BATTLE_SCENE_REVEAL_MS)}ms`,
      }
    : undefined;

  return { sceneMaskRevealing, sceneMaskStyle, sceneMaskVisible };
}
