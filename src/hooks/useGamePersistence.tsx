import { useEffect } from 'react';
import { STORAGE_KEY } from '../services/gamePersistence';
import { GameState } from '../types/GameState';

type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'widgets'
  | 'inventory'
  | 'availableCharacters'
  | 'recruitedCharacters'
  | 'activeQuests'
  | 'completedQuests'
>;

export function useGamePersistence({
  version,
  widgets,
  inventory,
  recruitedCharacters,
  availableCharacters,
  activeQuests,
  completedQuests,
}: PartialGameState) {
  useEffect(() => {
    const stateToSave: PartialGameState = {
      version,
      widgets,
      inventory,
      recruitedCharacters,
      availableCharacters,
      activeQuests,
      completedQuests,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    version,
    widgets,
    inventory,
    availableCharacters,
    recruitedCharacters,
    activeQuests,
    completedQuests,
  ]);
}
