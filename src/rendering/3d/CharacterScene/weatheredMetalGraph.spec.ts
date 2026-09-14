import { MeshStandardMaterial } from 'three';
import {
  shouldVisualizeWeatheringGrime,
  weatheredProgramCacheKey,
  WEATHERING_NOISE_SEED,
} from './weatheredMetalGraph';

describe('WEATHERING_NOISE_SEED', () => {
  test('is a fixed PCG seed so bake-absent FBM does not drift between runs', () => {
    expect(WEATHERING_NOISE_SEED).toBe(2891336453);
  });

  test('stays out of the GPU program cache key (shared graph constant)', () => {
    const mat = new MeshStandardMaterial();
    expect(
      weatheredProgramCacheKey(mat, {
        debugGrime: false,
        dentStrength: 0,
        hasDiscoloration: false,
      })
    ).not.toContain(String(WEATHERING_NOISE_SEED));
  });
});

describe('shouldVisualizeWeatheringGrime', () => {
  test('explicit debugGrimeAsColor replaces albedo with grayscale FBM', () => {
    expect(shouldVisualizeWeatheringGrime({ debugGrimeAsColor: true })).toBe(true);
  });

  test('default weathered materials keep character albedo', () => {
    expect(shouldVisualizeWeatheringGrime({})).toBe(false);
    expect(shouldVisualizeWeatheringGrime({ debugGrimeAsColor: false })).toBe(false);
  });
});
