import { useEffect } from 'react';
import { STORAGE_KEY } from '../services/gamePersistence';
import { PartialGameState } from '../types/GameState';

export function useGamePersistence({
  version,
  protodermis,
  protodermisCap,
  collectedKrana,
  kraataCollection,
  kraataTransformations,
  recruitedCharacters,
  buyableCharacters,
  activeQuests,
  completedQuests,
}: PartialGameState) {
  useEffect(() => {
    const stateToSave: PartialGameState = {
      version,
      protodermis,
      protodermisCap,
      collectedKrana,
      kraataCollection,
      kraataTransformations,
      recruitedCharacters,
      buyableCharacters: buyableCharacters,
      activeQuests,
      completedQuests,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    version,
    protodermis,
    protodermisCap,
    collectedKrana,
    kraataCollection,
    kraataTransformations,
    buyableCharacters,
    recruitedCharacters,
    activeQuests,
    completedQuests,
  ]);
}
