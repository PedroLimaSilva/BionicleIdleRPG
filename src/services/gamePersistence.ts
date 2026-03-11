import { CURRENT_GAME_STATE_VERSION, INITIAL_GAME_STATE } from '../data/gameState';
import { applyOfflineJobExp } from '../game/Jobs';
import { GameState } from '../types/GameState';
import { MatoranJob } from '../types/Jobs';
import { isKraataPower, addKraataToCollection, KraataCollection } from '../types/Kraata';
import { RecruitedCharacterData } from '../types/Matoran';
import { clamp } from '../utils/math';

export const STORAGE_KEY = `GAME_STATE`;

export function resetGameData() {
  localStorage.setItem(STORAGE_KEY, '');
  window.location.reload();
}

/**
 * Retrocompatibility: migrates any kraata from the legacy `inventory` (old saves)
 * into `kraataCollection` at stage 1, then clears the legacy key.
 * Inventory is no longer used elsewhere; this is the only remaining migration.
 */
function migrateKraataFromInventory(parsed: Record<string, unknown>): void {
  const inventory = parsed.inventory as Record<string, number> | undefined;
  if (!inventory || typeof inventory !== 'object') return;

  let kraataCollection = (parsed.kraataCollection ?? {}) as KraataCollection;
  let migrated = false;

  for (const [id, qty] of Object.entries(inventory)) {
    if (isKraataPower(id) && typeof qty === 'number' && qty > 0) {
      kraataCollection = addKraataToCollection(kraataCollection, id, 1, qty);
      migrated = true;
    }
  }

  if (migrated) {
    parsed.kraataCollection = kraataCollection;
    parsed.inventory = {};
  }
}

const VALID_JOBS = new Set<string>(Object.values(MatoranJob));

/**
 * Retrocompatibility: clears any job assignment whose `job` value is not a
 * recognised MatoranJob (e.g. after a rename). The matoran becomes idle.
 */
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

export function loadGameState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Migrate old save keys (widgets/widgetCap) to protodermis/protodermisCap
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

      migrateKraataFromInventory(parsed);
      sanitizeUnrecognizedJobs(parsed);

      if (isValidGameState(parsed)) {
        const [recruitedCharacters, currency] = applyOfflineJobExp(parsed.recruitedCharacters);

        return {
          ...parsed,
          recruitedCharacters,
          protodermis: clamp(parsed.protodermis + currency, 0, parsed.protodermisCap),
        };
      }
    } catch (e) {
      console.error('Failed to parse game state:', e);
    }
  }
  return INITIAL_GAME_STATE;
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

function isValidGameState(data: GameState): data is typeof INITIAL_GAME_STATE {
  return (
    data &&
    typeof data === 'object' &&
    data.version === CURRENT_GAME_STATE_VERSION &&
    typeof data.protodermis === 'number' &&
    Array.isArray(data.recruitedCharacters)
  );
}
