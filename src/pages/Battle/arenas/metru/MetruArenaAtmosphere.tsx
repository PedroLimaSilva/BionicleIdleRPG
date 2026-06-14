import { CavernAtmosphere } from '../shared/CavernArena';
import { METRU_PALETTE } from './palette';
import type { ArenaAtmosphereProps } from '../types';

/** Atmosphere for the Metru Nui cavern variation (cold/technological). */
export function MetruArenaAtmosphere({ castShadow }: ArenaAtmosphereProps) {
  return <CavernAtmosphere palette={METRU_PALETTE} castShadow={castShadow} />;
}
