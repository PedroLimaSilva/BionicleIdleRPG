import { useEffect, useState, type ReactNode } from 'react';
import { isTestMode } from '../../utils/testMode';
import { AssetLoadGatePanel } from './AssetLoadGatePanel';
import { preloadAllCharacterRigs, type CharacterRigPreloadProgress } from './preloadCharacterRigs';

function shouldSkipCharacterRigPreload(): boolean {
  return isTestMode() || import.meta.env.MODE === 'test';
}

/** Character Dex ignores recruitment — wait until every unique dex rig is decoded. */
export function usePreloadAllCharacterRigs(): {
  panel: ReactNode | null;
  ready: boolean;
} {
  const skip = shouldSkipCharacterRigPreload();
  const [ready, setReady] = useState(skip);
  const [progress, setProgress] = useState<CharacterRigPreloadProgress>({ loaded: 0, total: 0 });

  useEffect(() => {
    if (skip) return undefined;
    let cancelled = false;
    void preloadAllCharacterRigs((next) => {
      if (!cancelled) setProgress(next);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [skip]);

  if (ready) return { panel: null, ready: true };

  const { loaded, total } = progress;
  const text = total > 0 ? `Loading characters… ${loaded}/${total}` : 'Loading characters…';
  return {
    panel: <AssetLoadGatePanel loaded={loaded} text={text} total={total} />,
    ready: false,
  };
}
