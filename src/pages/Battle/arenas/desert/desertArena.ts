import { useGLTF } from '@react-three/drei';
import { DesertArenaAtmosphere } from './DesertArenaAtmosphere';
import type { ArenaDefinition } from '../types';

const GLB_URL = import.meta.env.BASE_URL + '/arena_blockout.glb';

export const desertArena: ArenaDefinition = {
  Atmosphere: DesertArenaAtmosphere,
  glbUrl: GLB_URL,
  id: 'desert',
};

useGLTF.preload(GLB_URL);
