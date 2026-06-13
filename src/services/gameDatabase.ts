import Dexie, { type Table } from 'dexie';
import { BaseMatoran, RecruitedCharacterData } from '../types/Matoran';
import { PartialGameState } from '../types/GameState';
import { QuestProgress } from '../types/Quests';
import { KranaCollection } from '../types/Krana';
import { KraataCollection } from '../types/Kraata';
import { RahkshiArmor } from '../types/Rahkshi';

export const GAME_DB_NAME = 'BionicleIdleRPG';
export const META_KEY = 'game';
export const E2E_FORCE_GAME_STATE_IMPORT_KEY = 'E2E_FORCE_GAME_STATE_IMPORT';

export type GameMetaRecord = {
  key: typeof META_KEY;
  activeQuests: QuestProgress[];
  collectedKrana: KranaCollection;
  completedQuests: string[];
  importedFromLocalStorage?: boolean;
  kraataCollection: KraataCollection;
  protodermis: number;
  protodermisCap: number;
  rahkshi: RahkshiArmor[];
  version: number;
};

class GameDatabase extends Dexie {
  customCharacters!: Table<BaseMatoran, string>;
  meta!: Table<GameMetaRecord, string>;
  recruited!: Table<RecruitedCharacterData, string>;

  constructor() {
    super(GAME_DB_NAME);
    this.version(1).stores({
      customCharacters: 'id',
      meta: 'key',
      recruited: 'id',
    });
  }
}

export const gameDb = new GameDatabase();

function metaFromState(
  state: PartialGameState,
  extras?: Pick<GameMetaRecord, 'importedFromLocalStorage'>
): GameMetaRecord {
  return {
    activeQuests: state.activeQuests,
    collectedKrana: state.collectedKrana,
    completedQuests: state.completedQuests,
    key: META_KEY,
    kraataCollection: state.kraataCollection,
    protodermis: state.protodermis,
    protodermisCap: state.protodermisCap,
    rahkshi: state.rahkshi,
    version: state.version,
    ...extras,
  };
}

function metaPayload(meta: GameMetaRecord): Omit<GameMetaRecord, 'key'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { key, ...rest } = meta;
  return rest;
}

export function assemblePartialGameState(
  meta: GameMetaRecord,
  recruitedCharacters: RecruitedCharacterData[],
  customCharacters: BaseMatoran[]
): PartialGameState {
  return {
    activeQuests: meta.activeQuests,
    collectedKrana: meta.collectedKrana,
    completedQuests: meta.completedQuests,
    customCharacters,
    kraataCollection: meta.kraataCollection,
    protodermis: meta.protodermis,
    protodermisCap: meta.protodermisCap,
    rahkshi: meta.rahkshi,
    recruitedCharacters,
    version: meta.version,
  };
}

export async function isGameDatabasePopulated(): Promise<boolean> {
  const meta = await gameDb.meta.get(META_KEY);
  return meta !== undefined;
}

export async function clearGameDatabase(): Promise<void> {
  await gameDb.transaction(
    'rw',
    gameDb.meta,
    gameDb.recruited,
    gameDb.customCharacters,
    async () => {
      await gameDb.meta.clear();
      await gameDb.recruited.clear();
      await gameDb.customCharacters.clear();
    }
  );
}

export async function readAssembledGameStateFromDatabase(): Promise<PartialGameState | null> {
  const meta = await gameDb.meta.get(META_KEY);
  if (!meta) return null;

  const [recruitedCharacters, customCharacters] = await Promise.all([
    gameDb.recruited.toArray(),
    gameDb.customCharacters.toArray(),
  ]);

  return assemblePartialGameState(meta, recruitedCharacters, customCharacters);
}

export async function writeFullGameStateToDatabase(
  state: PartialGameState,
  extras?: Pick<GameMetaRecord, 'importedFromLocalStorage'>
): Promise<void> {
  await gameDb.transaction(
    'rw',
    gameDb.meta,
    gameDb.recruited,
    gameDb.customCharacters,
    async () => {
      await gameDb.meta.put(metaFromState(state, extras));
      await gameDb.recruited.clear();
      await gameDb.customCharacters.clear();
      if (state.recruitedCharacters.length > 0) {
        await gameDb.recruited.bulkPut(state.recruitedCharacters);
      }
      if (state.customCharacters.length > 0) {
        await gameDb.customCharacters.bulkPut(state.customCharacters);
      }
    }
  );
}

function rowsChanged<T extends { id: string }>(current: T[], previous: T[]): T[] {
  const previousById = new Map(previous.map((row) => [row.id, row]));
  return current.filter((row) => {
    const prior = previousById.get(row.id);
    return !prior || JSON.stringify(prior) !== JSON.stringify(row);
  });
}

function deletedIds<T extends { id: string }>(current: T[], previous: T[]): string[] {
  const currentIds = new Set(current.map((row) => row.id));
  return previous.filter((row) => !currentIds.has(row.id)).map((row) => row.id);
}

export async function writeGranularGameStateToDatabase(
  current: PartialGameState,
  previous: PartialGameState | null
): Promise<void> {
  if (!previous) {
    await writeFullGameStateToDatabase(current);
    return;
  }

  const recruitedUpdates = rowsChanged(current.recruitedCharacters, previous.recruitedCharacters);
  const recruitedDeletes = deletedIds(current.recruitedCharacters, previous.recruitedCharacters);
  const customUpdates = rowsChanged(current.customCharacters, previous.customCharacters);
  const customDeletes = deletedIds(current.customCharacters, previous.customCharacters);
  const nextMeta = metaFromState(current, {
    importedFromLocalStorage: undefined,
  });
  const metaChanged =
    JSON.stringify(metaPayload(nextMeta)) !== JSON.stringify(metaPayload(metaFromState(previous)));

  await gameDb.transaction(
    'rw',
    gameDb.meta,
    gameDb.recruited,
    gameDb.customCharacters,
    async () => {
      if (metaChanged) {
        const existingMeta = await gameDb.meta.get(META_KEY);
        await gameDb.meta.put({
          ...nextMeta,
          importedFromLocalStorage: existingMeta?.importedFromLocalStorage,
        });
      }
      if (recruitedUpdates.length > 0) {
        await gameDb.recruited.bulkPut(recruitedUpdates);
      }
      if (recruitedDeletes.length > 0) {
        await gameDb.recruited.bulkDelete(recruitedDeletes);
      }
      if (customUpdates.length > 0) {
        await gameDb.customCharacters.bulkPut(customUpdates);
      }
      if (customDeletes.length > 0) {
        await gameDb.customCharacters.bulkDelete(customDeletes);
      }
    }
  );
}
