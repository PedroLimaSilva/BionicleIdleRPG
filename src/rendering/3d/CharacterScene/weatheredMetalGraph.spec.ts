import { isTestMode } from '../../../utils/testMode';
import { shouldVisualizeWeatheringGrime } from './weatheredMetalGraph';

jest.mock('../../../utils/testMode', () => ({
  isTestMode: jest.fn(() => false),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;

describe('shouldVisualizeWeatheringGrime', () => {
  beforeEach(() => {
    isTestModeMock.mockReturnValue(false);
  });

  test('explicit debugGrimeAsColor always visualizes', () => {
    expect(
      shouldVisualizeWeatheringGrime({
        debugGrimeAsColor: true,
        grimeDarken: 0.4,
        hasDiscoloration: true,
      })
    ).toBe(true);
  });

  test('production leaves bake-absent grime on the albedo mix', () => {
    expect(
      shouldVisualizeWeatheringGrime({
        grimeDarken: 0.4,
        hasDiscoloration: false,
      })
    ).toBe(false);
  });

  test('Playwright visualizes bake-absent FBM so VR can see the noise', () => {
    isTestModeMock.mockReturnValue(true);
    expect(
      shouldVisualizeWeatheringGrime({
        grimeDarken: 0.4,
        hasDiscoloration: false,
      })
    ).toBe(true);
  });

  test('Playwright keeps baked discoloration instead of grayscale FBM', () => {
    isTestModeMock.mockReturnValue(true);
    expect(
      shouldVisualizeWeatheringGrime({
        grimeDarken: 0.4,
        hasDiscoloration: true,
      })
    ).toBe(false);
  });

  test('grimeDarken 0 does not visualize even in test mode', () => {
    isTestModeMock.mockReturnValue(true);
    expect(
      shouldVisualizeWeatheringGrime({
        grimeDarken: 0,
        hasDiscoloration: false,
      })
    ).toBe(false);
  });
});
