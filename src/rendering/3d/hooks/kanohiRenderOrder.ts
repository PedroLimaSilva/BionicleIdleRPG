import { Mesh, Object3D } from 'three';

/** Kanohi masks draw before transmissive brain gel (`TRANSMISSIVE_KIT_RENDER_ORDER`). */
export const KANOHI_RENDER_ORDER = 10;

export function applyKanohiRenderOrder(root: Object3D): void {
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      (child as Mesh).renderOrder = KANOHI_RENDER_ORDER;
    }
  });
}
