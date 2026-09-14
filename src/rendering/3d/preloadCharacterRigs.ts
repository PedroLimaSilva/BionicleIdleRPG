import { useGLTF } from '@react-three/drei';
import { peek } from 'suspend-react';
import { GLTFLoader } from 'three-stdlib';
import { characterRigGlbUrlsForProgress, type StoryProgressForRigs } from './characterRigGlbs';

const started = new Set<string>();
const ready = new Set<string>();

const DECODE_WAIT_MS = 30_000;
const PEEK_POLL_MS = 32;

export type CharacterRigPreloadProgress = {
  loaded: number;
  total: number;
};

function isJest(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
}

function isDreiCached(url: string): boolean {
  return peek([GLTFLoader, url]) !== undefined;
}

function waitForDreiCache(url: string): Promise<void> {
  if (isJest() || isDreiCached(url)) return Promise.resolve();

  return new Promise((resolve) => {
    const deadline = Date.now() + DECODE_WAIT_MS;
    const poll = () => {
      if (isDreiCached(url) || Date.now() >= deadline) {
        if (!isDreiCached(url)) {
          console.warn(`[preloadCharacterRigs] timed out waiting for ${url}`);
        }
        resolve();
        return;
      }
      window.setTimeout(poll, PEEK_POLL_MS);
    };
    poll();
  });
}

/**
 * Fetch + Draco-decode character rigs into drei's GLTF cache.
 * Each URL completes independently (progress ticks per arrival). Idempotent.
 */
export async function preloadCharacterRigUrls(
  urls: readonly string[],
  onProgress?: (progress: CharacterRigPreloadProgress) => void
): Promise<string[]> {
  const unique = [...new Set(urls)];
  const total = unique.length;
  let loaded = unique.filter((url) => ready.has(url)).length;
  onProgress?.({ loaded, total });

  const pending = unique.filter((url) => !ready.has(url));
  for (const url of pending) {
    if (!started.has(url)) {
      started.add(url);
      useGLTF.preload(url);
    }
  }

  await Promise.all(
    pending.map(async (url) => {
      await waitForDreiCache(url);
      ready.add(url);
      loaded += 1;
      onProgress?.({ loaded, total });
    })
  );

  return unique;
}

export async function preloadCharacterRigsForProgress(
  progress: StoryProgressForRigs,
  onProgress?: (progress: CharacterRigPreloadProgress) => void
): Promise<string[]> {
  performance.mark('preloadCharacterRigs:start');
  const urls = characterRigGlbUrlsForProgress(progress);
  await preloadCharacterRigUrls(urls, onProgress);
  performance.mark('preloadCharacterRigs:end');
  performance.measure(
    'preloadCharacterRigs',
    'preloadCharacterRigs:start',
    'preloadCharacterRigs:end'
  );
  return urls;
}

export function resetCharacterRigPreloadForTests(): void {
  started.clear();
  ready.clear();
}
