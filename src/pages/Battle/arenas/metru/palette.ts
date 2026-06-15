import type { CavernPalette } from '../shared/CavernArena';

/** Shared Metru Nui materials — cold, technological (cyan beam, silver dome). */
const METRU_BASE = {
  ambient: '#1c2c3c',
  beam: '#7fdcff',
  dome: '#c2cdd6',
  domeMetalness: 0.85,
  floorAccent: '#3a5e7e',
  glow: '#5fb6e0',
  stone: '#465465',
} as const;

/** Metru Nui above ground — a bright, open daytime biome. */
export const METRU_DAY_PALETTE: CavernPalette = {
  ...METRU_BASE,
  lighting: 'daylight',
};

/** Metru Nui Archives — the same biome deep underground (dark, fogged). */
export const METRU_UNDERGROUND_PALETTE: CavernPalette = {
  ...METRU_BASE,
  ambient: '#0d1620',
  lighting: 'underground',
};
