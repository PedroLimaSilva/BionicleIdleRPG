import { getLevelFromExp, getExpProgress } from './Levelling';

describe('Levelling', () => {
  describe('getLevelFromExp', () => {
    test('returns level 1 for 0 exp', () => {
      expect(getLevelFromExp(0)).toBe(1);
    });

    test('returns level 1 for exp below level 2 threshold', () => {
      expect(getLevelFromExp(50)).toBe(1);
      expect(getLevelFromExp(99)).toBe(1);
    });

    test('returns level 2 at exactly 100 exp', () => {
      // expForLevel(2) = 100 * (2-1)^1.5 = 100
      expect(getLevelFromExp(100)).toBe(2);
    });

    test('returns level 3 at 282 exp', () => {
      // expForLevel(3) = 100 * (3-1)^1.5 = 100 * 2^1.5 ≈ 282.84
      expect(getLevelFromExp(282)).toBe(3);
    });

    test('returns level 5 at 800 exp', () => {
      // expForLevel(5) = 100 * (5-1)^1.5 = 100 * 4^1.5 = 800
      expect(getLevelFromExp(800)).toBe(5);
    });

    test('returns level 10 at 2700 exp', () => {
      // expForLevel(10) = 100 * (10-1)^1.5 = 100 * 9^1.5 = 2700
      expect(getLevelFromExp(2700)).toBe(10);
    });

    test('handles large exp values', () => {
      expect(getLevelFromExp(10000)).toBeGreaterThan(20);
    });

    test('handles negative exp as level 1', () => {
      expect(getLevelFromExp(-100)).toBe(1);
    });
  });

  describe('getExpProgress', () => {
    test('returns correct progress at level 1 with 0 exp', () => {
      const result = getExpProgress(0);
      expect(result.level).toBe(1);
      expect(result.currentLevelExp).toBe(0);
      expect(result.expForNextLevel).toBe(100); // 100 - 0
      expect(result.progress).toBe(0);
    });

    test('returns correct progress at level 1 with 50 exp', () => {
      const result = getExpProgress(50);
      expect(result.level).toBe(1);
      expect(result.currentLevelExp).toBe(50);
      expect(result.expForNextLevel).toBe(100);
      expect(result.progress).toBe(0.5);
    });

    test('returns correct progress at exactly level 2', () => {
      const result = getExpProgress(100);
      expect(result.level).toBe(2);
      expect(result.currentLevelExp).toBe(0);
      expect(result.progress).toBe(0);
    });

    test('returns correct progress halfway through level 2', () => {
      // Level 2 starts at 100, level 3 starts at ~282
      // Halfway would be around 191
      const result = getExpProgress(191);
      expect(result.level).toBe(2);
      expect(result.currentLevelExp).toBe(91);
      expect(result.progress).toBeCloseTo(0.5, 1);
    });

    test('returns progress between 0 and 1', () => {
      const testValues = [0, 50, 100, 150, 500, 1000, 5000];
      testValues.forEach((exp) => {
        const result = getExpProgress(exp);
        expect(result.progress).toBeGreaterThanOrEqual(0);
        expect(result.progress).toBeLessThan(1);
      });
    });

    test('currentLevelExp is always less than expForNextLevel', () => {
      const testValues = [0, 50, 100, 150, 500, 1000, 5000];
      testValues.forEach((exp) => {
        const result = getExpProgress(exp);
        expect(result.currentLevelExp).toBeLessThan(result.expForNextLevel);
      });
    });

    test('expForNextLevel increases with level', () => {
      const level1 = getExpProgress(0);
      const level2 = getExpProgress(100);
      const level5 = getExpProgress(800);
      
      expect(level2.expForNextLevel).toBeGreaterThan(level1.expForNextLevel);
      expect(level5.expForNextLevel).toBeGreaterThan(level2.expForNextLevel);
    });
  });
});

