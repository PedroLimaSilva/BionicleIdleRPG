import { MNOG_QUEST_LINE } from '../data/quests/mnog';
import { GameState } from '../types/GameState';

export function areBattlesUnlocked(quests: GameState['completedQuests']) {
  return quests.includes(MNOG_QUEST_LINE[MNOG_QUEST_LINE.length - 1].id);
}
