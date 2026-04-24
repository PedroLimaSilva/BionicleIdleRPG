import { useEffect } from 'react';
import { STORAGE_KEY } from '../services/gamePersistence';
import { PartialGameState } from '../types/GameState';

export function useGamePersistence({
  activeQuests,
  collectedKrana,
  completedQuests,
  kraataCollection,
  protodermis,
  protodermisCap,
  rahkshi,
  recruitedCharacters,
  version,
}: PartialGameState) {
  useEffect(() => {
    const stateToSave: PartialGameState = {
      activeQuests,
      collectedKrana,
      completedQuests,
      kraataCollection,
      protodermis,
      protodermisCap,
      rahkshi,
      recruitedCharacters,
      version,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    version,
    protodermis,
    protodermisCap,
    collectedKrana,
    kraataCollection,
    rahkshi,
    recruitedCharacters,
    activeQuests,
    completedQuests,
  ]);
}
