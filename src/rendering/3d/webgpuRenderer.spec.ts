import { isTestMode } from '../../utils/testMode';
import {
  isTintSafeNodeLibraryInstalled,
  uninstallTintSafeNodeLibraryForTests,
} from './tsl/tintSafe';
import {
  isTopologyCacheKeyPatchInstalled,
  uninstallTopologyCacheKeyPatchForTests,
} from './tsl/installTopologyCacheKeyPatch';
import { createSceneWebGPURenderer, readDevicePixelRatio } from './webgpuRenderer';

type RendererOptions = {
  options: { antialias: boolean; samples: number };
};

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;

describe('createSceneWebGPURenderer', () => {
  afterEach(() => {
    uninstallTintSafeNodeLibraryForTests();
    uninstallTopologyCacheKeyPatchForTests();
    isTestModeMock.mockReset();
  });

  it('does not install the Tint patch when Playwright forces WebGL', async () => {
    isTestModeMock.mockReturnValue(true);
    await createSceneWebGPURenderer({ canvas: {} as HTMLCanvasElement });
    expect(isTintSafeNodeLibraryInstalled()).toBe(false);
    expect(isTopologyCacheKeyPatchInstalled()).toBe(false);
  });

  it('installs the Tint patch after a successful WebGPU init', async () => {
    isTestModeMock.mockReturnValue(false);
    await createSceneWebGPURenderer({ canvas: {} as HTMLCanvasElement });
    expect(isTintSafeNodeLibraryInstalled()).toBe(true);
    expect(isTopologyCacheKeyPatchInstalled()).toBe(true);
  });

  it('keeps 4× MSAA when the canvas renders at 1×', async () => {
    isTestModeMock.mockReturnValue(true);
    const renderer = (await createSceneWebGPURenderer({
      canvas: {} as HTMLCanvasElement,
      devicePixelRatio: 1,
    })) as unknown as RendererOptions;
    expect(renderer.options.antialias).toBe(true);
    expect(renderer.options.samples).toBe(4);
  });

  it('skips MSAA when the rendered pixel ratio is above 1×', async () => {
    isTestModeMock.mockReturnValue(false);
    const renderer = (await createSceneWebGPURenderer({
      canvas: {} as HTMLCanvasElement,
      devicePixelRatio: 3,
    })) as unknown as RendererOptions;
    expect(renderer.options.antialias).toBe(false);
    expect(renderer.options.samples).toBe(0);
  });

  it('reads window.devicePixelRatio when the caller does not pass one', async () => {
    const previous = global.window;
    global.window = { devicePixelRatio: 2 } as Window & typeof globalThis;
    isTestModeMock.mockReturnValue(false);
    try {
      const renderer = (await createSceneWebGPURenderer({
        canvas: {} as HTMLCanvasElement,
      })) as unknown as RendererOptions;
      expect(renderer.options.antialias).toBe(false);
      expect(renderer.options.samples).toBe(0);
    } finally {
      if (previous === undefined) {
        delete (global as { window?: Window }).window;
      } else {
        global.window = previous;
      }
    }
  });
});

describe('readDevicePixelRatio', () => {
  const previous = global.window;

  afterEach(() => {
    if (previous === undefined) {
      delete (global as { window?: Window }).window;
    } else {
      global.window = previous;
    }
  });

  it('stays at 1× when there is no window', () => {
    delete (global as { window?: Window }).window;
    expect(readDevicePixelRatio()).toBe(1);
  });

  it('assumes 2× when the window omits devicePixelRatio, matching R3F', () => {
    global.window = {} as Window & typeof globalThis;
    expect(readDevicePixelRatio()).toBe(2);
  });

  it('returns the reported ratio', () => {
    global.window = { devicePixelRatio: 3 } as Window & typeof globalThis;
    expect(readDevicePixelRatio()).toBe(3);
  });
});
