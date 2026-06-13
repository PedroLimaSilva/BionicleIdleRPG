/**
 * @jest-environment jsdom
 */
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import {
  clearGameDatabase,
  gameDb,
  readAssembledGameStateFromDatabase,
  writeFullGameStateToDatabase,
  writeGranularGameStateToDatabase,
} from './gameDatabase';

const baseState = {
  activeQuests: [],
  collectedKrana: {},
  completedQuests: [],
  customCharacters: [],
  kraataCollection: {},
  protodermis: 42,
  protodermisCap: 2000,
  rahkshi: [],
  recruitedCharacters: [{ exp: 10, id: 'Jala' }],
  version: CURRENT_GAME_STATE_VERSION,
};

describe('gameDatabase', () => {
  beforeEach(async () => {
    await clearGameDatabase();
  });

  test('writeFullGameStateToDatabase stores split rows', async () => {
    await writeFullGameStateToDatabase(baseState);

    const assembled = await readAssembledGameStateFromDatabase();
    expect(assembled).toEqual(baseState);
  });

  test('readAssembledGameStateFromDatabase returns recruited characters sorted by id', async () => {
    const state = {
      ...baseState,
      recruitedCharacters: [
        { exp: 10, id: 'Toa_Tahu' },
        { exp: 20, id: 'Toa_Gali' },
        { exp: 30, id: 'Toa_Kopaka' },
      ],
    };

    await writeFullGameStateToDatabase(state);

    const assembled = await readAssembledGameStateFromDatabase();
    expect(assembled?.recruitedCharacters.map((character) => character.id)).toEqual([
      'Toa_Gali',
      'Toa_Kopaka',
      'Toa_Tahu',
    ]);
  });

  test('writeFullGameStateToDatabase flattens meta into per-field game rows', async () => {
    await writeFullGameStateToDatabase(baseState);

    const protodermis = await gameDb.game.get('protodermis');
    const version = await gameDb.game.get('version');

    expect(protodermis).toEqual({ key: 'protodermis', value: 42 });
    expect(version).toEqual({ key: 'version', value: CURRENT_GAME_STATE_VERSION });
  });

  test('writeGranularGameStateToDatabase updates only changed game fields', async () => {
    await writeFullGameStateToDatabase(baseState);

    const updated = {
      ...baseState,
      protodermis: 99,
      recruitedCharacters: [{ assignment: undefined, exp: 25, id: 'Jala' }],
    };

    await writeGranularGameStateToDatabase(updated, baseState);

    const assembled = await readAssembledGameStateFromDatabase();
    expect(assembled?.protodermis).toBe(99);
    expect(assembled?.recruitedCharacters).toEqual([{ exp: 25, id: 'Jala' }]);
    expect(assembled?.completedQuests).toEqual([]);
  });

  test('writeGranularGameStateToDatabase updates only protodermis when currency changes', async () => {
    await writeFullGameStateToDatabase(baseState);

    const putSpy = jest.spyOn(gameDb.game, 'bulkPut');

    await writeGranularGameStateToDatabase({ ...baseState, protodermis: 55 }, baseState);

    expect(putSpy).toHaveBeenCalledWith([{ key: 'protodermis', value: 55 }]);
    putSpy.mockRestore();
  });

  test('writeGranularGameStateToDatabase deletes removed custom characters', async () => {
    const withCustom = {
      ...baseState,
      customCharacters: [{ element: 'Water', id: 'custom_0', mask: 'Ruru', name: 'Test' } as never],
    };
    await writeFullGameStateToDatabase(withCustom);

    const withoutCustom = {
      ...withCustom,
      customCharacters: [],
    };

    await writeGranularGameStateToDatabase(withoutCustom, withCustom);

    const customCharacters = await gameDb.customCharacters.toArray();
    expect(customCharacters).toEqual([]);
  });
});
