import { INITIAL_GAME_STATE } from '../data/gameState';

export type Migration = (state: Record<string, unknown>) => Record<string, unknown>;

/**
 * Per-version document migrations. When bumping `CURRENT_GAME_STATE_VERSION`, add a step here
 * before updating the constant in `src/data/gameState.ts`.
 *
 * Version history:
 * - 9: Persist `customCharacters`; ensure collection fields exist on upgrade from v8.
 */
export const MIGRATIONS: Record<number, Migration> = {
  9: (state) => {
    if (!Array.isArray(state.customCharacters)) {
      state.customCharacters = [];
    }
    if (!state.collectedKrana || typeof state.collectedKrana !== 'object') {
      state.collectedKrana = {};
    }
    if (!state.kraataCollection || typeof state.kraataCollection !== 'object') {
      state.kraataCollection = {};
    }
    if (!Array.isArray(state.rahkshi)) {
      state.rahkshi = [];
    }
    return state;
  },
};

export class SaveMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SaveMigrationError';
  }
}

/**
 * Applies numbered migrations from `state.version` (or 0 when missing) up to `targetVersion`.
 * Each applied step sets `state.version` to that step number.
 */
export function migrateState(
  state: Record<string, unknown>,
  targetVersion: number
): Record<string, unknown> {
  let current = { ...state };
  const from =
    typeof current.version === 'number' && Number.isFinite(current.version) ? current.version : 0;

  if (from > targetVersion) {
    throw new SaveMigrationError(
      `Save version ${from} is newer than supported version ${targetVersion}`
    );
  }

  for (let version = from + 1; version <= targetVersion; version++) {
    const migration = MIGRATIONS[version];
    if (migration) {
      current = migration({ ...current });
    }
    current.version = version;
  }

  return current;
}

/**
 * Shape fixes that apply to every load regardless of version number (legacy field renames,
 * defaults for optional keys). Runs after `migrateState` and before validation.
 */
export function normalizeGameStateDocument(parsed: Record<string, unknown>): void {
  if (parsed.protodermis === undefined && typeof parsed.widgets === 'number') {
    parsed.protodermis = parsed.widgets;
    parsed.protodermisCap = parsed.widgetCap ?? INITIAL_GAME_STATE.protodermisCap;
  }
  if (!parsed.protodermisCap) {
    parsed.protodermisCap = INITIAL_GAME_STATE.protodermisCap;
  }
  if (!parsed.collectedKrana) {
    parsed.collectedKrana = {};
  }
  if (!parsed.kraataCollection) {
    parsed.kraataCollection = {};
  }
  if (!Array.isArray(parsed.rahkshi)) {
    parsed.rahkshi = [];
  }
  if (!Array.isArray(parsed.customCharacters)) {
    parsed.customCharacters = [];
  }
}
