import { Mesh, MeshStandardMaterial, Object3D, Texture } from 'three';
import { isDummyNormalMap } from './dummyTextures';

export const AUTHORED_NORMAL_SCALE_USERDATA_KEY = 'authoredNormalScale';

type Scale2 = { x: number; y: number };

function isTextureValue(map: unknown): map is Texture {
  return !!map && (map as Texture).isTexture === true;
}

function isRenderableNormalMap(map: unknown): map is Texture {
  return isTextureValue(map) && !isDummyNormalMap(map);
}

function readStashedScale(mat: MeshStandardMaterial): Scale2 | null {
  const stash = mat.userData[AUTHORED_NORMAL_SCALE_USERDATA_KEY] as Scale2 | undefined;
  if (!stash || !Number.isFinite(stash.x) || !Number.isFinite(stash.y)) return null;
  return stash;
}

/**
 * Dex preview: keep the tangent map bound and zero / restore `normalScale`
 * so toggling does not rebuild weathered materials.
 */
export function setAuthoredNormalMapsEnabled(root: Object3D, enabled: boolean): number {
  let count = 0;
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      const mat = raw as MeshStandardMaterial;
      if (!isRenderableNormalMap(mat.normalMap)) continue;
      if (enabled) {
        const stash = readStashedScale(mat);
        mat.normalScale.set(stash?.x ?? 1, stash?.y ?? 1);
      } else {
        const { x, y } = mat.normalScale;
        if (x !== 0 || y !== 0) {
          mat.userData[AUTHORED_NORMAL_SCALE_USERDATA_KEY] = { x, y };
        }
        mat.normalScale.set(0, 0);
      }
      count += 1;
    }
  });
  return count;
}
