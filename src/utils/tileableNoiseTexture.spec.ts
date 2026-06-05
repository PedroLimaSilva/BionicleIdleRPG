import {
  createTileableNoiseTexture,
  DEFAULT_WEAR_NOISE_TEXTURE_SEED,
} from './tileableNoiseTexture';

function texelBytes(tex: ReturnType<typeof createTileableNoiseTexture>): number[] {
  return Array.from(tex.image.data);
}

describe('createTileableNoiseTexture', () => {
  it('produces identical texel data for the same seed', () => {
    const a = createTileableNoiseTexture(DEFAULT_WEAR_NOISE_TEXTURE_SEED);
    const b = createTileableNoiseTexture(DEFAULT_WEAR_NOISE_TEXTURE_SEED);
    expect(texelBytes(a)).toEqual(texelBytes(b));
  });

  it('produces different texel data for different seeds', () => {
    const a = createTileableNoiseTexture(1);
    const b = createTileableNoiseTexture(2);
    expect(texelBytes(a)).not.toEqual(texelBytes(b));
  });
});
