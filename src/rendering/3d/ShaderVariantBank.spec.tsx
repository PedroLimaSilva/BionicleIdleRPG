/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { isTestMode } from '../../utils/testMode';
import { isWebGLBackend } from './webgpuRenderer';
import { resetShaderVariantBankForTests, ShaderVariantBank } from './ShaderVariantBank';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

jest.mock('./webgpuRenderer', () => ({
  isWebGLBackend: jest.fn(),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;
const isWebGLBackendMock = isWebGLBackend as jest.MockedFunction<typeof isWebGLBackend>;

const compileAsync = jest.fn();
const scene = { add: jest.fn(), remove: jest.fn() };
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

describe('ShaderVariantBank', () => {
  beforeEach(() => {
    compileAsync.mockReset();
    scene.add.mockReset();
    scene.remove.mockReset();
    isTestModeMock.mockReturnValue(false);
    isWebGLBackendMock.mockReturnValue(false);
    gl.compileAsync = compileAsync;
    compileAsync.mockResolvedValue(undefined);
    resetShaderVariantBankForTests();
  });

  test('compiles variant meshes once on WebGPU', async () => {
    render(<ShaderVariantBank />);
    expect(scene.add).toHaveBeenCalledTimes(1);
    expect(compileAsync).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(scene.remove).toHaveBeenCalledTimes(1));

    render(<ShaderVariantBank />);
    expect(compileAsync).toHaveBeenCalledTimes(1);
  });

  test('skips compile in test mode', () => {
    isTestModeMock.mockReturnValue(true);
    render(<ShaderVariantBank />);
    expect(compileAsync).not.toHaveBeenCalled();
  });

  test('skips compile on the WebGL fallback', () => {
    isWebGLBackendMock.mockReturnValue(true);
    render(<ShaderVariantBank />);
    expect(compileAsync).not.toHaveBeenCalled();
  });
});
