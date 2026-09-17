import { MeshStandardMaterial } from 'three';
import { NodeMaterial } from 'three/webgpu';
import {
  installTopologyCacheKeyPatch,
  isTopologyCacheKeyPatchInstalled,
  uninstallTopologyCacheKeyPatchForTests,
} from './installTopologyCacheKeyPatch';
import {
  readTopologyProgramCacheKey,
  setTopologyProgramCacheKey,
  TOPOLOGY_PROGRAM_CACHE_KEY,
} from './topologyCacheKey';

describe('setTopologyProgramCacheKey', () => {
  test('stores the key in userData and customProgramCacheKey', () => {
    const mat = new MeshStandardMaterial();
    setTopologyProgramCacheKey(mat, 'WeatheredMetal|||dent');
    expect(mat.userData[TOPOLOGY_PROGRAM_CACHE_KEY]).toBe('WeatheredMetal|||dent');
    expect(mat.customProgramCacheKey()).toBe('WeatheredMetal|||dent');
    expect(readTopologyProgramCacheKey(mat)).toBe('WeatheredMetal|||dent');
  });
});

describe('installTopologyCacheKeyPatch', () => {
  const defaultCustomProgramCacheKey = NodeMaterial.prototype.customProgramCacheKey;

  afterEach(() => {
    uninstallTopologyCacheKeyPatchForTests();
    NodeMaterial.prototype.customProgramCacheKey = defaultCustomProgramCacheKey;
  });

  test('NodeMaterial uses userData instead of walking the TSL graph', () => {
    const walked = jest.fn(() => 'walked-graph');
    NodeMaterial.prototype.customProgramCacheKey = walked;

    installTopologyCacheKeyPatch();
    expect(isTopologyCacheKeyPatchInstalled()).toBe(true);

    const nodeMat = new NodeMaterial();
    nodeMat.userData = { [TOPOLOGY_PROGRAM_CACHE_KEY]: 'WeatheredMetal|alb||dc' };
    expect(nodeMat.customProgramCacheKey()).toBe('WeatheredMetal|alb||dc');
    expect(walked).not.toHaveBeenCalled();
  });

  test('materials without a topology key still walk', () => {
    const walked = jest.fn(() => 'walked-graph');
    NodeMaterial.prototype.customProgramCacheKey = walked;

    installTopologyCacheKeyPatch();
    const nodeMat = new NodeMaterial();
    expect(nodeMat.customProgramCacheKey()).toBe('walked-graph');
    expect(walked).toHaveBeenCalledTimes(1);
  });

  test('fromMaterial-style userData copy keeps the cheap key on NodeMaterial', () => {
    const source = new MeshStandardMaterial();
    setTopologyProgramCacheKey(source, 'transmissiveKit|brain|bloom1');

    installTopologyCacheKeyPatch();
    const nodeMat = new NodeMaterial();
    nodeMat.userData = source.userData;
    expect(nodeMat.customProgramCacheKey()).toBe('transmissiveKit|brain|bloom1');
  });
});
