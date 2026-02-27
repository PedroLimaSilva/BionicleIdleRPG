// hooks/useQuestState.ts

import { useState } from 'react';
import { Quest, QuestProgress } from '../types/Quests';
import { ListedCharacterData, RecruitedCharacterData } from '../types/Matoran';
import { QUESTS } from '../data/quests';
import { GameItemId } from '../data/loot';
import { getDebugMode } from '../services/gamePersistence';

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000); // seconds
}

interface UseQuestStateOptions {
  initialActive: QuestProgress[];
  initialCompleted: string[];
  characters: RecruitedCharacterData[];
  addItemToInventory: (item: GameItemId, amount: number) => void;
  setRecruitedCharacters: React.Dispatch<React.SetStateAction<RecruitedCharacterData[]>>;
  setBuyableCharacters: React.Dispatch<React.SetStateAction<ListedCharacterData[]>>;
  addProtodermis: (amount: number) => void;
}

export const useQuestState = ({
  initialActive,
  initialCompleted,
  characters,
  addItemToInventory,
  setRecruitedCharacters,
  setBuyableCharacters,
  addProtodermis,
}: UseQuestStateOptions) => {
  const [activeQuests, setActiveQuests] = useState<QuestProgress[]>(initialActive);
  const [completedQuests, setCompletedQuestIds] = useState<string[]>(initialCompleted);

  const startQuest = (quest: Quest, assignedMatoran: RecruitedCharacterData['id'][]) => {
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

    // Remove required Items
    if (quest.requirements.items) {
      quest.requirements.items.forEach((req) => {
        addItemToInventory(req.id as GameItemId, req.consumed ? -req.amount : 0);
      });
    }

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

    // Apply rewards
    if (quest.rewards.loot) {
      Object.entries(quest.rewards.loot).forEach(([item, amount]) => {
        addItemToInventory(item as GameItemId, amount);
      });
    }

    let unlockedCharacters: ListedCharacterData[] = [];
    if (quest.rewards.unlockCharacters) {
      unlockedCharacters = quest.rewards.unlockCharacters;
    }

    setBuyableCharacters((prev) => [
      ...unlockedCharacters.filter((u) => !prev.some((p) => p.id === u.id)),
      ...prev,
    ]);

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

    const updatedCharacters = characters.map((char) =>
      quest.assignedMatoran.includes(char.id) ? { ...char, quest: undefined } : char
    );

    // restore required Items
    const requirements = QUESTS.find((q) => q.id === quest.questId)?.requirements;
    if (requirements && requirements.items) {
      requirements.items.forEach((req) => {
        addItemToInventory(req.id as GameItemId, req.consumed ? req.amount : 0);
      });
    }

    setRecruitedCharacters(updatedCharacters);
    setActiveQuests((prev) => prev.filter((q) => q.questId !== questId));
  };

  return {
    activeQuests,
    completedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
  };
};
