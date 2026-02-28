import { CHRONICLES_BY_ID, type ChronicleId } from '../data/chronicles';
import { CHARACTER_DEX } from '../data/dex/index';
import type { ChronicleEntryWithState, ChronicleUnlockCondition } from '../types/Chronicle';
import type { GameState } from '../types/GameState';

export type ChronicleProgressContext = {
  completedQuests: GameState['completedQuests'];
};

export function getCharacterChronicle(
  characterId: string,
  progress: ChronicleProgressContext
): ChronicleEntryWithState[] {
  const base = CHARACTER_DEX[characterId];
  const chronicleId = base?.chronicleId;
  if (!chronicleId || !(chronicleId in CHRONICLES_BY_ID)) return [];

  const entries = CHRONICLES_BY_ID[chronicleId as ChronicleId];
  if (!entries?.length) return [];

  return entries.map((entry) => ({
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
