/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react';
import { Group, Mesh, SkinnedMesh } from 'three';
import { isTestMode } from '../../utils/testMode';
import { isWebGLBackend } from './webgpuRenderer';
import { resetShaderVariantBankForTests, ShaderVariantBank } from './ShaderVariantBank';

jest.mock('../../utils/testMode', () => ({
  isTestMode: jest.fn(),
}));

jest.mock('./webgpuRenderer', () => ({
  isWebGLBackend: jest.fn(),
}));

jest.mock('./SceneHdriEnvironment', () => ({
  whenRendererHdriReady: jest.fn(() => Promise.resolve()),
}));

const isTestModeMock = isTestMode as jest.MockedFunction<typeof isTestMode>;
const isWebGLBackendMock = isWebGLBackend as jest.MockedFunction<typeof isWebGLBackend>;

const compileAsync = jest.fn();
const invalidate = jest.fn();
const setFrameloop = jest.fn();
const scene = { add: jest.fn(), remove: jest.fn() };
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

function previewFromCompile(): Group {
  return compileAsync.mock.calls[0][0] as Group;
}

describe('ShaderVariantBank', () => {
  beforeEach(() => {
    compileAsync.mockReset();
    invalidate.mockReset();
    setFrameloop.mockReset();
    scene.add.mockReset();
    scene.remove.mockReset();
    isTestModeMock.mockReturnValue(false);
    isWebGLBackendMock.mockReturnValue(false);
    gl.compileAsync = compileAsync;
    compileAsync.mockResolvedValue(undefined);
    resetShaderVariantBankForTests();
  });

  test('compiles off-stage Mesh + SkinnedMesh variants once on WebGPU', async () => {
    render(<ShaderVariantBank />);
    await waitFor(() => expect(compileAsync).toHaveBeenCalledTimes(1));
    expect(scene.add).not.toHaveBeenCalled();
    expect(compileAsync.mock.calls[0][1]).toBe(camera);
    expect(compileAsync.mock.calls[0][2]).toBe(scene);
    expect(setFrameloop).toHaveBeenCalledWith('never');

    const preview = previewFromCompile();
    expect(preview.name).toBe('ShaderVariantBank');
    expect(preview.visible).toBe(true);

    let meshes = 0;
    let skinned = 0;
    let shadowCasters = 0;
    let glow = 0;
    let floor = false;
    preview.traverse((child) => {
      if (child.name === 'ShaderVariantBankShadowFloor') {
        floor = true;
        expect((child as Mesh).receiveShadow).toBe(true);
        return;
      }
      if ((child as SkinnedMesh).isSkinnedMesh) {
        skinned += 1;
        if (child.castShadow && (child as Mesh).receiveShadow) shadowCasters += 1;
        return;
      }
      if ((child as Mesh).isMesh) {
        meshes += 1;
        if (child.castShadow && (child as Mesh).receiveShadow) shadowCasters += 1;
        const mat = (child as Mesh).material;
        const name = Array.isArray(mat) ? mat[0]?.name : mat.name;
        if (name === 'Glow') glow += 1;
      }
    });
    expect(skinned).toBeGreaterThan(0);
    expect(meshes).toBe(skinned);
    expect(shadowCasters).toBe(meshes + skinned);
    expect(glow).toBeGreaterThan(0);
    expect(floor).toBe(true);

    await waitFor(() => expect(setFrameloop).toHaveBeenLastCalledWith('always'));

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
