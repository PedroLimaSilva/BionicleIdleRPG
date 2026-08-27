import { useGLTF } from '@react-three/drei';
import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { getTribeRecolor } from '../arenaRecolor';
import { DesertArenaAtmosphere } from './DesertArenaAtmosphere';
import { DesertArenaScene } from './DesertArenaScene';
import type { ArenaDefinition, ArenaLayout } from '../types';

const GLB_URL = import.meta.env.BASE_URL + '/arena_desert.glb';

/** Pull back and aim up slightly so the canyon monuments and blue sky read. */
const DESERT_LAYOUT: ArenaLayout = {
  ...DEFAULT_ARENA_LAYOUT,
  boxSize: 3.3,
  cameraLandscape: [0.7, 0.42, 0.78],
  cameraPortrait: [0.3, 0.62, 1.15],
  lookAtHeight: 0.7,
};

export const desertArena: ArenaDefinition = {
  Atmosphere: DesertArenaAtmosphere,
  glbUrl: GLB_URL,
  id: 'desert',
  layout: DESERT_LAYOUT,
  recolorForTribe: getTribeRecolor,
  Scene: DesertArenaScene,
};

useGLTF.preload(GLB_URL);
