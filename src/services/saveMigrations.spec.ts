/**
 * @jest-environment jsdom
 */
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import { migrateState, MIGRATIONS, SaveMigrationError } from './saveMigrations';

describe('saveMigrations', () => {
  test('migrateState applies migrations from older version to target', () => {
    const state = {
      protodermis: 50,
      recruitedCharacters: [],
      version: 8,
    };

    const migrated = migrateState(state, CURRENT_GAME_STATE_VERSION);

    expect(migrated.version).toBe(CURRENT_GAME_STATE_VERSION);
    expect(migrated.customCharacters).toEqual([]);
    expect(migrated.collectedKrana).toEqual({});
    expect(migrated.kraataCollection).toEqual({});
    expect(migrated.rahkshi).toEqual([]);
  });

  test('migrateState leaves current-version saves unchanged aside from version field', () => {
    const state = {
      customCharacters: [{ id: 'custom_0', name: 'Test' }],
      protodermis: 10,
      recruitedCharacters: [],
      version: CURRENT_GAME_STATE_VERSION,
    };

    const migrated = migrateState(state, CURRENT_GAME_STATE_VERSION);

    expect(migrated.version).toBe(CURRENT_GAME_STATE_VERSION);
    expect(migrated.customCharacters).toEqual(state.customCharacters);
  });

  test('migrateState treats missing version as 0', () => {
    const migrated = migrateState({ recruitedCharacters: [] }, CURRENT_GAME_STATE_VERSION);
    expect(migrated.version).toBe(CURRENT_GAME_STATE_VERSION);
  });

  test('migrateState rejects saves newer than the app supports', () => {
    expect(() => migrateState({ version: 99 }, CURRENT_GAME_STATE_VERSION)).toThrow(
      SaveMigrationError
    );
  });

  test('each migration step sets version on the document', () => {
    for (const version of Object.keys(MIGRATIONS).map(Number)) {
      const migrated = migrateState({ version: version - 1 }, version);
      expect(migrated.version).toBe(version);
    }
  });
});
