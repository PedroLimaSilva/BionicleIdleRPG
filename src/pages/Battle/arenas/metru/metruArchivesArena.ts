import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { MetruArchivesAtmosphere } from './MetruArchivesAtmosphere';
import { MetruArchivesScene } from './MetruArchivesScene';
import type { ArenaDefinition, ArenaLayout } from '../types';

const METRU_ARCHIVES_LAYOUT: ArenaLayout = {
  ...DEFAULT_ARENA_LAYOUT,
  cameraLandscape: [0.6, 0.7, 0.95],
  cameraPortrait: [0.25, 1.0, 1.35],
};

/** Underground Metru Nui (Archives) — the daytime biome rendered deep underground. */
export const metruArchivesArena: ArenaDefinition = {
  Atmosphere: MetruArchivesAtmosphere,
  id: 'metru_archives',
  layout: METRU_ARCHIVES_LAYOUT,
  Scene: MetruArchivesScene,
};
