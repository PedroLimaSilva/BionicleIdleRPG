import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { MetruArenaAtmosphere } from './MetruArenaAtmosphere';
import { MetruArenaScene } from './MetruArenaScene';
import type { ArenaDefinition, ArenaLayout } from '../types';

const METRU_LAYOUT: ArenaLayout = {
  ...DEFAULT_ARENA_LAYOUT,
  cameraLandscape: [0.6, 0.7, 0.95],
  cameraPortrait: [0.25, 1.0, 1.35],
};

export const metruArena: ArenaDefinition = {
  Atmosphere: MetruArenaAtmosphere,
  id: 'metru',
  layout: METRU_LAYOUT,
  Scene: MetruArenaScene,
};
