// hooks/useQuestState.ts

import { useState } from 'react';
import { Quest, QuestProgress } from '../types/Quests';
import { Matoran, MatoranStatus, RecruitedMatoran } from '../types/Matoran';
import { GameState } from '../types/GameState';
import { LogType } from '../types/Logging';
import { UNLOCKABLE_CHARACTERS } from '../data/matoran';
import { QUESTS } from '../data/quests';
import { GameItemId } from '../data/loot';

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000); // seconds
}

interface UseQuestStateOptions {
  initialActive: QuestProgress[];
  initialCompleted: string[];
  characters: RecruitedMatoran[];
  addItemToInventory: (item: GameItemId, amount: number) => void;
  setRecruitedCharacters: React.Dispatch<
    React.SetStateAction<RecruitedMatoran[]>
  >;
  addActivityLog: GameState['addActivityLog'];
  addWidgets: (widgets: number) => void;
}

export const useQuestState = ({
  initialActive,
  initialCompleted,
  characters,
  addItemToInventory,
  setRecruitedCharacters,
  addWidgets,
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

    // Remove required Items
    if (quest.requirements.items) {
      quest.requirements.items.forEach((req) => {
        addItemToInventory(
          req.id as GameItemId,
          req.consumed ? -req.amount : 0
        );
      });
    }

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
      Object.entries(quest.rewards.loot).forEach(([item, amount]) => {
        addItemToInventory(item as GameItemId, amount);
      });
    }

    let newRecruits: RecruitedMatoran[] = [];
    if (quest.rewards.unlockCharacters) {
      if (quest.rewards.unlockCharacters) {
        newRecruits = quest.rewards.unlockCharacters.map((id) => {
          const listed = UNLOCKABLE_CHARACTERS[id];
          const recruited: RecruitedMatoran = {
            ...listed,
            exp: 0,
            quest: undefined,
            assignment: undefined,
            status: MatoranStatus.Recruited,
          };
          return recruited;
        });
      }
    }

    // Reassign Matoran
    setRecruitedCharacters((prev) => {
      const updated = prev.map((char) =>
        active.assignedMatoran.includes(char.id)
          ? {
              ...char,
              quest: undefined,
              exp: char.exp + (quest.rewards.xpPerMatoran ?? 0),
            }
          : char
      );

      return [...updated, ...newRecruits];
    });

    addWidgets(quest.rewards.currency || 0);
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

    // restore required Items
    const requirements = QUESTS.find(
      (q) => q.id === quest.questId
    )?.requirements;
    if (requirements && requirements.items) {
      requirements.items.forEach((req) => {
        addItemToInventory(req.id as GameItemId, req.consumed ? req.amount : 0);
      });
    }

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
