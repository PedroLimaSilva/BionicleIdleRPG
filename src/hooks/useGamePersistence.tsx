import { useCallback, useEffect, useRef } from 'react';
import { saveGameState } from '../services/gamePersistence';
import { PartialGameState } from '../types/GameState';
import { isTestMode } from '../utils/testMode';

const SAVE_DEBOUNCE_MS = 3000;

export function useGamePersistence({
  activeQuests,
  collectedKrana,
  completedQuests,
  customCharacters,
  kraataCollection,
  protodermis,
  protodermisCap,
  rahkshi,
  recruitedCharacters,
  version,
}: PartialGameState) {
  const stateRef = useRef<PartialGameState>({
    activeQuests,
    collectedKrana,
    completedQuests,
    customCharacters,
    kraataCollection,
    protodermis,
    protodermisCap,
    rahkshi,
    recruitedCharacters,
    version,
  });

  stateRef.current = {
    activeQuests,
    collectedKrana,
    completedQuests,
    customCharacters,
    kraataCollection,
    protodermis,
    protodermisCap,
    rahkshi,
    recruitedCharacters,
    version,
  };

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushSave = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    saveGameState(stateRef.current);
  }, []);

  const scheduleSave = useCallback(() => {
    if (isTestMode()) {
      flushSave();
      return;
    }

    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      saveGameState(stateRef.current);
    }, SAVE_DEBOUNCE_MS);
  }, [flushSave]);

  useEffect(() => {
    scheduleSave();

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [
    version,
    protodermis,
    protodermisCap,
    collectedKrana,
    kraataCollection,
    rahkshi,
    recruitedCharacters,
    customCharacters,
    activeQuests,
    completedQuests,
    scheduleSave,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushSave();
      }
    };

    const handleBeforeUnload = () => {
      flushSave();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [flushSave]);
}
