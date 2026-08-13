import { CURRENT_GAME_STATE_VERSION, INITIAL_GAME_STATE } from '../data/gameState';
import { applyOfflineJobExp } from '../game/Jobs';
import { PartialGameState } from '../types/GameState';
import { MatoranJob } from '../types/Jobs';
import { BaseMatoran, isCustomCharacterId, RecruitedCharacterData } from '../types/Matoran';
import { QuestProgress } from '../types/Quests';
import { clamp } from '../utils/math';
import { isTestMode } from '../utils/testMode';
import {
  clearGameDatabase,
  E2E_FORCE_GAME_STATE_IMPORT_KEY,
  isGameDatabasePopulated,
  readAssembledGameStateFromDatabase,
  wasImportedFromLocalStorage,
  writeFullGameStateToDatabase,
  writeGranularGameStateToDatabase,
} from './gameDatabase';

export const STORAGE_KEY = `GAME_STATE`;

export type LoadedGameState = PartialGameState;

let lastPersistedState: PartialGameState | null = null;

export function getLastPersistedGameState(): PartialGameState | null {
  return lastPersistedState;
}

export function toLoadedGameState(state: PartialGameState): LoadedGameState {
  return {
    activeQuests: state.activeQuests,
    collectedKrana: state.collectedKrana,
    completedQuests: state.completedQuests,
    customCharacters: state.customCharacters,
    kraataCollection: state.kraataCollection,
    protodermis: state.protodermis,
    protodermisCap: state.protodermisCap,
    rahkshi: state.rahkshi,
    recruitedCharacters: state.recruitedCharacters,
    version: state.version,
  };
}

export function getInitialLoadedGameState(): LoadedGameState {
  return toLoadedGameState({
    activeQuests: INITIAL_GAME_STATE.activeQuests,
    collectedKrana: INITIAL_GAME_STATE.collectedKrana,
    completedQuests: INITIAL_GAME_STATE.completedQuests,
    customCharacters: INITIAL_GAME_STATE.customCharacters,
    kraataCollection: INITIAL_GAME_STATE.kraataCollection,
    protodermis: INITIAL_GAME_STATE.protodermis,
    protodermisCap: INITIAL_GAME_STATE.protodermisCap,
    rahkshi: INITIAL_GAME_STATE.rahkshi,
    recruitedCharacters: INITIAL_GAME_STATE.recruitedCharacters,
    version: INITIAL_GAME_STATE.version,
  });
}

/** Reads and parses the raw legacy localStorage blob without migrations or side effects. */
export function loadRawGameState(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) return parsed;
  } catch {
    // Corrupt or missing
  }
  return null;
}

function shouldForceLocalStorageImport(): boolean {
  return isTestMode() && localStorage.getItem(E2E_FORCE_GAME_STATE_IMPORT_KEY) === 'true';
}

async function importFromLocalStorageIfNeeded(): Promise<void> {
  if (await isGameDatabasePopulated()) {
    if (!shouldForceLocalStorageImport()) return;
    await clearGameDatabase();
  }

  const raw = loadRawGameState();
  if (!raw || typeof raw !== 'object') return;

  const document = { ...raw };
  if (!Array.isArray(document.recruitedCharacters)) {
    document.recruitedCharacters = [];
  }
  if (!Array.isArray(document.customCharacters)) {
    document.customCharacters = [];
  }

  const loaded = processLoadedGameDocument(document);
  await writeFullGameStateToDatabase(loaded, {
    importedFromLocalStorage: true,
  });

  if (!shouldForceLocalStorageImport()) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/** Fills optional fields missing from a current-version save document. */
function applyOptionalDefaults(parsed: Record<string, unknown>): void {
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
  if (!Array.isArray(parsed.activeQuests)) {
    parsed.activeQuests = [];
  }
  if (!Array.isArray(parsed.completedQuests)) {
    parsed.completedQuests = [];
  }
}

const VALID_JOBS = new Set<string>(Object.values(MatoranJob));

/** Clears any job assignment whose `job` value is not a recognised MatoranJob. */
function sanitizeUnrecognizedJobs(parsed: Record<string, unknown>): void {
  const characters = parsed.recruitedCharacters as RecruitedCharacterData[] | undefined;
  if (!Array.isArray(characters)) return;

  parsed.recruitedCharacters = characters.map((m) => {
    if (m.assignment && !VALID_JOBS.has(m.assignment.job)) {
      return { ...m, assignment: undefined };
    }
    return m;
  });
}

/**
 * Removes recruited custom characters whose base data is missing from `customCharacters`.
 * Also strips them from active quest assignments so job ticks do not keep updating ghosts.
 */
function sanitizeOrphanedCustomCharacters(parsed: Record<string, unknown>): void {
  const recruitedCharacters = parsed.recruitedCharacters as RecruitedCharacterData[] | undefined;
  if (!Array.isArray(recruitedCharacters)) return;

  const customCharacters = parsed.customCharacters as BaseMatoran[] | undefined;
  const knownCustomIds = new Set(
    Array.isArray(customCharacters) ? customCharacters.map((character) => character.id) : []
  );

  const orphanedIds = new Set(
    recruitedCharacters
      .filter((character) => isCustomCharacterId(character.id) && !knownCustomIds.has(character.id))
      .map((character) => character.id)
  );

  if (orphanedIds.size === 0) return;

  parsed.recruitedCharacters = recruitedCharacters.filter(
    (character) => !orphanedIds.has(character.id)
  );

  const activeQuests = parsed.activeQuests as QuestProgress[] | undefined;
  if (!Array.isArray(activeQuests)) return;

  parsed.activeQuests = activeQuests
    .map((quest) => ({
      ...quest,
      assignedMatoran: quest.assignedMatoran.filter((id) => !orphanedIds.has(id)),
    }))
    .filter((quest) => quest.assignedMatoran.length > 0);
}

function isValidLoadedGameState(data: PartialGameState): boolean {
  return (
    typeof data.version === 'number' &&
    data.version === CURRENT_GAME_STATE_VERSION &&
    typeof data.protodermis === 'number' &&
    Array.isArray(data.recruitedCharacters)
  );
}

export function processLoadedGameDocument(parsed: Record<string, unknown>): LoadedGameState {
  applyOptionalDefaults(parsed);
  sanitizeUnrecognizedJobs(parsed);
  sanitizeOrphanedCustomCharacters(parsed);

  if (!isValidLoadedGameState(parsed as PartialGameState)) {
    throw new Error('Invalid game state document');
  }

  const typed = parsed as PartialGameState;
  const [recruitedCharacters, currency] = applyOfflineJobExp(typed.recruitedCharacters);

  return toLoadedGameState({
    ...typed,
    protodermis: clamp(typed.protodermis + currency, 0, typed.protodermisCap),
    recruitedCharacters,
  });
}

async function loadGameStateAsyncInternal(): Promise<LoadedGameState> {
  try {
    await importFromLocalStorageIfNeeded();

    const assembled = await readAssembledGameStateFromDatabase();
    if (!assembled) {
      return getInitialLoadedGameState();
    }

    const loaded = processLoadedGameDocument(assembled as unknown as Record<string, unknown>);
    if (JSON.stringify(loaded) !== JSON.stringify(toLoadedGameState(assembled))) {
      await writeFullGameStateToDatabase(loaded, {
        importedFromLocalStorage: await wasImportedFromLocalStorage(),
      });
    }

    lastPersistedState = loaded;
    return loaded;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return getInitialLoadedGameState();
  }
}

/** Coalesce concurrent loads (React StrictMode mounts GameProvider twice in dev). */
let inFlightLoad: Promise<LoadedGameState> | null = null;

export function loadGameStateAsync(): Promise<LoadedGameState> {
  if (inFlightLoad) return inFlightLoad;

  inFlightLoad = loadGameStateAsyncInternal().finally(() => {
    inFlightLoad = null;
  });

  return inFlightLoad;
}

/** @deprecated Use `loadGameStateAsync`. Synchronous load remains for legacy callers in tests. */
export function loadGameState(): LoadedGameState {
  const parsed = loadRawGameState();
  if (parsed) {
    try {
      return processLoadedGameDocument(parsed);
    } catch (e) {
      console.error('Failed to parse game state:', e);
    }
  }
  return getInitialLoadedGameState();
}

export type SavePersistenceErrorReason = 'quota' | 'unknown';

export type SaveGameStateResult = { ok: true } | { ok: false; reason: SavePersistenceErrorReason };

type SavePersistenceErrorListener = (error: SavePersistenceErrorReason | null) => void;

const savePersistenceErrorListeners = new Set<SavePersistenceErrorListener>();

export function subscribeSavePersistenceError(listener: SavePersistenceErrorListener): () => void {
  savePersistenceErrorListeners.add(listener);
  return () => savePersistenceErrorListeners.delete(listener);
}

function notifySavePersistenceError(error: SavePersistenceErrorReason | null): void {
  for (const listener of savePersistenceErrorListeners) {
    listener(error);
  }
}

function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === 'QuotaExceededError' || error.code === 22;
  }
  return error instanceof Error && error.name === 'QuotaExceededError';
}

export async function saveGameStateAsync(
  state: PartialGameState,
  previous: PartialGameState | null = null
): Promise<SaveGameStateResult> {
  try {
    await writeGranularGameStateToDatabase(state, previous);
    lastPersistedState = toLoadedGameState(state);
    notifySavePersistenceError(null);
    return { ok: true };
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.error('Failed to save game state: storage quota exceeded', error);
      notifySavePersistenceError('quota');
      return { ok: false, reason: 'quota' };
    }
    console.error('Failed to save game state:', error);
    notifySavePersistenceError('unknown');
    return { ok: false, reason: 'unknown' };
  }
}

/** @deprecated Use `saveGameStateAsync`. Writes the legacy localStorage blob only. */
export function saveGameState(state: PartialGameState): SaveGameStateResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    notifySavePersistenceError(null);
    return { ok: true };
  } catch (error) {
    if (isQuotaExceededError(error)) {
      console.error('Failed to save game state: storage quota exceeded', error);
      notifySavePersistenceError('quota');
      return { ok: false, reason: 'quota' };
    }
    console.error('Failed to save game state:', error);
    notifySavePersistenceError('unknown');
    return { ok: false, reason: 'unknown' };
  }
}

export async function resetGameData(): Promise<void> {
  await clearGameDatabase();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(E2E_FORCE_GAME_STATE_IMPORT_KEY);
  lastPersistedState = null;
  window.location.reload();
}

let debugMode: boolean | undefined;

export function getDebugMode() {
  if (debugMode !== undefined) {
    return debugMode;
  }
  const stored = localStorage.getItem('DEBUG_MODE');
  if (stored) {
    const parsed = JSON.parse(stored) as boolean;
    debugMode = parsed;
    return parsed;
  }
  debugMode = false;
  return false;
}

export function saveDebugMode(value: boolean) {
  debugMode = value;
  localStorage.setItem('DEBUG_MODE', debugMode.toString());
}

let shadowsEnabled: boolean | undefined;

export function getShadowsEnabled() {
  if (shadowsEnabled !== undefined) {
    return shadowsEnabled;
  }
  const stored = localStorage.getItem('SHADOWS_ENABLED');
  if (stored !== null) {
    const parsed = JSON.parse(stored) as boolean;
    shadowsEnabled = parsed;
    return parsed;
  }
  shadowsEnabled = true;
  return true;
}

export function saveShadowsEnabled(value: boolean) {
  shadowsEnabled = value;
  localStorage.setItem('SHADOWS_ENABLED', JSON.stringify(shadowsEnabled));
}

let performanceMonitorEnabled: boolean | undefined;

export function getPerformanceMonitorEnabled() {
  if (performanceMonitorEnabled !== undefined) {
    return performanceMonitorEnabled;
  }
  const stored = localStorage.getItem('PERFORMANCE_MONITOR_ENABLED');
  if (stored !== null) {
    const parsed = JSON.parse(stored) as boolean;
    performanceMonitorEnabled = parsed;
    return parsed;
  }
  performanceMonitorEnabled = false;
  return false;
}

export function savePerformanceMonitorEnabled(value: boolean) {
  performanceMonitorEnabled = value;
  localStorage.setItem('PERFORMANCE_MONITOR_ENABLED', JSON.stringify(performanceMonitorEnabled));
}

let debugCharacterCreation: boolean | undefined;

const DEBUG_CHARACTER_CREATION_KEY = 'DEBUG_CHARACTER_CREATION';
const LEGACY_DEBUG_CHARACTER_CREATION_KEY = 'CHARACTER_CREATION_DEBUG_EDITABLE';

export function getDebugCharacterCreation() {
  if (debugCharacterCreation !== undefined) {
    return debugCharacterCreation;
  }
  const stored = localStorage.getItem(DEBUG_CHARACTER_CREATION_KEY);
  if (stored !== null) {
    const parsed = JSON.parse(stored) as boolean;
    debugCharacterCreation = parsed;
    return parsed;
  }
  const legacy = localStorage.getItem(LEGACY_DEBUG_CHARACTER_CREATION_KEY);
  if (legacy !== null) {
    const parsed = JSON.parse(legacy) as boolean;
    debugCharacterCreation = parsed;
    localStorage.setItem(DEBUG_CHARACTER_CREATION_KEY, JSON.stringify(parsed));
    localStorage.removeItem(LEGACY_DEBUG_CHARACTER_CREATION_KEY);
    return parsed;
  }
  debugCharacterCreation = false;
  return false;
}

export function saveDebugCharacterCreation(value: boolean) {
  debugCharacterCreation = value;
  localStorage.setItem(DEBUG_CHARACTER_CREATION_KEY, JSON.stringify(debugCharacterCreation));
  localStorage.removeItem(LEGACY_DEBUG_CHARACTER_CREATION_KEY);
}

let telemetryEnabled: boolean | undefined;

/** Returns true only if the user has explicitly chosen a telemetry preference. */
export function hasTelemetryConsent(): boolean {
  return localStorage.getItem('TELEMETRY_ENABLED') !== null;
}

export function getTelemetryEnabled() {
  if (telemetryEnabled !== undefined) {
    return telemetryEnabled;
  }
  const stored = localStorage.getItem('TELEMETRY_ENABLED');
  if (stored !== null) {
    const parsed = JSON.parse(stored) as boolean;
    telemetryEnabled = parsed;
    return parsed;
  }
  telemetryEnabled = false;
  return false;
}

export function saveTelemetryEnabled(value: boolean) {
  telemetryEnabled = value;
  localStorage.setItem('TELEMETRY_ENABLED', JSON.stringify(telemetryEnabled));

  if (value && !localStorage.getItem('TELEMETRY_ID')) {
    localStorage.setItem('TELEMETRY_ID', crypto.randomUUID());
  }
}

/** Returns the random telemetry ID, or undefined if consent was not given. */
export function getTelemetryId(): string | undefined {
  return localStorage.getItem('TELEMETRY_ID') ?? undefined;
}
