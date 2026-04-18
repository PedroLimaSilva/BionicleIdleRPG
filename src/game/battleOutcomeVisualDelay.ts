/**
 * Shared timing so battle phase (nav + outcome UI) waits for procedural defeat
 * sink/fade and the final camera zoom-out after the last attack emphasis.
 */

export const DEFEAT_SINK_DURATION_SEC = 1.35;

const CAMERA_EMPHASIS_HOLD_MS = 150;
const CAMERA_EMPHASIS_OUT_MS = 380;

export { CAMERA_EMPHASIS_HOLD_MS, CAMERA_EMPHASIS_OUT_MS };

const OUTCOME_VISUAL_CUSHION_SEC = 0.12;

/** Delay before exposing Victory/Defeat phase to UI (ms). */
export function getBattleOutcomePhaseDelayMs(prefersReducedMotion: boolean): number {
  if (prefersReducedMotion) return 0;
  return Math.round(
    (DEFEAT_SINK_DURATION_SEC +
      (CAMERA_EMPHASIS_HOLD_MS + CAMERA_EMPHASIS_OUT_MS) / 1000 +
      OUTCOME_VISUAL_CUSHION_SEC) *
      1000
  );
}
