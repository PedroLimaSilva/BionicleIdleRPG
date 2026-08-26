import { CavernArenaScene } from '../shared/CavernArena';
import { MANGAIA_PALETTE } from './palette';
import type { ArenaSceneProps } from '../types';

export function MangaiaArenaScene({ receiveShadow }: ArenaSceneProps) {
  return <CavernArenaScene palette={MANGAIA_PALETTE} receiveShadow={receiveShadow} />;
}
