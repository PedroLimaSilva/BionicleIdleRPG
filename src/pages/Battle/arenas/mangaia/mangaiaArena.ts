import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { MangaiaArenaAtmosphere } from './MangaiaArenaAtmosphere';
import { MangaiaArenaScene } from './MangaiaArenaScene';
import type { ArenaDefinition, ArenaLayout } from '../types';

/** Pulled-back, slightly raised framing so the beam and dome read as the focal point. */
const MANGAIA_LAYOUT: ArenaLayout = {
  ...DEFAULT_ARENA_LAYOUT,
  cameraLandscape: [0.6, 0.7, 0.95],
  cameraPortrait: [0.25, 1.0, 1.35],
};

export const mangaiaArena: ArenaDefinition = {
  Atmosphere: MangaiaArenaAtmosphere,
  id: 'mangaia',
  layout: MANGAIA_LAYOUT,
  Scene: MangaiaArenaScene,
};
