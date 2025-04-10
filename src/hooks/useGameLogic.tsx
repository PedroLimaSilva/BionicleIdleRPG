import { useState } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useInventoryState } from './useInventoryState';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useActivityLogState } from './useActivityLogState';
import { useGamePersistence } from './useGamePersistence';
import { GameState } from '../types/GameState';
import { useQuestState } from './useQuestState';

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
    availableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
  } = useCharactersState(
    initialState.recruitedCharacters,
    initialState.availableCharacters,
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
    addWidgets: (widgets: number) => {
      setWidgets((prev) => prev + widgets);
    },
    addActivityLog,
  });

  // Auto-save when critical state changes
  useGamePersistence({
    version,
    widgets,
    inventory,
    recruitedCharacters,
    availableCharacters,
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
    availableCharacters,
    addItemToInventory,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    startQuest,
    cancelQuest,
    completeQuest,
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
  };
};
