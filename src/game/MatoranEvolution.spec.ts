import {
  canEvolveMatoranToRebuilt,
  evolveCharacter,
  evolveMatoranToRebuilt,
  MATORAN_REBUILT_LEVEL,
} from './MatoranEvolution';
import { getLevelFromExp } from './Levelling';
import { RecruitedCharacterData } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';

// expForLevel(51) ≈ 35355, so 35000 is safely level 50
const expFor50 = 35000;

describe('MatoranEvolution', () => {
  const completedWithNamingDay = ['bohrok_kal_naming_day'];
  const completedWithoutNamingDay: string[] = [];

  describe('canEvolveMatoranToRebuilt', () => {
    test('returns false when Naming Day not complete', () => {
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: expFor50 };
      expect(
        canEvolveMatoranToRebuilt(matoran, completedWithoutNamingDay)
      ).toBe(false);
    });

    test('returns false when diminished matoran below level 50', () => {
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: 1000 };
      expect(canEvolveMatoranToRebuilt(matoran, completedWithNamingDay)).toBe(
        false
      );
    });

    test('returns true when diminished matoran at level 50+ and Naming Day complete', () => {
      expect(getLevelFromExp(expFor50)).toBeGreaterThanOrEqual(
        MATORAN_REBUILT_LEVEL
      );
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: expFor50 };
      expect(canEvolveMatoranToRebuilt(matoran, completedWithNamingDay)).toBe(
        true
      );
    });

    test('returns false for already Rebuilt matoran (stage override)', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Kapura',
        exp: expFor50,
        stage: MatoranStage.Rebuilt,
      };
      expect(canEvolveMatoranToRebuilt(matoran, completedWithNamingDay)).toBe(
        false
      );
    });

    test('returns false for non-upgradeable matoran', () => {
      const matoran: RecruitedCharacterData = { id: 'Toa_Tahu', exp: expFor50 };
      expect(canEvolveMatoranToRebuilt(matoran, completedWithNamingDay)).toBe(
        false
      );
    });
  });

  describe('evolveCharacter', () => {
    test('applies evolutionMap (ID change)', () => {
      const matoran: RecruitedCharacterData = { id: 'Jala', exp: 100 };
      const result = evolveCharacter(matoran, {
        evolutionMap: { Jala: 'Jaller' },
        stageOverride: MatoranStage.Rebuilt,
      });
      expect(result.id).toBe('Jaller');
      expect(result.exp).toBe(100);
    });

    test('applies stageOverride when no evolutionMap entry', () => {
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: 100 };
      const result = evolveCharacter(matoran, {
        evolutionMap: { Jala: 'Jaller' },
        stageOverride: MatoranStage.Rebuilt,
      });
      expect(result.id).toBe('Kapura');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
    });

    test('returns matoran unchanged when config has no applicable rules', () => {
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: 100 };
      const result = evolveCharacter(matoran, {});
      expect(result).toEqual(matoran);
    });
  });

  describe('evolveMatoranToRebuilt', () => {
    test('evolves Jala to Jaller (ID change)', () => {
      const matoran: RecruitedCharacterData = { id: 'Jala', exp: expFor50 };
      const result = evolveMatoranToRebuilt(matoran);

      expect(result.id).toBe('Jaller');
      expect(result.exp).toBe(expFor50);
    });

    test('evolves Maku to Macku (ID change)', () => {
      const matoran: RecruitedCharacterData = { id: 'Maku', exp: expFor50 };
      const result = evolveMatoranToRebuilt(matoran);

      expect(result.id).toBe('Macku');
      expect(result.exp).toBe(expFor50);
    });

    test('evolves Huki to Hewkii (ID change)', () => {
      const matoran: RecruitedCharacterData = { id: 'Huki', exp: expFor50 };
      const result = evolveMatoranToRebuilt(matoran);

      expect(result.id).toBe('Hewkii');
      expect(result.exp).toBe(expFor50);
    });

    test('adds stage override for Kapura (same ID)', () => {
      const matoran: RecruitedCharacterData = { id: 'Kapura', exp: expFor50 };
      const result = evolveMatoranToRebuilt(matoran);

      expect(result.id).toBe('Kapura');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
      expect(result.exp).toBe(expFor50);
    });

    test('adds stage override for Takua (same ID)', () => {
      const matoran: RecruitedCharacterData = { id: 'Takua', exp: expFor50 };
      const result = evolveMatoranToRebuilt(matoran);

      expect(result.id).toBe('Takua');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
    });
  });
});
