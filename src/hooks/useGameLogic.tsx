import { useState } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useInventoryState } from './useInventoryState';
import { StoryProgression } from '../game/story';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useActivityLogState } from './useActivityLogState';
import { useGamePersistence } from './useGamePersistence';
import { GameState } from '../types/GameState';

export const useGameLogic = (): GameState => {
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);
  const [storyProgress] = useState<StoryProgression[]>(
    initialState.storyProgress
  );

  const { inventory, addItemToInventory } = useInventoryState(
    initialState.inventory
  );

  // The following will be replaced as more hooks are split out:
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

  // Auto-save when critical state changes
  useGamePersistence({
    version,
    widgets,
    inventory,
    recruitedCharacters,
    availableCharacters,
    storyProgress,
  });

  return {
    version,
    storyProgress,
    activityLog,
    widgets,
    inventory,
    recruitedCharacters,
    availableCharacters,
    addItemToInventory,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
  };
};
