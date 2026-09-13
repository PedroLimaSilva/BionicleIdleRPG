import { useEffect, useRef } from 'react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';
import { preloadCharacterRigsForProgress } from './preloadCharacterRigs';

function shouldSkipCharacterRigPreload(): boolean {
  return isTestMode() || import.meta.env.MODE === 'test';
}

/** Warms character-rig GLBs for the current save (roster + story-unlocked evolutions). */
export function StoryCharacterRigPreloader() {
  const { completedQuests, recruitedCharacters } = useGame();
  const progressRef = useRef({ completedQuests, recruitedCharacters });
  progressRef.current = { completedQuests, recruitedCharacters };
  const progressKey = `${completedQuests.join(',')}::${recruitedCharacters
    .map(
      (character) => `${character.id}:${character.stage ?? ''}:${character.customMataModelId ?? ''}`
    )
    .join(',')}`;

  useEffect(() => {
    if (shouldSkipCharacterRigPreload()) return;
    preloadCharacterRigsForProgress(progressRef.current);
  }, [progressKey]);

  return null;
}
