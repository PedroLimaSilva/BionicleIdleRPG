import type { MaskDiscoloration } from '../hooks/maskDiscoloration';

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
 * Matches the 3D shader: base mask color at the bottom, `discoloration.color` at the crown.
 */
export function applyMaskAvatarDiscoloration(
  imageData: ImageData,
  discoloration: MaskDiscoloration
): void {
  const { data, height, width } = imageData;
  if (discoloration.intensity <= 0 || height <= 0) return;

  const [dr, dg, db] = parseHexColor(discoloration.color);
  const maxY = height - 1;

  for (let y = 0; y < height; y++) {
    const amount = (maxY > 0 ? (maxY - y) / maxY : 0) * discoloration.intensity;
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
