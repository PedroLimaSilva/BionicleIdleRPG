import type { BufferGeometry, Material, Object3D } from 'three';
import { Mesh } from 'three';

export const SHARED_GPU_RESOURCE_USERDATA_KEY = 'sharedGpuResource';

type GpuResource = { userData?: Record<string, unknown> };

/**
 * Marks a material or geometry that is interned (weathered-metal cache, shared
 * gauntlet battle slots, GLTF template geometry). Dispose must skip these or
 * later combatants / waves lose their GPU objects.
 */
export function markSharedGpuResource(resource: GpuResource): void {
  resource.userData ??= {};
  resource.userData[SHARED_GPU_RESOURCE_USERDATA_KEY] = true;
}

export function isSharedGpuResource(resource: GpuResource | null | undefined): boolean {
  return resource?.userData?.[SHARED_GPU_RESOURCE_USERDATA_KEY] === true;
}

export type DisposeObject3DOptions = {
  /**
   * When false (default), only mesh geometries are disposed. Many battle meshes share
   * materials from caches or GLTF templates; disposing those would break other instances.
   */
  disposeMaterials?: boolean;
};

/**
 * Frees GPU memory under `root`. Default: geometry only (safe for shared materials).
 * Use for GLB clones that are not auto-disposed by R3F `<primitive>`.
 * Shared interned materials/geometry are never disposed.
 */
export function disposeObject3DResources(root: Object3D, options?: DisposeObject3DOptions): void {
  const disposeMaterials = options?.disposeMaterials ?? false;
  root.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const mesh = obj as Mesh;
    const geometry = mesh.geometry as BufferGeometry | undefined;
    if (geometry && !isSharedGpuResource(geometry)) {
      geometry.dispose();
    }

    if (!disposeMaterials) return;

    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach(disposeMaterialIfOwned);
    } else if (mat) {
      disposeMaterialIfOwned(mat);
    }
  });
}

function disposeMaterialIfOwned(material: Material): void {
  if (isSharedGpuResource(material)) return;
  material.dispose?.();
}
