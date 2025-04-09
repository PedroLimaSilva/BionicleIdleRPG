import {
  CURRENT_GAME_STATE_VERSION,
  INITIAL_GAME_STATE,
} from '../data/gameState';
import { GameItemId } from '../data/loot';
import { applyOfflineJobExp } from '../game/Jobs';
import { GameState } from '../types/GameState';

export const STORAGE_KEY = `GAME_STATE`;

export function resetGameData() {
  localStorage.setItem(STORAGE_KEY, '');
  window.location.reload();
}

export function loadGameState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isValidGameState(parsed)) {
        const [recruitedCharacters, logs, currency, loot] = applyOfflineJobExp(
          parsed.recruitedCharacters
        );

        Object.entries(loot).forEach(([item, amount]) => {
          const itemId = item as GameItemId;
          parsed.inventory[itemId] =
            (parsed.inventory[itemId] || 0) + (amount as number);
        });

        return {
          ...parsed,
          recruitedCharacters,
          widgets: parsed.widgets + currency,
          activityLog: logs,
        };
      }
    } catch (e) {
      console.error('Failed to parse game state:', e);
    }
  }
  return INITIAL_GAME_STATE;
}

function isValidGameState(data: GameState): data is typeof INITIAL_GAME_STATE {
  return (
    data &&
    typeof data === 'object' &&
    data.version === CURRENT_GAME_STATE_VERSION &&
    typeof data.widgets === 'number' &&
    typeof data.inventory === 'object' &&
    Array.isArray(data.recruitedCharacters)
  );
}
