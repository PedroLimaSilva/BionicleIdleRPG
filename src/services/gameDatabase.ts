import Dexie, { type Table } from 'dexie';
import { BaseMatoran, RecruitedCharacterData } from '../types/Matoran';
import { PartialGameState } from '../types/GameState';
import { QuestProgress } from '../types/Quests';
import { KranaCollection } from '../types/Krana';
import { KraataCollection } from '../types/Kraata';
import { RahkshiArmor } from '../types/Rahkshi';

export const GAME_DB_NAME = 'BionicleIdleRPG';
export const E2E_FORCE_GAME_STATE_IMPORT_KEY = 'E2E_FORCE_GAME_STATE_IMPORT';

/** IndexedDB schema version — bump when object stores change. */
export const GAME_DB_SCHEMA_VERSION = 2;

export const GAME_FIELD_KEYS = [
  'activeQuests',
  'collectedKrana',
  'completedQuests',
  'importedFromLocalStorage',
  'kraataCollection',
  'protodermis',
  'protodermisCap',
  'rahkshi',
  'version',
] as const;

export type GameFieldKey = (typeof GAME_FIELD_KEYS)[number];

export type GameFieldRecord = {
  key: GameFieldKey;
  value: unknown;
};

/** @deprecated v1 blob shape — migrated to flattened `game` rows on schema upgrade. */
type LegacyGameMetaRecord = {
  activeQuests: QuestProgress[];
  collectedKrana: KranaCollection;
  completedQuests: string[];
  importedFromLocalStorage?: boolean;
  key: 'game';
  kraataCollection: KraataCollection;
  protodermis: number;
  protodermisCap: number;
  rahkshi: RahkshiArmor[];
  version: number;
};

class GameDatabase extends Dexie {
  customCharacters!: Table<BaseMatoran, string>;
  game!: Table<GameFieldRecord, GameFieldKey>;
  recruited!: Table<RecruitedCharacterData, string>;

  constructor() {
    super(GAME_DB_NAME);
    this.version(1).stores({
      customCharacters: 'id',
      meta: 'key',
      recruited: 'id',
    });
    this.version(GAME_DB_SCHEMA_VERSION)
      .stores({
        customCharacters: 'id',
        game: 'key',
        recruited: 'id',
      })
      .upgrade(async (tx) => {
        const legacyTable = tx.table('meta');
        const legacy = (await legacyTable.get('game')) as LegacyGameMetaRecord | undefined;
        if (!legacy) return;

        const gameTable = tx.table('game');
        const rows = gameFieldsFromState({
          activeQuests: legacy.activeQuests,
          collectedKrana: legacy.collectedKrana,
          completedQuests: legacy.completedQuests,
          customCharacters: [],
          kraataCollection: legacy.kraataCollection,
          protodermis: legacy.protodermis,
          protodermisCap: legacy.protodermisCap,
          rahkshi: legacy.rahkshi,
          recruitedCharacters: [],
          version: legacy.version,
        });
        if (legacy.importedFromLocalStorage) {
          rows.push({ key: 'importedFromLocalStorage', value: true });
        }
        await gameTable.bulkPut(rows);
      });
  }
}

export const gameDb = new GameDatabase();

function gameFieldsFromState(
  state: PartialGameState,
  extras?: { importedFromLocalStorage?: boolean }
): GameFieldRecord[] {
  const rows: GameFieldRecord[] = [
    { key: 'activeQuests', value: state.activeQuests },
    { key: 'collectedKrana', value: state.collectedKrana },
    { key: 'completedQuests', value: state.completedQuests },
    { key: 'kraataCollection', value: state.kraataCollection },
    { key: 'protodermis', value: state.protodermis },
    { key: 'protodermisCap', value: state.protodermisCap },
    { key: 'rahkshi', value: state.rahkshi },
    { key: 'version', value: state.version },
  ];

  if (extras?.importedFromLocalStorage) {
    rows.push({ key: 'importedFromLocalStorage', value: true });
  }

  return rows;
}

function fieldValue<T>(fields: Map<GameFieldKey, unknown>, key: GameFieldKey, fallback: T): T {
  const value = fields.get(key);
  return (value === undefined ? fallback : value) as T;
}

export function assemblePartialGameState(
  fields: Map<GameFieldKey, unknown>,
  recruitedCharacters: RecruitedCharacterData[],
  customCharacters: BaseMatoran[]
): PartialGameState {
  return {
    activeQuests: fieldValue(fields, 'activeQuests', []),
    collectedKrana: fieldValue(fields, 'collectedKrana', {}),
    completedQuests: fieldValue(fields, 'completedQuests', []),
    customCharacters,
    kraataCollection: fieldValue(fields, 'kraataCollection', {}),
    protodermis: fieldValue(fields, 'protodermis', 0),
    protodermisCap: fieldValue(fields, 'protodermisCap', 2000),
    rahkshi: fieldValue(fields, 'rahkshi', []),
    recruitedCharacters,
    version: fieldValue(fields, 'version', 0),
  };
}

async function readGameFieldMap(): Promise<Map<GameFieldKey, unknown>> {
  const rows = await gameDb.game.toArray();
  return new Map(rows.map((row) => [row.key, row.value]));
}

export async function isGameDatabasePopulated(): Promise<boolean> {
  const version = await gameDb.game.get('version');
  return version !== undefined;
}

export async function wasImportedFromLocalStorage(): Promise<boolean> {
  const flag = await gameDb.game.get('importedFromLocalStorage');
  return flag?.value === true;
}

export async function clearGameDatabase(): Promise<void> {
  await gameDb.transaction('rw', gameDb.game, gameDb.recruited, gameDb.customCharacters, async () => {
    await gameDb.game.clear();
    await gameDb.recruited.clear();
    await gameDb.customCharacters.clear();
  });
}

export async function readAssembledGameStateFromDatabase(): Promise<PartialGameState | null> {
  const fields = await readGameFieldMap();
  if (!fields.has('version')) return null;

  const [recruitedCharacters, customCharacters] = await Promise.all([
    gameDb.recruited.toArray(),
    gameDb.customCharacters.toArray(),
  ]);

  return assemblePartialGameState(fields, recruitedCharacters, customCharacters);
}

export async function writeFullGameStateToDatabase(
  state: PartialGameState,
  extras?: { importedFromLocalStorage?: boolean }
): Promise<void> {
  await gameDb.transaction('rw', gameDb.game, gameDb.recruited, gameDb.customCharacters, async () => {
    const existingFlag = await gameDb.game.get('importedFromLocalStorage');
    const shouldMarkImported =
      extras?.importedFromLocalStorage === true ||
      (extras?.importedFromLocalStorage === undefined && existingFlag?.value === true);

    await gameDb.game.clear();
    const rows = gameFieldsFromState(state, {
      importedFromLocalStorage: shouldMarkImported ? true : undefined,
    });
    await gameDb.game.bulkPut(rows);
    await gameDb.recruited.clear();
    await gameDb.customCharacters.clear();
    if (state.recruitedCharacters.length > 0) {
      await gameDb.recruited.bulkPut(state.recruitedCharacters);
    }
    if (state.customCharacters.length > 0) {
      await gameDb.customCharacters.bulkPut(state.customCharacters);
    }
  });
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

const PERSISTED_GAME_FIELDS = GAME_FIELD_KEYS.filter(
  (key) => key !== 'importedFromLocalStorage'
) as Exclude<GameFieldKey, 'importedFromLocalStorage'>[];

function changedGameFields(
  current: PartialGameState,
  previous: PartialGameState
): GameFieldRecord[] {
  const changed: GameFieldRecord[] = [];
  for (const key of PERSISTED_GAME_FIELDS) {
    if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
      changed.push({ key, value: current[key] });
    }
  }
  return changed;
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
  const gameFieldUpdates = changedGameFields(current, previous);

  if (
    recruitedUpdates.length === 0 &&
    recruitedDeletes.length === 0 &&
    customUpdates.length === 0 &&
    customDeletes.length === 0 &&
    gameFieldUpdates.length === 0
  ) {
    return;
  }

  await gameDb.transaction('rw', gameDb.game, gameDb.recruited, gameDb.customCharacters, async () => {
    if (gameFieldUpdates.length > 0) {
      await gameDb.game.bulkPut(gameFieldUpdates);
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
  });
}
