import { desertArena } from './desert/desertArena';
import type { ArenaDefinition, ArenaId } from './types';

export const DEFAULT_ARENA_ID: ArenaId = 'desert';

const ARENA_REGISTRY: Record<ArenaId, ArenaDefinition> = {
  desert: desertArena,
};

export function getArenaDefinition(id: ArenaId = DEFAULT_ARENA_ID): ArenaDefinition {
  return ARENA_REGISTRY[id];
}

export function getArenaIds(): ArenaId[] {
  return Object.keys(ARENA_REGISTRY) as ArenaId[];
}
