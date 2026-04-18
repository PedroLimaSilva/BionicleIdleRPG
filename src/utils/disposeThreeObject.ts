import type { Material, Object3D } from 'three';
import { Mesh } from 'three';

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
 */
export function disposeObject3DResources(root: Object3D, options?: DisposeObject3DOptions): void {
  const disposeMaterials = options?.disposeMaterials ?? false;
  root.traverse((obj) => {
    if (!(obj as Mesh).isMesh) return;
    const mesh = obj as Mesh;
    mesh.geometry?.dispose();

    if (!disposeMaterials) return;

    const mat = mesh.material;
    if (Array.isArray(mat)) {
      mat.forEach(disposeMaterial);
    } else if (mat) {
      disposeMaterial(mat);
    }
  });
}

function disposeMaterial(material: Material): void {
  material.dispose?.();
}
