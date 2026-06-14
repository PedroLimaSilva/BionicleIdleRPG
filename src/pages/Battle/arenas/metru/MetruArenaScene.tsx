import { CavernArenaScene } from '../shared/CavernArena';
import { METRU_PALETTE } from './palette';
import type { ArenaSceneProps } from '../types';

export function MetruArenaScene({ receiveShadow }: ArenaSceneProps) {
  return <CavernArenaScene palette={METRU_PALETTE} receiveShadow={receiveShadow} />;
}
