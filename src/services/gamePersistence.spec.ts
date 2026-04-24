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
        activeQuests: [],
        buyableCharacters: [],
        collectedKrana: {},
        completedQuests: [],
        inventory: {},
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          {
            assignment: {
              assignedAt: Date.now() - 1000,
              expRatePerSecond: 1.2,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 50,
            id: 'Jala',
          },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeDefined();
      expect(state.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
    });

    test('clears assignment when job is unrecognized (retro-compatibility)', () => {
      const saved = {
        activeQuests: [],
        buyableCharacters: [],
        collectedKrana: {},
        completedQuests: [],
        inventory: {},
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          {
            assignment: {
              assignedAt: Date.now() - 5000,
              expRatePerSecond: 1.0,
              job: 'LightStoneFarmer',
            },
            exp: 200,
            id: 'Taipu',
          },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
      expect(state.recruitedCharacters[0].exp).toBeGreaterThanOrEqual(200);
    });

    test('preserves idle matoran (no assignment)', () => {
      const saved = {
        activeQuests: [],
        buyableCharacters: [],
        collectedKrana: {},
        completedQuests: [],
        inventory: {},
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [{ exp: 0, id: 'Hahli' }],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
    });

    test('handles mix of valid, invalid, and idle assignments', () => {
      const saved = {
        activeQuests: [],
        buyableCharacters: [],
        collectedKrana: {},
        completedQuests: [],
        inventory: {},
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          {
            assignment: {
              assignedAt: Date.now() - 1000,
              expRatePerSecond: 1.2,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 50,
            id: 'Jala',
          },
          {
            assignment: {
              assignedAt: Date.now() - 1000,
              expRatePerSecond: 1.0,
              job: 'SomeDeletedJob',
            },
            exp: 100,
            id: 'Taipu',
          },
          { exp: 0, id: 'Hahli' },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(state.recruitedCharacters[1].assignment).toBeUndefined();
      expect(state.recruitedCharacters[2].assignment).toBeUndefined();
    });
  });
});
