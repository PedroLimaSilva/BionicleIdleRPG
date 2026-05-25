import {
  cycleBattleSpeed,
  getBattleSpeedMultiplier,
  scaleBattleDurationMs,
  setBattleSpeedMultiplier,
} from './battleSpeed';

describe('battleSpeed', () => {
  beforeEach(() => {
    setBattleSpeedMultiplier(1);
  });

  it('cycles 1 → 2 → 3 → 1', () => {
    expect(getBattleSpeedMultiplier()).toBe(1);
    expect(cycleBattleSpeed()).toBe(2);
    expect(cycleBattleSpeed()).toBe(3);
    expect(cycleBattleSpeed()).toBe(1);
  });

  it('scales durations inversely with multiplier', () => {
    setBattleSpeedMultiplier(2);
    expect(scaleBattleDurationMs(1000)).toBe(500);
    setBattleSpeedMultiplier(3);
    expect(scaleBattleDurationMs(900)).toBe(300);
  });
});
