/**
 * @jest-environment jsdom
 */
import { loadGameState, STORAGE_KEY } from './gamePersistence';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import { MatoranJob } from '../types/Jobs';

describe('gamePersistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadGameState – sanitizeUnrecognizedJobs', () => {
    test('keeps valid job assignments untouched', () => {
      const saved = {
        version: CURRENT_GAME_STATE_VERSION,
        protodermis: 100,
        protodermisCap: 2000,
        completedQuests: [],
        activeQuests: [],
        collectedKrana: {},
        kraataCollection: {},
        inventory: {},
        recruitedCharacters: [
          {
            id: 'Jala',
            exp: 50,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: 1.2,
              assignedAt: Date.now() - 1000,
            },
          },
        ],
        buyableCharacters: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeDefined();
      expect(state.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
    });

    test('clears assignment when job is unrecognized (retro-compatibility)', () => {
      const saved = {
        version: CURRENT_GAME_STATE_VERSION,
        protodermis: 100,
        protodermisCap: 2000,
        completedQuests: [],
        activeQuests: [],
        collectedKrana: {},
        kraataCollection: {},
        inventory: {},
        recruitedCharacters: [
          {
            id: 'Taipu',
            exp: 200,
            assignment: {
              job: 'LightStoneFarmer',
              expRatePerSecond: 1.0,
              assignedAt: Date.now() - 5000,
            },
          },
        ],
        buyableCharacters: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
      expect(state.recruitedCharacters[0].exp).toBeGreaterThanOrEqual(200);
    });

    test('preserves idle matoran (no assignment)', () => {
      const saved = {
        version: CURRENT_GAME_STATE_VERSION,
        protodermis: 100,
        protodermisCap: 2000,
        completedQuests: [],
        activeQuests: [],
        collectedKrana: {},
        kraataCollection: {},
        inventory: {},
        recruitedCharacters: [{ id: 'Hahli', exp: 0 }],
        buyableCharacters: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
    });

    test('handles mix of valid, invalid, and idle assignments', () => {
      const saved = {
        version: CURRENT_GAME_STATE_VERSION,
        protodermis: 100,
        protodermisCap: 2000,
        completedQuests: [],
        activeQuests: [],
        collectedKrana: {},
        kraataCollection: {},
        inventory: {},
        recruitedCharacters: [
          {
            id: 'Jala',
            exp: 50,
            assignment: {
              job: MatoranJob.CharcoalMaker,
              expRatePerSecond: 1.2,
              assignedAt: Date.now() - 1000,
            },
          },
          {
            id: 'Taipu',
            exp: 100,
            assignment: {
              job: 'SomeDeletedJob',
              expRatePerSecond: 1.0,
              assignedAt: Date.now() - 1000,
            },
          },
          { id: 'Hahli', exp: 0 },
        ],
        buyableCharacters: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(state.recruitedCharacters[1].assignment).toBeUndefined();
      expect(state.recruitedCharacters[2].assignment).toBeUndefined();
    });
  });
});
