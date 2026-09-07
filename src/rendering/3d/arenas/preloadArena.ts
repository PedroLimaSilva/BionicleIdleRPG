import { useGLTF } from '@react-three/drei';
import { getArenaDefinition } from './registry';
import type { ArenaId } from './types';

/** Kick off GLB download for an arena (no-op when the biome is procedural-only). */
export function preloadArena(arenaId: ArenaId): void {
  const { glbUrl } = getArenaDefinition(arenaId);
  if (glbUrl) {
    useGLTF.preload(glbUrl);
  }
}
