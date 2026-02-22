import {
  getProductivityModifier,
  getJobStatus,
  isJobUnlocked,
  getAvailableJobs,
  applyJobExp,
  applyOfflineJobExp,
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
      const modifier = getProductivityModifier(MatoranJob.CharcoalMaker, mockFireMatoran);
      expect(modifier).toBe(1.2);
    });

    test('returns 0.8 for opposed element (Ice matoran on CharcoalMaker)', () => {
      const modifier = getProductivityModifier(MatoranJob.CharcoalMaker, mockIceMatoran);
      expect(modifier).toBe(0.8);
    });

    test('returns 1.0 for neutral element (Water matoran on CharcoalMaker)', () => {
      const modifier = getProductivityModifier(MatoranJob.CharcoalMaker, mockWaterMatoran);
      expect(modifier).toBe(1.0);
    });

    test('returns 1.2 for Water matoran on AlgaeHarvester', () => {
      const modifier = getProductivityModifier(MatoranJob.AlgaeHarvester, mockWaterMatoran);
      expect(modifier).toBe(1.2);
    });

    test('returns 1.2 for Ice matoran on IceSculptor', () => {
      const modifier = getProductivityModifier(MatoranJob.IceSculptor, mockIceMatoran);
      expect(modifier).toBe(1.2);
    });

    test('returns 0.8 for Fire matoran on IceSculptor (opposed)', () => {
      const modifier = getProductivityModifier(MatoranJob.IceSculptor, mockFireMatoran);
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
      expect(isJobUnlocked(MatoranJob.AlgaeHarvester, mockGameState)).toBe(true);
    });

    test('returns false when required progress is not met', () => {
      expect(isJobUnlocked(MatoranJob.ProtodermisSmelter, mockGameState)).toBe(false);
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

    test('filters Koro rebuild jobs to Bohrok only when matoran provided', () => {
      const mockGameState: GameState = {
        completedQuests: ['bohrok_assistants'],
      } as GameState;

      const bohrokMatoran = { id: 'tahnok', exp: 0 } as RecruitedCharacterData;
      const matoranMatoran = { id: 'Jala', exp: 0 } as RecruitedCharacterData;

      const bohrokJobs = getAvailableJobs(mockGameState, bohrokMatoran);
      const matoranJobs = getAvailableJobs(mockGameState, matoranMatoran);

      expect(bohrokJobs).toContain(MatoranJob.TaKoroRebuilder);
      expect(matoranJobs).not.toContain(MatoranJob.TaKoroRebuilder);
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

    test('returns job rewards when matoran has assignment', () => {
      const now = Date.now();
      const matoran: RecruitedCharacterData = {
        id: 'Jala',
        exp: 0,
        assignment: {
          job: MatoranJob.CharcoalMaker,
          expRatePerSecond: 1.0,
          assignedAt: now - 5000,
        },
      };

      const [, , rewards] = applyJobExp(matoran, now);

      // Rewards should be an object (may be empty or have items based on RNG)
      expect(typeof rewards).toBe('object');
    });
  });

  describe('applyOfflineJobExp', () => {
    test('returns empty arrays when no characters', () => {
      const [updated, logs, currencyGain, loot] = applyOfflineJobExp([]);

      expect(updated).toEqual([]);
      expect(logs).toEqual([]);
      expect(currencyGain).toBe(0);
      expect(loot).toEqual({});
    });

    test('processes multiple matoran with jobs', () => {
      const now = Date.now();
      const characters: RecruitedCharacterData[] = [
        {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: 1.0,
            assignedAt: now - 10000, // 10 seconds ago
          },
        },
        {
          id: 'Hali',
          exp: 0,
          assignment: {
            job: MatoranJob.AlgaeHarvester,
            expRatePerSecond: 1.0,
            assignedAt: now - 5000, // 5 seconds ago
          },
        },
      ];

      const [updated, logs, currencyGain] = applyOfflineJobExp(characters);

      expect(updated).toHaveLength(2);
      expect(updated[0].exp).toBeGreaterThan(0);
      expect(updated[1].exp).toBeGreaterThan(0);
      expect(currencyGain).toBeGreaterThan(0);
      expect(logs.length).toBeGreaterThan(0);
    });

    test('aggregates loot from multiple matoran', () => {
      const now = Date.now();
      const characters: RecruitedCharacterData[] = [
        {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: 1.0,
            assignedAt: now - 10000,
          },
        },
      ];

      const [, , , loot] = applyOfflineJobExp(characters);

      // Loot should be an object (may have items based on RNG)
      expect(typeof loot).toBe('object');
    });

    test('generates activity logs for earned exp', () => {
      const now = Date.now();
      const characters: RecruitedCharacterData[] = [
        {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: 1.0,
            assignedAt: now - 10000,
          },
        },
      ];

      const [, logs] = applyOfflineJobExp(characters);

      // Should have at least one log for exp gain
      const expLogs = logs.filter((log) => log.message.includes('gained'));
      expect(expLogs.length).toBeGreaterThan(0);
    });

    test('does not process matoran without jobs', () => {
      const characters: RecruitedCharacterData[] = [
        { id: 'Jala', exp: 100 },
        { id: 'Hali', exp: 50 },
      ];

      const [updated, logs, currencyGain, loot] = applyOfflineJobExp(characters);

      expect(updated[0].exp).toBe(100);
      expect(updated[1].exp).toBe(50);
      expect(logs).toEqual([]);
      expect(currencyGain).toBe(0);
      expect(loot).toEqual({});
    });

    describe('diminishing returns for offline rewards', () => {
      const ratePerSecond = 1.0;
      const msPerHour = 60 * 60 * 1000;

      test('first 12 hours give full rewards', () => {
        const now = 1000000000000; // fixed timestamp for determinism
        const tenHoursAgo = now - 10 * msPerHour;
        const characters: RecruitedCharacterData[] = [
          {
            id: 'Jala',
            exp: 0,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: ratePerSecond,
              assignedAt: tenHoursAgo,
            },
          },
        ];

        const [updated] = applyOfflineJobExp(characters, now);

        // 10 hours = 36000 seconds, full rate → 36000 exp
        expect(updated[0].exp).toBe(36000);
      });

      test('12-18 hours give half rewards for the extra 6h', () => {
        const now = 1000000000000;
        const fifteenHoursAgo = now - 15 * msPerHour;
        const characters: RecruitedCharacterData[] = [
          {
            id: 'Jala',
            exp: 0,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: ratePerSecond,
              assignedAt: fifteenHoursAgo,
            },
          },
        ];

        const [updated] = applyOfflineJobExp(characters, now);

        // 12h full (43200s) + 3h at half (10800 * 0.5 = 5400 effective) = 48600 exp
        expect(updated[0].exp).toBe(48600);
      });

      test('18-24 hours give quarter rewards for the extra 6h', () => {
        const now = 1000000000000;
        const twentyOneHoursAgo = now - 21 * msPerHour;
        const characters: RecruitedCharacterData[] = [
          {
            id: 'Jala',
            exp: 0,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: ratePerSecond,
              assignedAt: twentyOneHoursAgo,
            },
          },
        ];

        const [updated] = applyOfflineJobExp(characters, now);

        // 12h full (43200) + 6h half (21600*0.5=10800) + 3h quarter (10800*0.25=2700) = 56700 exp
        expect(updated[0].exp).toBe(56700);
      });

      test('past 24 hours gives no additional rewards beyond 24h cap', () => {
        const now = 1000000000000;
        const thirtyHoursAgo = now - 30 * msPerHour;
        const characters: RecruitedCharacterData[] = [
          {
            id: 'Jala',
            exp: 0,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: ratePerSecond,
              assignedAt: thirtyHoursAgo,
            },
          },
        ];

        const [updated] = applyOfflineJobExp(characters, now);

        // Capped at 24h: 12h full (43200) + 6h half (10800) + 6h quarter (5400) = 59400 exp
        expect(updated[0].exp).toBe(59400);
      });

      test('online applyJobExp does NOT apply diminishing returns', () => {
        const now = 1000000000000;
        const fifteenHoursAgo = now - 15 * msPerHour;
        const matoran: RecruitedCharacterData = {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: ratePerSecond,
            assignedAt: fifteenHoursAgo,
          },
        };

        // Online tick - no diminishing returns
        const [updated] = applyJobExp(matoran, now);

        // 15 hours = 54000 seconds, full rate
        expect(updated.exp).toBe(54000);
      });
    });
  });
});
