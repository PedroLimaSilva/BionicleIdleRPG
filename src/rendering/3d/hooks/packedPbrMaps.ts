import { Mesh, MeshStandardMaterial, Object3D } from 'three';

export const PACKED_ROUGHNESS_HAS_MAP_KEY = 'packedRoughnessHasMap';
export const PACKED_METALNESS_HAS_MAP_KEY = 'packedMetalnessHasMap';

/**
 * Packed diminished sheets: emissive R/G drive roughness / metalness. Dex
 * preview keeps the bake bound and zeros these flags so toggling does not
 * rebuild weathered materials. Flat fallback is `material.roughness` /
 * `material.metalness`.
 */
export function writePackedPbrChannelFlags(mat: MeshStandardMaterial, packed: boolean): void {
  if (!packed) {
    delete mat.userData[PACKED_ROUGHNESS_HAS_MAP_KEY];
    delete mat.userData[PACKED_METALNESS_HAS_MAP_KEY];
    return;
  }
  mat.userData[PACKED_ROUGHNESS_HAS_MAP_KEY] = 1;
  mat.userData[PACKED_METALNESS_HAS_MAP_KEY] = 1;
}

function setPackedChannelEnabled(root: Object3D, key: string, enabled: boolean): number {
  let count = 0;
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      const mat = raw as MeshStandardMaterial;
      if (typeof mat.userData[key] !== 'number') continue;
      mat.userData[key] = enabled ? 1 : 0;
      count += 1;
    }
  });
  return count;
}

export function setPackedRoughnessEnabled(root: Object3D, enabled: boolean): number {
  return setPackedChannelEnabled(root, PACKED_ROUGHNESS_HAS_MAP_KEY, enabled);
}

export function setPackedMetalnessEnabled(root: Object3D, enabled: boolean): number {
  return setPackedChannelEnabled(root, PACKED_METALNESS_HAS_MAP_KEY, enabled);
}
