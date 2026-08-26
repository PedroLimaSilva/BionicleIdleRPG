import { CavernArenaScene } from '../shared/CavernArena';
import { METRU_DAY_PALETTE } from './palette';
import type { ArenaSceneProps } from '../types';

export function MetruArenaScene({ receiveShadow }: ArenaSceneProps) {
  return <CavernArenaScene palette={METRU_DAY_PALETTE} receiveShadow={receiveShadow} />;
}
