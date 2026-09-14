import { shouldVisualizeWeatheringGrime } from './weatheredMetalGraph';

describe('shouldVisualizeWeatheringGrime', () => {
  test('explicit debugGrimeAsColor replaces albedo with grayscale FBM', () => {
    expect(shouldVisualizeWeatheringGrime({ debugGrimeAsColor: true })).toBe(true);
  });

  test('default weathered materials keep character albedo', () => {
    expect(shouldVisualizeWeatheringGrime({})).toBe(false);
    expect(shouldVisualizeWeatheringGrime({ debugGrimeAsColor: false })).toBe(false);
  });
});
