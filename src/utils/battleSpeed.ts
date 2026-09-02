export type BattleSpeedMultiplier = 1 | 2 | 3;

const SPEEDS: BattleSpeedMultiplier[] = [1, 2, 3];

let multiplier: BattleSpeedMultiplier = 1;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function getBattleSpeedMultiplier(): BattleSpeedMultiplier {
  return multiplier;
}

export function setBattleSpeedMultiplier(speed: BattleSpeedMultiplier): void {
  if (multiplier === speed) return;
  multiplier = speed;
  notify();
}

/** Advance 1x → 2x → 3x → 1x. Returns the new multiplier. */
export function cycleBattleSpeed(): BattleSpeedMultiplier {
  const idx = SPEEDS.indexOf(multiplier);
  const next = SPEEDS[(idx + 1) % SPEEDS.length]!;
  setBattleSpeedMultiplier(next);
  return next;
}

export function subscribeBattleSpeed(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Wall-clock duration at higher battle speed (ms). */
export function scaleBattleDurationMs(ms: number): number {
  return ms / multiplier;
}

/** Wall-clock duration at higher battle speed (seconds). */
export function scaleBattleDurationSec(sec: number): number {
  return sec / multiplier;
}

/** Progress [0,1] for a duration that should complete faster at higher battle speed. */
export function battleSpeedProgress(elapsedSec: number, durationSec: number): number {
  return Math.min(1, (elapsedSec * multiplier) / durationSec);
}

export function getEffectiveActionTimeScale(baseScale = 1): number {
  return baseScale * multiplier;
}
