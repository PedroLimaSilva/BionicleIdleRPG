import { useGLTF } from '@react-three/drei';
import {
  allCharacterRigGlbUrls,
  characterRigGlbUrlsForProgress,
  type StoryProgressForRigs,
} from './characterRigGlbs';

const preloaded = new Set<string>();

/** Fetch + Draco-decode character rigs into drei's GLTF cache. Idempotent. */
export function preloadCharacterRigUrls(urls: readonly string[]): void {
  for (const url of urls) {
    if (preloaded.has(url)) continue;
    preloaded.add(url);
    useGLTF.preload(url);
  }
}

export function preloadCharacterRigsForProgress(progress: StoryProgressForRigs): string[] {
  performance.mark('preloadCharacterRigs:start');
  const urls = characterRigGlbUrlsForProgress(progress);
  preloadCharacterRigUrls(urls);
  performance.mark('preloadCharacterRigs:end');
  performance.measure(
    'preloadCharacterRigs',
    'preloadCharacterRigs:start',
    'preloadCharacterRigs:end'
  );
  return urls;
}

export function preloadAllCharacterRigs(): string[] {
  performance.mark('preloadAllCharacterRigs:start');
  const urls = allCharacterRigGlbUrls();
  preloadCharacterRigUrls(urls);
  performance.mark('preloadAllCharacterRigs:end');
  performance.measure(
    'preloadAllCharacterRigs',
    'preloadAllCharacterRigs:start',
    'preloadAllCharacterRigs:end'
  );
  return urls;
}

export function resetCharacterRigPreloadForTests(): void {
  preloaded.clear();
}
