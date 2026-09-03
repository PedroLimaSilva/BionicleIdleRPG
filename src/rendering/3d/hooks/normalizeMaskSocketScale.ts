import { Object3D } from 'three';

/**
 * `masks.glb` is authored at final size. Older Mata / Turaga / rebuilt /
 * diminished rigs still ship a ~37× `Masks` socket from when the Kanohi GLB
 * was tiny — neutralize that so attached masks are not scaled up twice.
 *
 * Logs in non-production when the socket is actually the wrong scale, so the
 * rig can be re-exported at 1× and this workaround removed.
 */
export function normalizeMaskSocketScale(masksParent: Object3D): void {
  const { x, y, z } = masksParent.scale;
  if (x === 1 && y === 1 && z === 1) return;

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[useMask] Neutralizing Masks socket scale (${x}, ${y}, ${z}) on '${masksParent.name}'. ` +
        'Re-export the rig at 1× so this workaround can be removed.'
    );
  }

  masksParent.scale.set(1, 1, 1);
}
