import { CavernAtmosphere } from '../shared/CavernArena';
import { METRU_UNDERGROUND_PALETTE } from './palette';
import type { ArenaAtmosphereProps } from '../types';

/** Atmosphere for the underground Metru Nui Archives (same biome, deep underground). */
export function MetruArchivesAtmosphere({ castShadow }: ArenaAtmosphereProps) {
  return <CavernAtmosphere palette={METRU_UNDERGROUND_PALETTE} castShadow={castShadow} />;
}
