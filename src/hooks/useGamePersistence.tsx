import { useEffect } from 'react';
import { STORAGE_KEY } from '../services/gamePersistence';
import { GameState } from '../types/GameState';

type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'widgets'
  | 'inventory'
  | 'recruitedCharacters'
  | 'storyProgress'
  | 'availableCharacters'
>;

export function useGamePersistence({
  version,
  widgets,
  inventory,
  recruitedCharacters,
  availableCharacters,
  storyProgress,
}: PartialGameState) {
  useEffect(() => {
    const stateToSave: PartialGameState = {
      version,
      widgets,
      inventory,
      recruitedCharacters,
      availableCharacters,
      storyProgress,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    version,
    widgets,
    inventory,
    availableCharacters,
    recruitedCharacters,
    storyProgress,
  ]);
}
