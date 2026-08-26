import * as THREE from 'three';
import { applyArenaRecolor } from './arenaRecolor';
import type { ArenaRecolor } from './types';

/** glTF object names exported from the Blender layout reference (hidden at runtime). */
const ARENA_MARKER_NAME = /^Arena(LayoutGuides|Boundary|Center)$/;
const ARENA_SLOT_NAME = /^(Team|Enemy)Slot(Marker|Guide)?\d*$/;

/** Blender material used for layout marker meshes in some arena exports. */
const ARENA_MARKER_MATERIALS = new Set([
  'Places',
  'Material_3',
  'Material_4',
  'Material_5',
  'Material_6',
  'Material_7',
  'Material_8',
  'Material_9',
]);

export function isArenaLayoutMarker(object: THREE.Object3D): boolean {
  if (ARENA_MARKER_NAME.test(object.name) || ARENA_SLOT_NAME.test(object.name)) {
    return true;
  }

  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.some((material) => material?.name && ARENA_MARKER_MATERIALS.has(material.name))) {
      return true;
    }
  }

  return false;
}

/** Baked sand ground from `arena_desert.glb` — replaced at runtime by `HoneycombFloor`. */
export function isArenaGlbGroundPlane(mesh: THREE.Mesh): boolean {
  if (mesh.name === 'Plane' || mesh.name.startsWith('Ground')) {
    return true;
  }
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some((material) => material?.name?.includes('Ground'));
}

export function shouldSkipArenaShadow(mesh: THREE.Mesh): boolean {
  if (isArenaGlbGroundPlane(mesh) || mesh.name === 'HitImpactParticles') {
    return true;
  }
  return isArenaLayoutMarker(mesh);
}

interface PrepareArenaGlbSceneOptions {
  receiveShadow: boolean;
  /** Optional element-tribe recolor applied to (cloned) arena materials. */
  recolor?: ArenaRecolor;
}

/** Clone arena glTF, hide layout markers, and apply shadow flags to environment meshes. */
export function prepareArenaGlbScene(
  source: THREE.Object3D,
  { receiveShadow, recolor }: PrepareArenaGlbSceneOptions
): THREE.Object3D {
  const clone = source.clone(true);

  clone.traverse((child) => {
    if (isArenaLayoutMarker(child)) {
      child.visible = false;
      return;
    }

    if ((child as THREE.Mesh).isMesh && isArenaGlbGroundPlane(child as THREE.Mesh)) {
      child.visible = false;
      return;
    }

    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.receiveShadow = receiveShadow;
      mesh.castShadow = receiveShadow;
    }
  });

  if (recolor) {
    applyArenaRecolor(clone, recolor);
  }

  return clone;
}
