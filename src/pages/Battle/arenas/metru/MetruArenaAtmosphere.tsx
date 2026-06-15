import { CavernAtmosphere } from '../shared/CavernArena';
import { METRU_DAY_PALETTE } from './palette';
import type { ArenaAtmosphereProps } from '../types';

/** Atmosphere for the daytime Metru Nui biome (cold/technological). */
export function MetruArenaAtmosphere({ castShadow }: ArenaAtmosphereProps) {
  return <CavernAtmosphere palette={METRU_DAY_PALETTE} castShadow={castShadow} />;
}
