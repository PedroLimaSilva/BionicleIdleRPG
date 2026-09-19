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

  test('packed PBR is a distinct GPU topology from grayscale discoloration', () => {
    const mat = new MeshStandardMaterial();
    expect(
      weatheredProgramCacheKey(mat, {
        debugGrime: false,
        dentStrength: 0,
        hasDiscoloration: true,
        packedPbr: true,
      })
    ).toContain('packed');
    expect(
      weatheredProgramCacheKey(mat, {
        debugGrime: false,
        dentStrength: 0,
        hasDiscoloration: true,
      })
    ).not.toContain('packed');
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
