/**
 * @jest-environment jsdom
 */
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import {
  clearGameDatabase,
  gameDb,
  META_KEY,
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

  test('writeGranularGameStateToDatabase updates only changed recruited rows', async () => {
    await writeFullGameStateToDatabase(baseState);

    const updated = {
      ...baseState,
      protodermis: 99,
      recruitedCharacters: [{ assignment: undefined, exp: 25, id: 'Jala' }],
    };

    await writeGranularGameStateToDatabase(updated, baseState);

    const meta = await gameDb.meta.get(META_KEY);
    const recruited = await gameDb.recruited.toArray();

    expect(meta?.protodermis).toBe(99);
    expect(recruited).toEqual([{ exp: 25, id: 'Jala' }]);
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
