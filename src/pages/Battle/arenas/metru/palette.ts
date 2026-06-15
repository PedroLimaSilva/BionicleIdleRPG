import type { CavernPalette } from '../shared/CavernArena';

/**
 * Metru Nui — the cavern framework recast as a brighter, open daytime biome
 * with cold, technological materials (overhead skylight, lighter fog).
 */
export const METRU_PALETTE: CavernPalette = {
  ambient: '#1c2c3c',
  ambientIntensity: 0.5,
  beam: '#7fdcff',
  dome: '#c2cdd6',
  domeMetalness: 0.85,
  floorAccent: '#3a5e7e',
  fogRange: [6, 24],
  glow: '#5fb6e0',
  skyLight: { color: '#bcd2ec', ground: '#33424f', intensity: 0.85 },
  stone: '#465465',
};
