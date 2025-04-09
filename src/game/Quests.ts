import { Quest } from '../types/Quests';

export function getAvailableQuests(
  allQuests: Quest[],
  completedQuestIds: string[],
  activeQuestIds: string[]
): Quest[] {
  return allQuests.filter((quest) => {
    const isUnlocked =
      !quest.unlockedAfter ||
      quest.unlockedAfter.every((id) => completedQuestIds.includes(id));
    const isNotStarted = !activeQuestIds.includes(quest.id);
    const isNotCompleted = !completedQuestIds.includes(quest.id);

    return isUnlocked && isNotStarted && isNotCompleted;
  });
}
