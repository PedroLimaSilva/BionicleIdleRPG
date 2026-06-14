import { useGLTF } from '@react-three/drei';
import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { getTribeRecolor } from '../arenaRecolor';
import { DesertArenaAtmosphere } from './DesertArenaAtmosphere';
import { DesertArenaScene } from './DesertArenaScene';
import type { ArenaDefinition } from '../types';

const GLB_URL = import.meta.env.BASE_URL + '/arena_blockout.glb';

export const desertArena: ArenaDefinition = {
  Atmosphere: DesertArenaAtmosphere,
  glbUrl: GLB_URL,
  id: 'desert',
  layout: DEFAULT_ARENA_LAYOUT,
  recolorForTribe: getTribeRecolor,
  Scene: DesertArenaScene,
};

useGLTF.preload(GLB_URL);
