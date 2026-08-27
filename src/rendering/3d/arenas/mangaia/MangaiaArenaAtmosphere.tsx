import { CavernAtmosphere } from '../shared/CavernArena';
import { MANGAIA_PALETTE } from './palette';
import type { ArenaAtmosphereProps } from '../types';

/** Atmosphere for the Mangaia cavern — inside the Great Spirit Robot beneath Mata Nui. */
export function MangaiaArenaAtmosphere({ castShadow }: ArenaAtmosphereProps) {
  return <CavernAtmosphere palette={MANGAIA_PALETTE} castShadow={castShadow} />;
}
