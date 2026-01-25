import {
  getProductivityModifier,
  getJobStatus,
  isJobUnlocked,
  getAvailableJobs,
  applyJobExp,
} from './Jobs';
import { MatoranJob, ProductivityEffect } from '../types/Jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { GameState } from '../types/GameState';

describe('Jobs', () => {
  describe('getProductivityModifier', () => {
    const mockFireMatoran: RecruitedCharacterData = {
      id: 'Jala',
      exp: 0,
    };

    const mockIceMatoran: RecruitedCharacterData = {
      id: 'Matoro',
      exp: 0,
    };

    const mockWaterMatoran: RecruitedCharacterData = {
      id: 'Hali',
      exp: 0,
    };

    test('returns 1.2 for favored element (Fire matoran on CharcoalMaker)', () => {
      const modifier = getProductivityModifier(
        MatoranJob.CharcoalMaker,
        mockFireMatoran
      );
      expect(modifier).toBe(1.2);
    });

    test('returns 0.8 for opposed element (Ice matoran on CharcoalMaker)', () => {
      const modifier = getProductivityModifier(
        MatoranJob.CharcoalMaker,
        mockIceMatoran
      );
      expect(modifier).toBe(0.8);
    });

    test('returns 1.0 for neutral element (Water matoran on CharcoalMaker)', () => {
      const modifier = getProductivityModifier(
        MatoranJob.CharcoalMaker,
        mockWaterMatoran
      );
      expect(modifier).toBe(1.0);
    });

    test('returns 1.2 for Water matoran on AlgaeHarvester', () => {
      const modifier = getProductivityModifier(
        MatoranJob.AlgaeHarvester,
        mockWaterMatoran
      );
      expect(modifier).toBe(1.2);
    });

    test('returns 1.2 for Ice matoran on IceSculptor', () => {
      const modifier = getProductivityModifier(
        MatoranJob.IceSculptor,
        mockIceMatoran
      );
      expect(modifier).toBe(1.2);
    });

    test('returns 0.8 for Fire matoran on IceSculptor (opposed)', () => {
      const modifier = getProductivityModifier(
        MatoranJob.IceSculptor,
        mockFireMatoran
      );
      expect(modifier).toBe(0.8);
    });
  });

  describe('getJobStatus', () => {
    test('returns Idle when matoran has no assignment', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 0,
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Idle);
    });

    test('returns Boosted for favored element', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 0,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.2,
          assignedAt: Date.now(),
        },
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Boosted);
    });

    test('returns Penalized for opposed element', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Matoro',
        exp: 0,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 0.8,
          assignedAt: Date.now(),
        },
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Penalized);
    });

    test('returns Neutral for neutral element', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Hali',
        exp: 0,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.0,
          assignedAt: Date.now(),
        },
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Neutral);
    });
  });

  describe('isJobUnlocked', () => {
    const mockGameState: GameState = {
      completedQuests: ['mnog_ga_koro_sos'],
    } as GameState;

    test('returns true for jobs with no requirements', () => {
      expect(isJobUnlocked(MatoranJob.CharcoalMaker, mockGameState)).toBe(true);
    });

    test('returns true when required progress is met', () => {
      expect(isJobUnlocked(MatoranJob.AlgaeHarvester, mockGameState)).toBe(
        true
      );
    });

    test('returns false when required progress is not met', () => {
      expect(isJobUnlocked(MatoranJob.ProtodermisSmelter, mockGameState)).toBe(
        false
      );
    });
  });

  describe('getAvailableJobs', () => {
    test('returns only unlocked jobs', () => {
      const mockGameState = {
        completedQuests: [],
      } as unknown as GameState;

      const available = getAvailableJobs(mockGameState);

      // CharcoalMaker has no requirements
      expect(available).toContain(MatoranJob.CharcoalMaker);
      // ProtodermisSmelter requires 'settle_metru_nui'
      expect(available).not.toContain(MatoranJob.ProtodermisSmelter);
    });

    test('includes jobs when requirements are met', () => {
      const mockGameState: GameState = {
        completedQuests: ['mnog_ga_koro_sos'],
      } as GameState;

      const available = getAvailableJobs(mockGameState);

      // AlgaeHarvester requires 'mnog_ga_koro_sos'
      expect(available).toContain(MatoranJob.AlgaeHarvester);
    });
  });

  describe('applyJobExp', () => {
    test('returns matoran unchanged when no assignment', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 100,
      };

      const [updated, earned, rewards] = applyJobExp(matoran);

      expect(updated).toEqual(matoran);
      expect(earned).toBe(0);
      expect(rewards).toEqual({});
    });

    test('calculates exp earned based on time elapsed', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 10000; // 10 seconds ago

      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 100,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.0,
          assignedAt: tenSecondsAgo,
        },
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(10); // 10 seconds * 1.0 rate
      expect(updated.exp).toBe(110); // 100 + 10
    });

    test('resets assignment timer after applying exp', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 10000;

      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 100,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.0,
          assignedAt: tenSecondsAgo,
        },
      };

      const [updated] = applyJobExp(matoran, now);

      expect(updated.assignment?.assignedAt).toBe(now);
    });

    test('handles fractional exp rates correctly', () => {
      const now = Date.now();
      const fiveSecondsAgo = now - 5000;

      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 0,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.5,
          assignedAt: fiveSecondsAgo,
        },
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(7); // floor(5 * 1.5) = floor(7.5) = 7
      expect(updated.exp).toBe(7);
    });

    test('handles zero elapsed time', () => {
      const now = Date.now();

      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 100,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.0,
          assignedAt: now,
        },
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(0);
      expect(updated.exp).toBe(100);
    });
  });
});

