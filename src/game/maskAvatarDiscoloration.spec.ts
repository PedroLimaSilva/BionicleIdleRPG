import { applyMaskAvatarDiscoloration } from './maskAvatarDiscoloration';
import { METRU_MASK_DISCOLORATION } from './kit/palettes/metruKitPlayerPalette';
import { LegoColor } from '../types/Colors';

function solidImageData(width: number, height: number, rgb: [number, number, number]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
    }
  }
  return { data, height, width } as ImageData;
}

describe('applyMaskAvatarDiscoloration', () => {
  test('leaves rows below the eye line unchanged and tints only the crown', () => {
    const image = solidImageData(2, 10, [200, 0, 0]);
    applyMaskAvatarDiscoloration(image, {
      color: LegoColor.LightGray,
      intensity: 1,
    });

    const bottom = (9 * 2 + 1) * 4;
    expect(image.data[bottom]).toBe(200);
    expect(image.data[bottom + 1]).toBe(0);
    expect(image.data[bottom + 2]).toBe(0);

    const belowEyeLine = 4 * 2 * 4;
    expect(image.data[belowEyeLine]).toBe(200);

    const top = 4;
    expect(image.data[top]).toBeLessThan(200);
    expect(image.data[top + 1]).toBeGreaterThan(0);
    expect(image.data[top + 2]).toBeGreaterThan(0);
  });

  test('respects intensity scaling at the crown', () => {
    const full = solidImageData(1, 10, [200, 0, 0]);
    const half = solidImageData(1, 10, [200, 0, 0]);

    applyMaskAvatarDiscoloration(full, { color: LegoColor.LightGray, intensity: 1 });
    applyMaskAvatarDiscoloration(half, { color: LegoColor.LightGray, intensity: 0.5 });

    expect(half.data[0]).toBeGreaterThan(full.data[0]);
  });

  test('skips transparent pixels', () => {
    const image = solidImageData(1, 2, [200, 0, 0]);
    image.data[3] = 0;
    applyMaskAvatarDiscoloration(image, METRU_MASK_DISCOLORATION);
    expect(image.data[0]).toBe(200);
  });
});
