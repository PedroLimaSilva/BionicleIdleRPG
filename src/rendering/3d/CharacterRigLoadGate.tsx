import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';
import { AssetLoadGatePanel } from './AssetLoadGatePanel';
import {
  preloadCharacterRigsForProgress,
  type CharacterRigPreloadProgress,
} from './preloadCharacterRigs';

function shouldSkipCharacterRigPreload(): boolean {
  return isTestMode() || import.meta.env.MODE === 'test';
}

/**
 * After save load, wait for story-progress character rigs to fetch + decode
 * before showing the app. Later roster/quest changes warm in the background.
 */
export function CharacterRigLoadGate({ children }: { children: ReactNode }) {
  const { completedQuests, recruitedCharacters } = useGame();
  const progressRef = useRef({ completedQuests, recruitedCharacters });
  progressRef.current = { completedQuests, recruitedCharacters };
  const progressKey = `${completedQuests.join(',')}::${recruitedCharacters
    .map(
      (character) => `${character.id}:${character.stage ?? ''}:${character.customMataModelId ?? ''}`
    )
    .join(',')}`;

  const skip = shouldSkipCharacterRigPreload();
  const [ready, setReady] = useState(skip);
  const [progress, setProgress] = useState<CharacterRigPreloadProgress>({ loaded: 0, total: 0 });

  useEffect(() => {
    if (skip) return undefined;
    let cancelled = false;
    void preloadCharacterRigsForProgress(progressRef.current, (next) => {
      if (!cancelled) setProgress(next);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
    // First paint after save load only — later unlocks must not re-cover the app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skip || !ready) return;
    void preloadCharacterRigsForProgress(progressRef.current);
  }, [progressKey, ready, skip]);

  if (!ready) {
    const { loaded, total } = progress;
    const text = total > 0 ? `Loading characters… ${loaded}/${total}` : 'Loading characters…';
    return <AssetLoadGatePanel loaded={loaded} text={text} total={total} />;
  }

  return children;
}
