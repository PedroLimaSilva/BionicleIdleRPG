/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { isTestMode } from '../../utils/testMode';
import { SceneCompileAsync } from './SceneCompileAsync';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;

const compileAsync = jest.fn();
const scene = { uuid: 'scene' };
const camera = { uuid: 'camera' };
const gl: { compileAsync?: typeof compileAsync } = { compileAsync };

jest.mock('@react-three/fiber', () => ({
  useThree: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      camera,
      gl,
      scene,
    }),
}));

describe('SceneCompileAsync', () => {
  beforeEach(() => {
    compileAsync.mockReset();
    isTestModeMock.mockReturnValue(false);
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

  test('skips compile in test mode', () => {
    isTestModeMock.mockReturnValue(true);
    render(<SceneCompileAsync compileKey="tahu" ready />);
    expect(compileAsync).not.toHaveBeenCalled();
  });

  test('no-ops if compileAsync is missing', () => {
    delete gl.compileAsync;
    render(<SceneCompileAsync compileKey="gali" ready />);
    expect(compileAsync).not.toHaveBeenCalled();
  });

  test('logs if compileAsync rejects', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    compileAsync.mockRejectedValue(new Error('pipeline failed'));

    render(<SceneCompileAsync compileKey="kopaka" ready />);

    await waitFor(() => {
      expect(warn).toHaveBeenCalled();
    });
    warn.mockRestore();
  });
});
