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
  [LegoColor.Black]: { color: LegoColor.LightGray, intensity: 0.55 },
  [LegoColor.Blue]: { color: LegoColor.LightGray, intensity: 0.45 },
  [LegoColor.Brown]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkBlue]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkBluishGray]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkGray]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkGreen]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkOrange]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.DarkRed]: { color: LegoColor.LightGray, intensity: 0.45 },
  [LegoColor.DarkTurquoise]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.FlatDarkGold]: { color: LegoColor.LightGray, intensity: 0.5 },
  [LegoColor.Green]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.LightBrown]: { color: LegoColor.LightGray, intensity: 0.35 },
  [LegoColor.LightGray]: { color: LegoColor.LightGray, intensity: 0.35 },
  [LegoColor.Lime]: { color: LegoColor.LightGray, intensity: 0.35 },
  [LegoColor.MediumBlue]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.Orange]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.PearlGold]: { color: LegoColor.LightGray, intensity: 0.5 },
  [LegoColor.Purple]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.Red]: { color: LegoColor.LightGray, intensity: 0.5 },
  [LegoColor.SandBlue]: { color: LegoColor.LightGray, intensity: 0.4 },
  [LegoColor.Tan]: { color: LegoColor.LightGray, intensity: 0.3 },
  [LegoColor.TransDarkBlue]: { color: LegoColor.LightGray, intensity: 0.25 },
  [LegoColor.TransGreen]: { color: LegoColor.LightGray, intensity: 0.25 },
  [LegoColor.TransLightBlue]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransMediumBlue]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransNeonGreen]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransNeonOrange]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransNeonPink]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransNeonRed]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransNeonYellow]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.TransYellow]: { color: LegoColor.LightGray, intensity: 0.2 },
  [LegoColor.White]: { color: LegoColor.LightGray, intensity: 0.35 },
  [LegoColor.Yellow]: { color: LegoColor.LightGray, intensity: 0.4 },
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
  if (hsl.l < 0.12) return { color: LegoColor.LightGray, intensity: 0.5 };
  if (hsl.l > 0.85) return { color: LegoColor.LightGray, intensity: 0.3 };
  c.offsetHSL(0.015, -0.12, 0.16);
  return { color: `#${c.getHexString().toUpperCase()}`, intensity: 0.4 };
}

/** Discoloration tint for a resolved slot/mask hex (LEGO table, then default). */
export function discolorationForColor(hex: string): LegoDiscolorationSpec {
  const key = normalizeHex(hex) as LegoColor;
  return LEGO_COLOR_DISCOLORATION[key] ?? deriveDefaultDiscoloration(hex);
}
