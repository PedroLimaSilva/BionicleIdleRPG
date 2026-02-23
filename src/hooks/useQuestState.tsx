// hooks/useQuestState.ts

import { useState } from 'react';
import { Quest, QuestProgress } from '../types/Quests';
import { ListedCharacterData, RecruitedCharacterData } from '../types/Matoran';
import { GameState } from '../types/GameState';
import { LogType } from '../types/Logging';
import { QUESTS } from '../data/quests';
import { GameItemId } from '../data/loot';
import { LegoColor } from '../types/Colors';
import { isToaMata, isToaNuva } from '../services/matoranUtils';
import { MATORAN_DEX } from '../data/matoran';
import {
  BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
  BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
} from '../game/nuvaSymbols';
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
  addActivityLog: GameState['addActivityLog'];
  addWidgets: (widgets: number) => void;
}

export const useQuestState = ({
  initialActive,
  initialCompleted,
  characters,
  addItemToInventory,
  setRecruitedCharacters,
  setBuyableCharacters,
  addWidgets,
  addActivityLog,
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

    let unlockedCharacters: ListedCharacterData[] = [];
    if (quest.rewards.unlockCharacters) {
      unlockedCharacters = quest.rewards.unlockCharacters;
    }

    setBuyableCharacters((prev) => [
      ...unlockedCharacters.filter((u) => !prev.some((p) => p.id === u.id)),
      ...prev,
    ]);

    // Reassign Matoran with updated exp and evolution
    const evolution = quest.rewards.evolution;
    const evolvedIds = evolution
      ? active.assignedMatoran.filter((id) => evolution[id]).map((id) => evolution[id])
      : [];

    setRecruitedCharacters((prev) => {
      let updated = prev.map((char) => {
        if (active.assignedMatoran.includes(char.id)) {
          const evolvedId = evolution?.[char.id];
          const xp = char.exp + (quest.rewards.xpPerMatoran ?? 0);

          if (evolvedId) {
            return {
              id: evolvedId,
              exp: xp,
              assignment: undefined,
              quest: undefined,
            };
          }

          return {
            ...char,
            quest: undefined,
            exp: xp,
          };
        } else if (
          (quest.id === 'mnog_kini_nui_arrival' || quest.id === 'mnog_gali_call') &&
          isToaMata(MATORAN_DEX[char.id])
        ) {
          return {
            ...char,
            maskColorOverride: LegoColor.PearlGold,
          };
        }
        return char;
      });

      // Update Toa Nuva mask overrides when Bohrok Kal quests complete
      if (
        quest.id === BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID ||
        quest.id === BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID
      ) {
        updated = updated.map((char) => {
          if (!isToaNuva(MATORAN_DEX[char.id])) return char;
          if (quest.id === BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID) {
            return { ...char, maskColorOverride: LegoColor.LightGray };
          }
          const { maskColorOverride: _, ...rest } = char;
          return rest;
        });
      }

      return updated;
    });

    if (evolvedIds.length > 0) {
      const names = evolvedIds.map((id) => MATORAN_DEX[id]?.name ?? id).join(', ');
      addActivityLog(`${names} evolved!`, LogType.Event);
    }

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
