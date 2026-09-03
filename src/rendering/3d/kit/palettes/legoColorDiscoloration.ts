import { Color } from 'three';
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

/**
 * Hand-tuned tints for colors that do not read well with a generic lighten.
 * Unlisted hexes fall back to {@link deriveDefaultDiscoloration}.
 */
export const LEGO_COLOR_DISCOLORATION: Partial<Record<LegoColor, LegoDiscolorationSpec>> = {
  [LegoColor.Black]: { color: '#6D6E5C', intensity: 0.55 },
  [LegoColor.Blue]: { color: '#5A93DB', intensity: 0.45 },
  [LegoColor.Brown]: { color: '#7C503A', intensity: 0.4 },
  [LegoColor.DarkBlue]: { color: '#0055BF', intensity: 0.4 },
  [LegoColor.DarkBluishGray]: { color: '#9BA19D', intensity: 0.4 },
  [LegoColor.DarkGray]: { color: '#9BA19D', intensity: 0.4 },
  [LegoColor.DarkGreen]: { color: '#237841', intensity: 0.4 },
  [LegoColor.DarkOrange]: { color: '#FE8A18', intensity: 0.4 },
  [LegoColor.DarkRed]: { color: '#C91A09', intensity: 0.45 },
  [LegoColor.DarkTurquoise]: { color: '#5A93DB', intensity: 0.4 },
  [LegoColor.FlatDarkGold]: { color: '#E8D5A3', intensity: 0.5 },
  [LegoColor.Green]: { color: '#84B68D', intensity: 0.4 },
  [LegoColor.LightBrown]: { color: '#E4CD9E', intensity: 0.35 },
  [LegoColor.LightGray]: { color: '#FFFFFF', intensity: 0.35 },
  [LegoColor.Lime]: { color: '#F5CD2F', intensity: 0.35 },
  [LegoColor.MediumBlue]: { color: '#CFE2F7', intensity: 0.4 },
  [LegoColor.Orange]: { color: '#F5CD2F', intensity: 0.4 },
  [LegoColor.PearlGold]: { color: '#F0E0B8', intensity: 0.5 },
  [LegoColor.Purple]: { color: '#C070B8', intensity: 0.4 },
  [LegoColor.Red]: { color: '#E8A090', intensity: 0.5 },
  [LegoColor.SandBlue]: { color: '#9BA19D', intensity: 0.4 },
  [LegoColor.Tan]: { color: '#FFFFFF', intensity: 0.3 },
  [LegoColor.TransDarkBlue]: { color: '#FFFFFF', intensity: 0.25 },
  [LegoColor.TransGreen]: { color: '#FFFFFF', intensity: 0.25 },
  [LegoColor.TransLightBlue]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransMediumBlue]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransNeonGreen]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransNeonOrange]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransNeonPink]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransNeonRed]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransNeonYellow]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.TransYellow]: { color: '#FFFFFF', intensity: 0.2 },
  [LegoColor.White]: { color: '#E4CD9E', intensity: 0.35 },
  [LegoColor.Yellow]: { color: '#FFFFFF', intensity: 0.4 },
};

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return withHash.toUpperCase();
}

/** Warm scuff for unknown / custom hexes: gray on near-black, tan on near-white, else lighten. */
export function deriveDefaultDiscoloration(hex: string): LegoDiscolorationSpec {
  const c = new Color(hex);
  const hsl = { h: 0, l: 0, s: 0 };
  c.getHSL(hsl);
  if (hsl.l < 0.12) return { color: '#6D6E5C', intensity: 0.5 };
  if (hsl.l > 0.85) return { color: '#E4CD9E', intensity: 0.3 };
  c.offsetHSL(0.015, -0.12, 0.16);
  return { color: `#${c.getHexString().toUpperCase()}`, intensity: 0.4 };
}

/** Discoloration tint for a resolved slot/mask hex (LEGO table, then default). */
export function discolorationForColor(hex: string): LegoDiscolorationSpec {
  const key = normalizeHex(hex) as LegoColor;
  return LEGO_COLOR_DISCOLORATION[key] ?? deriveDefaultDiscoloration(hex);
}
