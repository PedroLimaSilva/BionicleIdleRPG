import { LegoColor } from '../../../../types/Colors';

/**
 * Where a baked grayscale `emissive` map is bright, mix the slot/mask color toward
 * this tint. The bake encodes *where* (bevel + noise on sharp angles); this table
 * encodes *what* that wear looks like for the chosen LEGO color.
 */
export type LegoDiscolorationSpec = {
  color: string;
  /** Mix amount at a full-white bake sample (0–1). */
  intensity: number;
};

/** Protodermis gray under the paint. Same mix for every color unless listed below. */
export const DEFAULT_LEGO_DISCOLORATION: LegoDiscolorationSpec = {
  color: LegoColor.LightGray,
  intensity: 1,
};

/**
 * Exceptions only. Unlisted hexes (including unknown / custom colors) use
 * {@link DEFAULT_LEGO_DISCOLORATION}.
 */
export const LEGO_COLOR_DISCOLORATION: Partial<Record<LegoColor, LegoDiscolorationSpec>> = {
  [LegoColor.White]: { color: LegoColor.DarkGray, intensity: 1 },
};

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.toUpperCase();
}

/** Discoloration tint for a resolved slot/mask hex (exception table, then default). */
export function discolorationForColor(hex: string): LegoDiscolorationSpec {
  const key = normalizeHex(hex) as LegoColor;
  return LEGO_COLOR_DISCOLORATION[key] ?? DEFAULT_LEGO_DISCOLORATION;
}
