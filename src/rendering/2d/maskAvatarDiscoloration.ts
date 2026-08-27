import type { MaskDiscoloration } from '../3d/hooks/maskDiscoloration';

/** Vertical crown tint for Metru double-injected Kanohi on 2D composited avatars. */
const AVATAR_DISCOLORATION_END_Y = 1;
/** Higher = sharper transition from silver crown into base mask color. */
const AVATAR_DISCOLORATION_SHARPNESS = 3;

function parseHexColor(hex: string): [number, number, number] {
  const normalized = hex.startsWith('#') ? hex.slice(1) : hex;
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function mixChannel(base: number, target: number, amount: number): number {
  return base + (target - base) * amount;
}

/**
 * Approximates the Metru double-injected Kanohi crown tint on a tinted mask layer.
 * Abrupt silver crown on Metru double-injected Kanohi (full mask height, power-curve falloff).
 */
export function applyMaskAvatarDiscoloration(
  imageData: ImageData,
  discoloration: MaskDiscoloration
): void {
  const { data, height, width } = imageData;
  if (discoloration.intensity <= 0 || height <= 0) return;

  const [dr, dg, db] = parseHexColor(discoloration.color);
  const endY = Math.max(1, height * AVATAR_DISCOLORATION_END_Y);

  for (let y = 0; y < height; y++) {
    if (y >= endY) continue;

    const t = 1 - y / endY;
    const amount = Math.pow(t, AVATAR_DISCOLORATION_SHARPNESS) * discoloration.intensity;
    if (amount <= 0) continue;

    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] === 0) continue;

      data[i] = mixChannel(data[i], dr, amount);
      data[i + 1] = mixChannel(data[i + 1], dg, amount);
      data[i + 2] = mixChannel(data[i + 2], db, amount);
    }
  }
}
