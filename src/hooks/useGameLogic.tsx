import { useState } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useInventoryState } from './useInventoryState';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useActivityLogState } from './useActivityLogState';
import { useGamePersistence } from './useGamePersistence';
import { GameState } from '../types/GameState';
import { useQuestState } from './useQuestState';
import { useBattleState } from './useBattleState';

export const useGameLogic = (): GameState => {
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);

  const { inventory, addItemToInventory } = useInventoryState(
    initialState.inventory
  );

  const [widgets, setWidgets] = useState(initialState.widgets);

  const {
    recruitedCharacters,
    setRecruitedCharacters,
    setBuyableCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    setMaskOverride,
  } = useCharactersState(
    initialState.recruitedCharacters,
    initialState.buyableCharacters,
    widgets,
    setWidgets,
    addItemToInventory
  );

  const {
    activityLog,
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
  } = useActivityLogState(initialState.activityLog);

  useJobTickEffect(
    recruitedCharacters,
    setRecruitedCharacters,
    (amount) => setWidgets((prev) => prev + amount),
    addItemToInventory,
    addActivityLog
  );

  const {
    activeQuests,
    completedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
  } = useQuestState({
    initialActive: initialState.activeQuests,
    initialCompleted: initialState.completedQuests,
    characters: recruitedCharacters,
    addItemToInventory,
    setRecruitedCharacters,
    setBuyableCharacters,
    addWidgets: (widgets: number) => {
      setWidgets((prev) => prev + widgets);
    },
    addActivityLog,
  });

  const battle = useBattleState();

  // Auto-save when critical state changes
  useGamePersistence({
    version,
    widgets,
    inventory,
    recruitedCharacters,
    buyableCharacters: buyableCharacters,
    activeQuests,
    completedQuests,
  });

  return {
    version,
    activeQuests,
    completedQuests,
    activityLog,
    widgets,
    inventory,
    recruitedCharacters,
    buyableCharacters: buyableCharacters,
    addItemToInventory,
    recruitCharacter,
    setMaskOverride,
    assignJobToMatoran,
    removeJobFromMatoran,
    startQuest,
    cancelQuest,
    completeQuest,
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
    battle,
  };
};
