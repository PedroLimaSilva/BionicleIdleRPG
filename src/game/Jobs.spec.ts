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
      exp: 0,
      id: 'Jala',
    };

    const mockIceMatoran: RecruitedCharacterData = {
      exp: 0,
      id: 'Matoro',
    };

    const mockWaterMatoran: RecruitedCharacterData = {
      exp: 0,
      id: 'Hahli',
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

    test('returns 1.2 for Ice matoran on SanctumGuard', () => {
      const modifier = getProductivityModifier(MatoranJob.SanctumGuard, mockIceMatoran);
      expect(modifier).toBe(1.2);
    });

    test('returns 0.8 for Fire matoran on SanctumGuard (opposed)', () => {
      const modifier = getProductivityModifier(MatoranJob.SanctumGuard, mockFireMatoran);
      expect(modifier).toBe(0.8);
    });
  });

  describe('getJobStatus', () => {
    test('returns Idle when matoran has no assignment', () => {
      const matoran: RecruitedCharacterData = {
        exp: 0,
        id: 'Jala',
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Idle);
    });

    test('returns Boosted for favored element', () => {
      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: Date.now(),
          expRatePerSecond: 1.2,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 0,
        id: 'Jala',
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Boosted);
    });

    test('returns Penalized for opposed element', () => {
      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: Date.now(),
          expRatePerSecond: 0.8,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 0,
        id: 'Matoro',
      };
      expect(getJobStatus(matoran)).toBe(ProductivityEffect.Penalized);
    });

    test('returns Neutral for neutral element', () => {
      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: Date.now(),
          expRatePerSecond: 1.0,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 0,
        id: 'Hahli',
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

      const bohrokMatoran = { exp: 0, id: 'tahnok' } as RecruitedCharacterData;
      const matoranMatoran = { exp: 0, id: 'Jala' } as RecruitedCharacterData;

      const bohrokJobs = getAvailableJobs(mockGameState, bohrokMatoran);
      const matoranJobs = getAvailableJobs(mockGameState, matoranMatoran);

      expect(bohrokJobs).toContain(MatoranJob.TaKoroRebuilder);
      expect(matoranJobs).not.toContain(MatoranJob.TaKoroRebuilder);
    });

    test('Bohrok only see reconstruction jobs, not other jobs', () => {
      const mockGameState: GameState = {
        completedQuests: ['bohrok_assistants'],
      } as GameState;

      const bohrokMatoran = { exp: 0, id: 'tahnok' } as RecruitedCharacterData;
      const bohrokJobs = getAvailableJobs(mockGameState, bohrokMatoran);

      expect(bohrokJobs).toContain(MatoranJob.TaKoroRebuilder);
      expect(bohrokJobs).toContain(MatoranJob.GaKoroRebuilder);
      expect(bohrokJobs).not.toContain(MatoranJob.CharcoalMaker);
      expect(bohrokJobs).not.toContain(MatoranJob.AlgaeHarvester);
      expect(bohrokJobs).not.toContain(MatoranJob.StoneMason);
    });

    test('Metru Matoran only see their canonical profession when unlocked', () => {
      const mockGameState: GameState = {
        completedQuests: ['settle_metru_nui'],
      } as GameState;

      const vakama = { exp: 0, id: 'Vakama' } as RecruitedCharacterData;
      const nokama = { exp: 0, id: 'Nokama' } as RecruitedCharacterData;
      const matau = { exp: 0, id: 'Matau' } as RecruitedCharacterData;

      expect(getAvailableJobs(mockGameState, vakama)).toEqual([MatoranJob.MaskMaker]);
      expect(getAvailableJobs(mockGameState, nokama)).toEqual([MatoranJob.Teacher]);
      expect(getAvailableJobs(mockGameState, matau)).toEqual([MatoranJob.ChuteController]);
    });

    test('Metru Matoran with district-specific unlocks only see profession when quest met', () => {
      const settledOnly: GameState = {
        completedQuests: ['settle_metru_nui'],
      } as GameState;
      const withTowers: GameState = {
        completedQuests: ['settle_metru_nui', 'activate_knowledge_towers'],
      } as GameState;
      const withArchives: GameState = {
        completedQuests: ['settle_metru_nui', 'unlock_archives'],
      } as GameState;

      const nuju = { exp: 0, id: 'Nuju' } as RecruitedCharacterData;
      const whenua = { exp: 0, id: 'Whenua' } as RecruitedCharacterData;

      expect(getAvailableJobs(settledOnly, nuju)).toEqual([]);
      expect(getAvailableJobs(withTowers, nuju)).toEqual([MatoranJob.KnowledgeScribe]);
      expect(getAvailableJobs(settledOnly, whenua)).toEqual([]);
      expect(getAvailableJobs(withArchives, whenua)).toEqual([MatoranJob.StasisTechnician]);
    });

    test('Metru Matoran do not see Mata Nui jobs even when unlocked', () => {
      const mockGameState: GameState = {
        completedQuests: ['settle_metru_nui', 'mnog_ga_koro_sos'],
      } as GameState;

      const vakama = { exp: 0, id: 'Vakama' } as RecruitedCharacterData;
      const jobs = getAvailableJobs(mockGameState, vakama);

      expect(jobs).not.toContain(MatoranJob.CharcoalMaker);
      expect(jobs).not.toContain(MatoranJob.AlgaeHarvester);
    });

    test('Metru Matoran do not see Metru jobs without an allowedCharacters entry', () => {
      const mockGameState: GameState = {
        completedQuests: ['settle_metru_nui'],
      } as GameState;

      const vakama = { exp: 0, id: 'Vakama' } as RecruitedCharacterData;
      const jobs = getAvailableJobs(mockGameState, vakama);

      expect(jobs).not.toContain(MatoranJob.HydroTechnician);
      expect(jobs).not.toContain(MatoranJob.ProtodermisSmelter);
    });
  });

  describe('applyJobExp', () => {
    test('returns matoran unchanged when no assignment', () => {
      const matoran: RecruitedCharacterData = {
        exp: 100,
        id: 'Jala',
      };

      const [updated, earned] = applyJobExp(matoran);

      expect(updated).toEqual(matoran);
      expect(earned).toBe(0);
    });

    test('calculates exp earned based on time elapsed', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 10000; // 10 seconds ago

      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: tenSecondsAgo,
          expRatePerSecond: 1.0,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 100,
        id: 'Jala',
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(10); // 10 seconds * 1.0 rate
      expect(updated.exp).toBe(110); // 100 + 10
    });

    test('resets assignment timer after applying exp', () => {
      const now = Date.now();
      const tenSecondsAgo = now - 10000;

      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: tenSecondsAgo,
          expRatePerSecond: 1.0,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 100,
        id: 'Jala',
      };

      const [updated] = applyJobExp(matoran, now);

      expect(updated.assignment?.assignedAt).toBe(now);
    });

    test('handles fractional exp rates correctly', () => {
      const now = Date.now();
      const fiveSecondsAgo = now - 5000;

      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: fiveSecondsAgo,
          expRatePerSecond: 1.5,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 0,
        id: 'Jala',
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(7); // floor(5 * 1.5) = floor(7.5) = 7
      expect(updated.exp).toBe(7);
    });

    test('handles zero elapsed time', () => {
      const now = Date.now();

      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: now,
          expRatePerSecond: 1.0,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 100,
        id: 'Jala',
      };

      const [updated, earned] = applyJobExp(matoran, now);

      expect(earned).toBe(0);
      expect(updated.exp).toBe(100);
    });
  });

  describe('applyOfflineJobExp', () => {
    test('returns empty arrays when no characters', () => {
      const [updated, currencyGain] = applyOfflineJobExp([]);

      expect(updated).toEqual([]);
      expect(currencyGain).toBe(0);
    });

    test('processes multiple matoran with jobs', () => {
      const now = Date.now();
      const characters: RecruitedCharacterData[] = [
        {
          assignment: {
            assignedAt: now - 10000, // 10 seconds ago
            expRatePerSecond: 1.0,
            job: MatoranJob.CharcoalMaker,
          },
          exp: 0,
          id: 'Jala',
        },
        {
          assignment: {
            assignedAt: now - 5000, // 5 seconds ago
            expRatePerSecond: 1.0,
            job: MatoranJob.AlgaeHarvester,
          },
          exp: 0,
          id: 'Hahli',
        },
      ];

      const [updated, currencyGain] = applyOfflineJobExp(characters);

      expect(updated).toHaveLength(2);
      expect(updated[0].exp).toBeGreaterThan(0);
      expect(updated[1].exp).toBeGreaterThan(0);
      expect(currencyGain).toBeGreaterThan(0);
    });

    test('does not process matoran without jobs', () => {
      const characters: RecruitedCharacterData[] = [
        { exp: 100, id: 'Jala' },
        { exp: 50, id: 'Hahli' },
      ];

      const [updated, currencyGain] = applyOfflineJobExp(characters);

      expect(updated[0].exp).toBe(100);
      expect(updated[1].exp).toBe(50);
      expect(currencyGain).toBe(0);
    });

    describe('diminishing returns for offline rewards', () => {
      const ratePerSecond = 1.0;
      const msPerHour = 60 * 60 * 1000;

      test('first 12 hours give full rewards', () => {
        const now = 1000000000000; // fixed timestamp for determinism
        const tenHoursAgo = now - 10 * msPerHour;
        const characters: RecruitedCharacterData[] = [
          {
            assignment: {
              assignedAt: tenHoursAgo,
              expRatePerSecond: ratePerSecond,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 0,
            id: 'Jala',
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
            assignment: {
              assignedAt: fifteenHoursAgo,
              expRatePerSecond: ratePerSecond,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 0,
            id: 'Jala',
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
            assignment: {
              assignedAt: twentyOneHoursAgo,
              expRatePerSecond: ratePerSecond,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 0,
            id: 'Jala',
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
            assignment: {
              assignedAt: thirtyHoursAgo,
              expRatePerSecond: ratePerSecond,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 0,
            id: 'Jala',
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
          assignment: {
            assignedAt: fifteenHoursAgo,
            expRatePerSecond: ratePerSecond,
            job: MatoranJob.CharcoalMaker,
          },
          exp: 0,
          id: 'Jala',
        };

        // Online tick - no diminishing returns
        const [updated] = applyJobExp(matoran, now);

        // 15 hours = 54000 seconds, full rate
        expect(updated.exp).toBe(54000);
      });
    });
  });

  describe('battle pause catch-up via applyJobExp', () => {
    test('applyJobExp after assignedAt reset at battle start covers battle elapsed', () => {
      const battleStart = 1_000;
      const battleEnd = 61_000;
      const matoran: RecruitedCharacterData = {
        assignment: {
          assignedAt: 0,
          expRatePerSecond: 1,
          job: MatoranJob.CharcoalMaker,
        },
        exp: 0,
        id: 'Jala',
      };

      const [atBattleStart] = applyJobExp(matoran, battleStart);
      const [afterBattle, earned] = applyJobExp(atBattleStart, battleEnd);

      expect(earned).toBe(60);
      expect(afterBattle.exp).toBe(61);
      expect(afterBattle.assignment?.assignedAt).toBe(battleEnd);
    });
  });
});
