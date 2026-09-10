/**
 * @jest-environment jsdom
 */
import { act, render, waitFor } from '@testing-library/react';
import { isTestMode } from '../../utils/testMode';
import { SceneCompileAsync } from './SceneCompileAsync';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;

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
    gl.compileAsync = compileAsync;
    compileAsync.mockResolvedValue(undefined);
  });

  test('pauses the frame loop until compileAsync finishes, then resumes', async () => {
    let resolveCompile: (() => void) | undefined;
    compileAsync.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCompile = resolve;
        })
    );

    render(<SceneCompileAsync compileKey="tahu" ready />);

    expect(setFrameloop).toHaveBeenCalledWith('never');
    expect(compileAsync).toHaveBeenCalledWith(scene, camera);
    expect(setFrameloop).not.toHaveBeenCalledWith('always');

    await act(async () => {
      resolveCompile?.();
    });

    await waitFor(() => {
      expect(setFrameloop).toHaveBeenCalledWith('always');
    });
    expect(invalidate).toHaveBeenCalled();
  });

  test('compiles when ready flips from false to true', async () => {
    const { rerender } = render(<SceneCompileAsync compileKey="tahu" ready={false} />);
    expect(compileAsync).not.toHaveBeenCalled();

    rerender(<SceneCompileAsync compileKey="tahu" ready />);

    await waitFor(() => {
      expect(compileAsync).toHaveBeenCalledWith(scene, camera);
    });
    await waitFor(() => {
      expect(setFrameloop).toHaveBeenCalledWith('always');
    });
  });

  test('skips pause and compile in test mode', () => {
    isTestModeMock.mockReturnValue(true);
    render(<SceneCompileAsync compileKey="tahu" ready />);

    expect(setFrameloop).not.toHaveBeenCalled();
    expect(compileAsync).not.toHaveBeenCalled();
  });

  test('resumes if compileAsync is missing', () => {
    delete gl.compileAsync;
    render(<SceneCompileAsync compileKey="gali" ready />);
    expect(setFrameloop).toHaveBeenCalledWith('always');
  });

  test('does not resume from compileAsync after unmount', async () => {
    let resolveCompile: (() => void) | undefined;
    compileAsync.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCompile = resolve;
        })
    );

    const { unmount } = render(<SceneCompileAsync compileKey="lewa" ready />);
    unmount();
    setFrameloop.mockClear();
    invalidate.mockClear();

    await act(async () => {
      resolveCompile?.();
    });

    expect(setFrameloop).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });

  test('resumes if compileAsync rejects', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    compileAsync.mockRejectedValue(new Error('pipeline failed'));

    render(<SceneCompileAsync compileKey="kopaka" ready />);

    await waitFor(() => {
      expect(setFrameloop).toHaveBeenCalledWith('always');
    });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
