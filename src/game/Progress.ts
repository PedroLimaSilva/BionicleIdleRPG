import { GameState } from '../types/GameState';
import { BOHROK_KRANA_LEGEND_QUEST_ID } from './Krana';

export function areBattlesUnlocked(quests: GameState['completedQuests']) {
  // Battles become available once the Bohrok legend is revealed and
  // Krana collection is formally introduced.
  return quests.includes(BOHROK_KRANA_LEGEND_QUEST_ID);
}
