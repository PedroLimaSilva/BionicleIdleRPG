// hooks/useQuestState.ts

import { useState } from 'react';
import { Quest, QuestProgress } from '../types/Quests';
import { ListedMatoran, Matoran, RecruitedMatoran } from '../types/Matoran';
import { GameState } from '../types/GameState';
import { LogType } from '../types/Logging';
import { Inventory, mergeInventory } from '../services/inventoryUtils';
import { UNLOCKABLE_CHARACTERS } from '../data/matoran';

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000); // seconds
}

interface UseQuestStateOptions {
  initialActive: QuestProgress[];
  initialCompleted: string[];
  characters: RecruitedMatoran[];
  inventory: Inventory;
  setRecruitedCharacters: (RecruitedMatoran: RecruitedMatoran[]) => void;
  recruitCharacter: GameState['recruitCharacter'];
  addActivityLog: GameState['addActivityLog'];
}

export const useQuestState = ({
  initialActive,
  initialCompleted,
  characters,
  inventory,
  setRecruitedCharacters,
  recruitCharacter,
  addActivityLog,
}: UseQuestStateOptions) => {
  const [activeQuests, setActiveQuests] =
    useState<QuestProgress[]>(initialActive);
  const [completedQuests, setCompletedQuestIds] =
    useState<string[]>(initialCompleted);

  const startQuest = (quest: Quest, assignedMatoran: Matoran['id'][]) => {
    const now = getCurrentTimestamp();
    const endsAt = now + quest.durationSeconds;

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
    addActivityLog(`Started quest: ${quest.name}`, LogType.Event);
  };

  const completeQuest = (quest: Quest) => {
    const active = activeQuests.find((q) => q.questId === quest.id);
    if (!active) return;

    // Apply rewards
    if (quest.rewards.loot) {
      mergeInventory(inventory, quest.rewards.loot);
    }

    if (quest.rewards.unlockCharacters) {
      quest.rewards.unlockCharacters
        .map((charId) => {
          return UNLOCKABLE_CHARACTERS[charId] as ListedMatoran;
        })
        .forEach(recruitCharacter);
    }

    // Reassign Matoran
    const updatedCharacters = characters.map((char) =>
      active.assignedMatoran.includes(char.id)
        ? { ...char, quest: undefined }
        : char
    );

    setRecruitedCharacters(updatedCharacters);

    // Mark as complete
    setActiveQuests((prev) => prev.filter((q) => q.questId !== quest.id));
    setCompletedQuestIds((prev) => [...prev, quest.id]);

    addActivityLog(`Completed quest: ${quest.name}`, LogType.Event);
  };

  const cancelQuest = (questId: string) => {
    const quest = activeQuests.find((q) => q.questId === questId);
    if (!quest) return;

    const updatedCharacters = characters.map((char) =>
      quest.assignedMatoran.includes(char.id)
        ? { ...char, quest: undefined }
        : char
    );

    setRecruitedCharacters(updatedCharacters);
    setActiveQuests((prev) => prev.filter((q) => q.questId !== questId));
    addActivityLog(`Cancelled quest: ${questId}`, LogType.Event);
  };

  return {
    activeQuests,
    completedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
  };
};
