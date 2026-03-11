// hooks/useQuestState.ts

import { useState } from 'react';
import { Quest, QuestProgress } from '../types/Quests';
import { RecruitedCharacterData } from '../types/Matoran';
import { getDebugMode } from '../services/gamePersistence';

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000); // seconds
}

interface UseQuestStateOptions {
  initialActive: QuestProgress[];
  initialCompleted: string[];
  getCharacters: () => RecruitedCharacterData[];
  setRecruitedCharacters: React.Dispatch<React.SetStateAction<RecruitedCharacterData[]>>;
  addProtodermis: (amount: number) => void;
}

export const useQuestState = ({
  initialActive,
  initialCompleted,
  getCharacters,
  setRecruitedCharacters,
  addProtodermis,
}: UseQuestStateOptions) => {
  const [activeQuests, setActiveQuests] = useState<QuestProgress[]>(initialActive);
  const [completedQuests, setCompletedQuestIds] = useState<string[]>(initialCompleted);

  const startQuest = (quest: Quest, assignedMatoran: RecruitedCharacterData['id'][]) => {
    const characters = getCharacters();
    // Guard: do not assign quest to characters who already have an ongoing quest
    const busy = assignedMatoran.filter((id) => {
      const char = characters.find((c) => c.id === id);
      return char?.quest;
    });
    if (busy.length > 0) return;

    const now = getCurrentTimestamp();
    const endsAt = now + (getDebugMode() ? 1 : quest.durationSeconds);

    const activeQuest = {
      questId: quest.id,
      startedAt: now,
      endsAt,
      assignedMatoran,
    };

    setActiveQuests((prev) => [...prev, activeQuest]);

    const updatedCharacters = characters.map((char) =>
      assignedMatoran.includes(char.id)
        ? { ...char, quest: activeQuest.questId, assignment: undefined }
        : char
    );

    setRecruitedCharacters(updatedCharacters);
  };

  const completeQuest = (quest: Quest) => {
    const active = activeQuests.find((q) => q.questId === quest.id);
    if (!active) return;

    // Buyable characters are derived from completedQuests + recruitedCharacters (see getBuyableCharacters).
    // No need to update any list here.

    setRecruitedCharacters((prev) =>
      prev.map((char) => {
        if (active.assignedMatoran.includes(char.id)) {
          return {
            ...char,
            quest: undefined,
            exp: char.exp + (quest.rewards.xpPerMatoran ?? 0),
          };
        }
        return char;
      })
    );

    addProtodermis(quest.rewards.currency || 0);
    // Mark as complete
    setActiveQuests((prev) => prev.filter((q) => q.questId !== quest.id));
    setCompletedQuestIds((prev) => [...prev, quest.id]);
  };

  const cancelQuest = (questId: string) => {
    const quest = activeQuests.find((q) => q.questId === questId);
    if (!quest) return;

    const characters = getCharacters();
    const updatedCharacters = characters.map((char) =>
      quest.assignedMatoran.includes(char.id) ? { ...char, quest: undefined } : char
    );

    setRecruitedCharacters(updatedCharacters);
    setActiveQuests((prev) => prev.filter((q) => q.questId !== questId));
  };

  const setCompletedQuests = (ids: string[]) => {
    setCompletedQuestIds(ids);
  };

  return {
    activeQuests,
    completedQuests,
    setCompletedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
  };
};
