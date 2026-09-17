/**
 * Topology-only GPU program identity for TSL materials.
 *
 * Three's WebGPU path converts `MeshStandardMaterial` to `NodeMaterial` via
 * `NodeLibrary.fromMaterial`, which copies `userData` by reference but then
 * uses `NodeMaterial.customProgramCacheKey` — that walks `_getNodeChildren()`
 * and hashes the whole FBM graph every draw (`getMaterialCacheKey` / `cyrb53`).
 * Storing the key in `userData` survives that conversion; the WebGPU prototype
 * patch in {@link installTopologyCacheKeyPatch} reads it instead of walking.
 */

export const TOPOLOGY_PROGRAM_CACHE_KEY = 'topologyProgramCacheKey';

export type TopologyCacheMaterial = {
  customProgramCacheKey?: () => string;
  userData?: Record<string, unknown>;
};

export function readTopologyProgramCacheKey(mat: TopologyCacheMaterial): string | undefined {
  const stored = mat.userData?.[TOPOLOGY_PROGRAM_CACHE_KEY];
  return typeof stored === 'string' ? stored : undefined;
}

/**
 * Pins a topology-only program key on `userData` and as `customProgramCacheKey`.
 * Color, maps, and grime stay uniforms/bindings — they must not be in `key`.
 */
export function setTopologyProgramCacheKey(mat: TopologyCacheMaterial, key: string): void {
  mat.userData ??= {};
  mat.userData[TOPOLOGY_PROGRAM_CACHE_KEY] = key;
  mat.customProgramCacheKey = function topologyProgramCacheKey(this: TopologyCacheMaterial) {
    return readTopologyProgramCacheKey(this) ?? key;
  };
}
