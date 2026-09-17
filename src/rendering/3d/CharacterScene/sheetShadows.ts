import { Mesh, type Object3D } from 'three';
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';

/**
 * Character / Rahkshi sheets: one directional map over the framing cylinder.
 *
 * The old 2048² camera covered ±2× radius / ±0.75× height, so most texels were
 * empty air. Fit the ortho camera to the cylinder's bounding sphere and drop to
 * 1024² — similar coverage, half the shadow-pass fill, and PCFSoft hides the
 * coarser texels. Kit meshes both cast and receive so mask-on-face and armor
 * overlap read on the figure (the studio floor is almost never in camera).
 */
export const SHEET_SHADOW_MAP_SIZE = 1024;

/** Bounding sphere of the grounded cylinder, with a little pad for idle motion. */
export const SHEET_SHADOW_CAM_EXTENT = Math.hypot(CYLINDER_RADIUS, CYLINDER_HEIGHT / 2) * 1.15;

export const SHEET_SHADOW_CAM_NEAR = 0.5;
export const SHEET_SHADOW_CAM_FAR = 32;
export const SHEET_SHADOW_BIAS = -0.0005;
export const SHEET_SHADOW_NORMAL_BIAS = 0.01;

/** Kit / body / mask meshes cast onto each other and receive the same map. */
export function applySheetMeshShadows(root: Object3D | null | undefined): void {
  if (!root) return;
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}
