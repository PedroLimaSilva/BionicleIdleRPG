import { MATORAN_DEX } from '../data/matoran';
import type { ChronicleEntryWithState, ChronicleUnlockCondition } from '../types/Chronicle';
import type { GameState } from '../types/GameState';

export type ChronicleProgressContext = {
  completedQuests: GameState['completedQuests'];
};

export function getCharacterChronicle(
  characterId: string,
  progress: ChronicleProgressContext
): ChronicleEntryWithState[] {
  const base = MATORAN_DEX[characterId];
  if (!base || !base.chronicle || base.chronicle.length === 0) {
    return [];
  }

  return base.chronicle.map((entry) => ({
    ...entry,
    isUnlocked: isChronicleEntryUnlocked(entry.unlockCondition, progress),
  }));
}

export function isChronicleEntryUnlocked(
  condition: ChronicleUnlockCondition,
  progress: ChronicleProgressContext
): boolean {
  switch (condition.type) {
    case 'QUEST_COMPLETED':
      return progress.completedQuests.includes(condition.questId);
    case 'QUESTS_COMPLETED_ALL':
      return condition.questIds.every((id) => progress.completedQuests.includes(id));
    default: {
      // Exhaustive check for future condition types
      const _exhaustive: never = condition;
      return _exhaustive;
    }
  }
}
