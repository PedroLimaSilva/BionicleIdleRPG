/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { Group } from 'three';
import { isTestMode } from '../../utils/testMode';
import { isWebGLBackend } from './webgpuRenderer';
import { SceneCompileAsync } from './SceneCompileAsync';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

jest.mock('./webgpuRenderer', () => ({
  isWebGLBackend: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;
const isWebGLBackendMock = isWebGLBackend as jest.MockedFunction<typeof isWebGLBackend>;

const compileAsync = jest.fn();
const invalidate = jest.fn();
const setFrameloop = jest.fn();
const scene = { uuid: 'scene' };
const camera = { uuid: 'camera' };
const gl: { compileAsync?: typeof compileAsync } = { compileAsync };

jest.mock('@react-three/fiber', () => ({
  useThree: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      camera,
      gl,
      invalidate,
      scene,
      setFrameloop,
    }),
}));

describe('SceneCompileAsync', () => {
  beforeEach(() => {
    compileAsync.mockReset();
    invalidate.mockReset();
    setFrameloop.mockReset();
    isTestModeMock.mockReturnValue(false);
    isWebGLBackendMock.mockReturnValue(false);
    gl.compileAsync = compileAsync;
    compileAsync.mockResolvedValue(undefined);
  });

  test('runs compileAsync once kits report ready', async () => {
    render(<SceneCompileAsync compileKey="tahu" ready />);
    await waitFor(() => {
      expect(compileAsync).toHaveBeenCalledWith(scene, camera);
    });
  });

  test('does not compile before kits report ready', () => {
    render(<SceneCompileAsync compileKey="tahu" ready={false} />);
    expect(compileAsync).not.toHaveBeenCalled();
  });

  test('compiles when ready flips from false to true', async () => {
    const { rerender } = render(<SceneCompileAsync compileKey="tahu" ready={false} />);
    expect(compileAsync).not.toHaveBeenCalled();

    rerender(<SceneCompileAsync compileKey="tahu" ready />);

    await waitFor(() => {
      expect(compileAsync).toHaveBeenCalledWith(scene, camera);
    });
  });

  test('pauses the frameloop until compileAsync settles', async () => {
    let resolveCompile: (() => void) | undefined;
    compileAsync.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCompile = resolve;
        })
    );

    render(<SceneCompileAsync compileKey="tahu" ready />);

    await waitFor(() => expect(compileAsync).toHaveBeenCalled());
    expect(setFrameloop).toHaveBeenCalledWith('never');
    expect(invalidate).not.toHaveBeenCalled();

    resolveCompile?.();

    await waitFor(() => {
      expect(setFrameloop).toHaveBeenLastCalledWith('always');
      expect(invalidate).toHaveBeenCalled();
    });
  });

  test('hides the compile root until compileAsync finishes', async () => {
    const root = new Group();
    const compileRootRef = { current: root };

    let resolveCompile: (() => void) | undefined;
    compileAsync.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCompile = resolve;
        })
    );

    const { rerender } = render(
      <SceneCompileAsync
        compileKey="tahu"
        compileRootRef={compileRootRef}
        hideUntilCompiled
        ready={false}
      />
    );
    expect(root.visible).toBe(false);
    expect(compileAsync).not.toHaveBeenCalled();

    rerender(
      <SceneCompileAsync
        compileKey="tahu"
        compileRootRef={compileRootRef}
        hideUntilCompiled
        ready
      />
    );

    await waitFor(() => {
      expect(compileAsync).toHaveBeenCalledWith(root, camera, scene);
    });
    expect(root.visible).toBe(true);
    expect(setFrameloop).toHaveBeenCalledWith('never');

    resolveCompile?.();

    await waitFor(() => {
      expect(setFrameloop).toHaveBeenLastCalledWith('always');
      expect(root.visible).toBe(true);
    });
  });

  test('skips compile in test mode', () => {
    isTestModeMock.mockReturnValue(true);
    render(<SceneCompileAsync compileKey="tahu" ready />);
    expect(compileAsync).not.toHaveBeenCalled();
    expect(setFrameloop).not.toHaveBeenCalled();
  });

  test('skips compile on the WebGL fallback', () => {
    isWebGLBackendMock.mockReturnValue(true);
    render(<SceneCompileAsync compileKey="tahu" ready />);
    expect(compileAsync).not.toHaveBeenCalled();
    expect(setFrameloop).not.toHaveBeenCalled();
  });

  test('no-ops if compileAsync is missing', () => {
    delete gl.compileAsync;
    render(<SceneCompileAsync compileKey="gali" ready />);
    expect(compileAsync).not.toHaveBeenCalled();
    expect(setFrameloop).not.toHaveBeenCalled();
  });

  test('logs if compileAsync rejects', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    compileAsync.mockRejectedValue(new Error('pipeline failed'));

    render(<SceneCompileAsync compileKey="kopaka" ready />);

    await waitFor(() => {
      expect(warn).toHaveBeenCalled();
      expect(setFrameloop).toHaveBeenLastCalledWith('always');
    });
    warn.mockRestore();
  });
});
