import { isTestMode } from '../../utils/testMode';
import {
  isTintSafeNodeLibraryInstalled,
  uninstallTintSafeNodeLibraryForTests,
} from './tsl/tintSafe';
import { createSceneWebGPURenderer } from './webgpuRenderer';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;

describe('createSceneWebGPURenderer', () => {
  afterEach(() => {
    uninstallTintSafeNodeLibraryForTests();
    isTestModeMock.mockReset();
  });

  it('does not install the Tint patch when Playwright forces WebGL', async () => {
    isTestModeMock.mockReturnValue(true);
    await createSceneWebGPURenderer({ canvas: {} as HTMLCanvasElement });
    expect(isTintSafeNodeLibraryInstalled()).toBe(false);
  });

  it('installs the Tint patch after a successful WebGPU init', async () => {
    isTestModeMock.mockReturnValue(false);
    await createSceneWebGPURenderer({ canvas: {} as HTMLCanvasElement });
    expect(isTintSafeNodeLibraryInstalled()).toBe(true);
  });
});
