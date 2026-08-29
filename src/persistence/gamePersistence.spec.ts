/**
 * @jest-environment jsdom
 */
import {
  clearGameDatabase,
  E2E_FORCE_GAME_STATE_IMPORT_KEY,
  gameDb,
  readAssembledGameStateFromDatabase,
} from './gameDatabase';
import {
  getInitialLoadedGameState,
  loadGameStateAsync,
  loadRawGameState,
  saveGameStateAsync,
  STORAGE_KEY,
} from './gamePersistence';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import { LegoColor } from '../types/Colors';
import { MatoranJob } from '../types/Jobs';
import { ElementTribe, Mask, MatoranStage, MatoranTag } from '../types/Matoran';

describe('gamePersistence', () => {
  beforeEach(async () => {
    localStorage.clear();
    await clearGameDatabase();
  });

  describe('loadGameStateAsync – sanitizeUnrecognizedJobs', () => {
    test('keeps valid job assignments untouched', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
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
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.recruitedCharacters[0].assignment).toBeDefined();
      expect(state.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
    });

    test('clears assignment when job is unrecognized (retro-compatibility)', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
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
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
      expect(state.recruitedCharacters[0].exp).toBeGreaterThanOrEqual(200);
    });

    test('clears Mata Nui job assignments from Metru Matoran on load', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          {
            assignment: {
              assignedAt: Date.now() - 5000,
              expRatePerSecond: 1.0,
              job: MatoranJob.CharcoalMaker,
            },
            exp: 200,
            id: 'Vakama',
          },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.recruitedCharacters[0].assignment).toBeUndefined();
    });
  });

  describe('loadGameStateAsync – sanitizeOrphanedCustomCharacters', () => {
    test('removes recruited customs missing from customCharacters and drops their quests', async () => {
      const saved = {
        activeQuests: [
          {
            assignedMatoran: ['custom_0', 'Jala'],
            endsAt: Date.now() / 1000 + 3600,
            questId: 'test_quest',
            startedAt: Date.now() / 1000,
          },
        ],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          { exp: 10, id: 'custom_0' },
          { exp: 5, id: 'Jala' },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.recruitedCharacters.map((m) => m.id)).toEqual(['Jala']);
      expect(state.activeQuests).toHaveLength(1);
      expect(state.activeQuests[0].assignedMatoran).toEqual(['Jala']);
    });

    test('removes quests that only assigned orphaned customs', async () => {
      const saved = {
        activeQuests: [
          {
            assignedMatoran: ['custom_0'],
            endsAt: Date.now() / 1000 + 3600,
            questId: 'solo_custom_quest',
            startedAt: Date.now() / 1000,
          },
        ],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [{ exp: 10, id: 'custom_0' }],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.recruitedCharacters).toEqual([]);
      expect(state.activeQuests).toEqual([]);
    });
  });

  describe('loadGameStateAsync – sanitizeCustomCharacterPalettes', () => {
    test('translates leftover flat custom palettes and persists the new shape', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [
          {
            colors: {
              arms: LegoColor.Orange,
              body: LegoColor.Red,
              eyes: LegoColor.TransNeonRed,
              face: LegoColor.LightGray,
              feet: LegoColor.Red,
              mask: LegoColor.Red,
              weaponGlow: LegoColor.Orange,
            },
            element: ElementTribe.Fire,
            id: 'custom_0',
            kitSlotMap: { arms: { Main: 'joints', Secondary: 'body' } },
            mask: Mask.Hau,
            name: 'Legacy',
            stage: MatoranStage.ToaMata,
            tags: [MatoranTag.Custom],
          },
        ],
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [{ exp: 0, id: 'custom_0' }],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();
      const custom = state.customCharacters[0];

      expect(custom.colors.body).toEqual({
        glow: LegoColor.TransNeonRed,
        main: LegoColor.Red,
        metal: LegoColor.LightGray,
        secondary: LegoColor.Orange,
      });
      expect(custom.colors.weapon?.glow).toBe(LegoColor.Orange);
      expect(custom).not.toHaveProperty('kitSlotMap');

      const persisted = await readAssembledGameStateFromDatabase();
      expect(persisted?.customCharacters[0].colors.body).toEqual(custom.colors.body);
      expect(persisted?.customCharacters[0]).not.toHaveProperty('kitSlotMap');
    });

    test('drops unreadable customs and their recruited ghosts', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [
          {
            colors: { mask: LegoColor.Red },
            element: ElementTribe.Fire,
            id: 'custom_0',
            mask: Mask.Hau,
            name: 'Broken',
            stage: MatoranStage.Diminished,
          },
        ],
        kraataCollection: {},
        protodermis: 100,
        protodermisCap: 2000,
        recruitedCharacters: [
          { exp: 10, id: 'custom_0' },
          { exp: 5, id: 'Jala' },
        ],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state.customCharacters).toEqual([]);
      expect(state.recruitedCharacters.map((m) => m.id)).toEqual(['Jala']);
    });
  });

  describe('importFromLocalStorageIfNeeded', () => {
    test('removes legacy localStorage blob after import in normal mode', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 77,
        protodermisCap: 2000,
        rahkshi: [],
        recruitedCharacters: [],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      await loadGameStateAsync();

      expect(loadRawGameState()).toBeNull();
      expect((await readAssembledGameStateFromDatabase())?.protodermis).toBe(77);
    });

    test('keeps legacy localStorage blob when E2E force-import is enabled', async () => {
      const saved = {
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 88,
        protodermisCap: 2000,
        rahkshi: [],
        recruitedCharacters: [],
        version: CURRENT_GAME_STATE_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      await loadGameStateAsync();

      expect(loadRawGameState()).not.toBeNull();
    });
  });

  describe('loadGameStateAsync – version validation', () => {
    test('rejects older-version localStorage saves', async () => {
      const saved = {
        activeQuests: [],
        completedQuests: [],
        protodermis: 250,
        protodermisCap: 2000,
        recruitedCharacters: [{ exp: 0, id: 'Jala' }],
        version: CURRENT_GAME_STATE_VERSION - 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state).toEqual(getInitialLoadedGameState());
      expect(await readAssembledGameStateFromDatabase()).toBeNull();
    });

    test('rejects newer-version saves', async () => {
      const saved = {
        protodermis: 10,
        recruitedCharacters: [],
        version: 99,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
      localStorage.setItem('TEST_MODE', 'true');

      const state = await loadGameStateAsync();

      expect(state).toEqual(getInitialLoadedGameState());
    });

    test('returns initial state when no save exists', async () => {
      const state = await loadGameStateAsync();
      expect(state).toEqual(getInitialLoadedGameState());
    });
  });

  describe('saveGameStateAsync', () => {
    test('persists state to IndexedDB', async () => {
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

      expect(await saveGameStateAsync(state)).toEqual({ ok: true });
      expect(await readAssembledGameStateFromDatabase()).toEqual(state);
      expect(loadRawGameState()).toBeNull();
    });

    test('returns quota error when storage is full', async () => {
      const bulkPut = jest
        .spyOn(gameDb.recruited, 'bulkPut')
        .mockRejectedValue(new DOMException('Quota exceeded', 'QuotaExceededError'));

      const result = await saveGameStateAsync({
        activeQuests: [],
        collectedKrana: {},
        completedQuests: [],
        customCharacters: [],
        kraataCollection: {},
        protodermis: 10,
        protodermisCap: 2000,
        rahkshi: [],
        recruitedCharacters: [{ exp: 0, id: 'Jala' }],
        version: CURRENT_GAME_STATE_VERSION,
      });

      expect(result).toEqual({ ok: false, reason: 'quota' });
      bulkPut.mockRestore();
    });
  });
});
