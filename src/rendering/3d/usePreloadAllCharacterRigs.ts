import { useEffect } from 'react';
import { isTestMode } from '../../utils/testMode';
import { preloadAllCharacterRigs } from './preloadCharacterRigs';

function shouldSkipCharacterRigPreload(): boolean {
  return isTestMode() || import.meta.env.MODE === 'test';
}

/** Character Dex ignores recruitment — warm every unique rig used by the static dex. */
export function usePreloadAllCharacterRigs() {
  useEffect(() => {
    if (shouldSkipCharacterRigPreload()) return;
    preloadAllCharacterRigs();
  }, []);
}
