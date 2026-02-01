import { useEffect } from 'react';
import { STORAGE_KEY } from '../services/gamePersistence';
import { PartialGameState } from '../types/GameState';

export function useGamePersistence({
  version,
  widgets,
  inventory,
  recruitedCharacters,
  buyableCharacters,
  activeQuests,
  completedQuests,
}: PartialGameState) {
  useEffect(() => {
    const stateToSave: PartialGameState = {
      version,
      widgets,
      inventory,
      recruitedCharacters,
      buyableCharacters: buyableCharacters,
      activeQuests,
      completedQuests,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    version,
    widgets,
    inventory,
    buyableCharacters,
    recruitedCharacters,
    activeQuests,
    completedQuests,
  ]);
}
