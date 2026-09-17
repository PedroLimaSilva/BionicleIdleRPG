import { NodeMaterial } from 'three/webgpu';
import { readTopologyProgramCacheKey, type TopologyCacheMaterial } from './topologyCacheKey';

type NodeMaterialCtor = {
  prototype: { customProgramCacheKey: (this: TopologyCacheMaterial) => string };
};

let installed = false;
let originalCustomProgramCacheKey:
  | NodeMaterialCtor['prototype']['customProgramCacheKey']
  | undefined;

function topologyAwareCustomProgramCacheKey(this: TopologyCacheMaterial): string {
  const stored = readTopologyProgramCacheKey(this);
  if (stored !== undefined) return stored;
  return originalCustomProgramCacheKey?.call(this) ?? '';
}

/**
 * WebGPU only: skip `NodeMaterial`'s per-draw TSL graph hash when the source
 * material stored a topology key. Harmless no-op if `NodeMaterial` is missing.
 */
export function installTopologyCacheKeyPatch(): void {
  if (installed) return;
  const ctor = NodeMaterial as unknown as NodeMaterialCtor | undefined;
  if (!ctor?.prototype || typeof ctor.prototype.customProgramCacheKey !== 'function') {
    return;
  }
  originalCustomProgramCacheKey = ctor.prototype.customProgramCacheKey;
  ctor.prototype.customProgramCacheKey = topologyAwareCustomProgramCacheKey;
  installed = true;
}

export function isTopologyCacheKeyPatchInstalled(): boolean {
  return installed;
}

/** Test-only: restore Three's original `NodeMaterial.customProgramCacheKey`. */
export function uninstallTopologyCacheKeyPatchForTests(): void {
  if (!installed) return;
  const ctor = NodeMaterial as unknown as NodeMaterialCtor | undefined;
  if (ctor?.prototype && originalCustomProgramCacheKey) {
    ctor.prototype.customProgramCacheKey = originalCustomProgramCacheKey;
  }
  installed = false;
}
