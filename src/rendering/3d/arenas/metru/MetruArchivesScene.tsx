import { CavernArenaScene } from '../shared/CavernArena';
import { METRU_UNDERGROUND_PALETTE } from './palette';
import type { ArenaSceneProps } from '../types';

export function MetruArchivesScene({ receiveShadow }: ArenaSceneProps) {
  return <CavernArenaScene palette={METRU_UNDERGROUND_PALETTE} receiveShadow={receiveShadow} />;
}
