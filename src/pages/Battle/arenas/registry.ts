import { desertArena } from './desert/desertArena';
import { mangaiaArena } from './mangaia/mangaiaArena';
import { metruArena } from './metru/metruArena';
import { metruArchivesArena } from './metru/metruArchivesArena';
import type { ArenaDefinition, ArenaId } from './types';

export const DEFAULT_ARENA_ID: ArenaId = 'desert';

const ARENA_REGISTRY: Record<ArenaId, ArenaDefinition> = {
  desert: desertArena,
  mangaia: mangaiaArena,
  metru: metruArena,
  metru_archives: metruArchivesArena,
};

export function getArenaDefinition(id: ArenaId = DEFAULT_ARENA_ID): ArenaDefinition {
  return ARENA_REGISTRY[id] ?? ARENA_REGISTRY[DEFAULT_ARENA_ID];
}

export function getArenaIds(): ArenaId[] {
  return Object.keys(ARENA_REGISTRY) as ArenaId[];
}
