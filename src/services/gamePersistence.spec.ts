/**
 * @jest-environment jsdom
 */
import { loadGameState, saveGameState, STORAGE_KEY } from './gamePersistence';
import { CURRENT_GAME_STATE_VERSION, INITIAL_GAME_STATE } from '../data/gameState';
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

  describe('loadGameState – version migrations', () => {
    test('migrates older-version saves instead of discarding them', () => {
      const saved = {
        activeQuests: [],
        completedQuests: [],
        protodermis: 250,
        protodermisCap: 2000,
        recruitedCharacters: [{ exp: 0, id: 'Jala' }],
        version: CURRENT_GAME_STATE_VERSION - 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.version).toBe(CURRENT_GAME_STATE_VERSION);
      expect(state.protodermis).toBe(250);
      expect(state.recruitedCharacters).toHaveLength(1);
      expect(state.customCharacters).toEqual([]);
    });

    test('migrates legacy widgets key on older saves', () => {
      const saved = {
        activeQuests: [],
        completedQuests: [],
        recruitedCharacters: [{ exp: 0, id: 'Jala' }],
        version: CURRENT_GAME_STATE_VERSION - 1,
        widgetCap: 1500,
        widgets: 42,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state.protodermis).toBe(42);
      expect(state.protodermisCap).toBe(1500);
    });

    test('falls back to initial state when migration fails', () => {
      const saved = {
        protodermis: 10,
        recruitedCharacters: [],
        version: 99,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const state = loadGameState();

      expect(state).toEqual(INITIAL_GAME_STATE);
    });
  });

  describe('saveGameState', () => {
    test('persists state to localStorage', () => {
      const state = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 10,
        protodermisCap: 2000,
        rahkshi: [],
        recruitedCharacters: [],
        version: CURRENT_GAME_STATE_VERSION,
      };

      expect(saveGameState(state)).toEqual({ ok: true });
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual(state);
    });

    test('returns quota error when storage is full', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });

      const result = saveGameState({
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 10,
        protodermisCap: 2000,
        rahkshi: [],
        recruitedCharacters: [],
        version: CURRENT_GAME_STATE_VERSION,
      });

      expect(result).toEqual({ ok: false, reason: 'quota' });
      setItem.mockRestore();
    });
  });
});
