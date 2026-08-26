import { getBattleOutcomePhaseDelayMs } from './battleOutcomeVisualDelay';

describe('getBattleOutcomePhaseDelayMs', () => {
  it('returns 0 when reduced motion is preferred', () => {
    expect(getBattleOutcomePhaseDelayMs(true)).toBe(0);
  });

  it('returns a positive delay when animations run', () => {
    expect(getBattleOutcomePhaseDelayMs(false)).toBeGreaterThan(1000);
  });
});
