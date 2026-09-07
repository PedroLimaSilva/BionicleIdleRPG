import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  Bone,
  BufferAttribute,
  BufferGeometry,
  Material,
  Matrix4,
  Mesh,
  Object3D,
  SkinnedMesh,
} from 'three';
import { isTransmissiveKitMaterial } from './transmissiveKitMaterial';
import type { SelectiveBloomMrtMaterial } from '../CharacterScene/selectiveBloom';

export type KitMeshMergeEntry = {
  geometry: BufferGeometry;
  material: Material;
  renderOrder: number;
};

export type KitMergeGroupKey = string;

function hasSelectiveBloomMrt(mat: Material): boolean {
  return !!(mat as SelectiveBloomMrtMaterial).mrtNode;
}

/**
 * Kit meshes we can batch: single material, rigid (not skinned), no transmissive
 * or selective-bloom MRT (incompatible render order / MRT writes).
 */
export function isMergeableKitMesh(mesh: Mesh): boolean {
  if ((mesh as SkinnedMesh).isSkinnedMesh) return false;
  if (!mesh.geometry) return false;
  const material = mesh.material;
  if (!material || Array.isArray(material)) return false;
  if (isTransmissiveKitMaterial(material)) return false;
  if (hasSelectiveBloomMrt(material)) return false;
  return true;
}

/**
 * Nearest animated ancestor for rigid kit parts. Socket empties inherit bone motion;
 * baking mesh transforms into this anchor keeps merged geometry on-rig.
 */
export function findKitMergeAnchor(socket: Object3D): Object3D {
  let current: Object3D | null = socket;
  while (current) {
    if ((current as Bone).isBone) return current;
    current = current.parent;
  }
  return socket;
}

export function kitMergeGroupKey(
  anchor: Object3D,
  material: Material,
  renderOrder: number
): KitMergeGroupKey {
  return `${anchor.uuid}|${material.uuid}|${renderOrder}`;
}

/**
 * Clone mesh geometry, bake world transform into anchor-local space, and detach
 * the source mesh from its parent.
 */
export function extractMergeableKitMesh(
  mesh: Mesh,
  _anchor: Object3D,
  anchorInverse: Matrix4
): KitMeshMergeEntry | null {
  if (!isMergeableKitMesh(mesh)) return null;

  mesh.updateMatrixWorld(true);
  const bakeMatrix = new Matrix4().multiplyMatrices(anchorInverse, mesh.matrixWorld);
  const geometry = mesh.geometry.clone();
  geometry.applyMatrix4(bakeMatrix);

  const material = mesh.material as Material;
  const entry: KitMeshMergeEntry = {
    geometry,
    material,
    renderOrder: mesh.renderOrder,
  };

  mesh.parent?.remove(mesh);
  mesh.geometry.dispose();

  return entry;
}

/** Attributes kept when batching kit meshes; extras (tangent, color, uv2) vary per GLB node. */
const MERGE_GEOMETRY_ATTRIBUTES = ['position', 'normal', 'uv'] as const;

/**
 * Kit GLB nodes export inconsistent attribute sets (some omit `uv`, some add `color` /
 * `tangent`). `mergeGeometries` requires an identical attribute layout on every geometry.
 */
export function normalizeKitGeometryForMerge(geometry: BufferGeometry): BufferGeometry {
  const geo = geometry.clone();
  const position = geo.getAttribute('position');
  if (!position) {
    throw new Error('Kit geometry is missing a position attribute');
  }

  const count = position.count;
  if (!geo.getAttribute('normal')) {
    geo.computeVertexNormals();
  }
  if (!geo.getAttribute('uv')) {
    geo.setAttribute('uv', new BufferAttribute(new Float32Array(count * 2), 2));
  }

  for (const name of Object.keys(geo.attributes)) {
    if (!(MERGE_GEOMETRY_ATTRIBUTES as readonly string[]).includes(name)) {
      geo.deleteAttribute(name);
    }
  }

  return geo;
}

function alignKitGeometriesForMerge(geometries: BufferGeometry[]): BufferGeometry[] {
  const normalized = geometries.map(normalizeKitGeometryForMerge);
  const anyIndexed = normalized.some((geometry) => geometry.index !== null);
  const anyNonIndexed = normalized.some((geometry) => geometry.index === null);
  if (!anyIndexed || !anyNonIndexed) {
    return normalized;
  }
  return normalized.map((geometry) => (geometry.index ? geometry : geometry.toNonIndexed()));
}

/**
 * Merge rigid kit mesh entries that share an anchor bone, material instance, and
 * render order. Returns meshes parented to their merge anchors.
 */
export function buildMergedKitMeshes(
  entries: ReadonlyArray<KitMeshMergeEntry & { anchor: Object3D }>
): Mesh[] {
  const groups = new Map<KitMergeGroupKey, { anchor: Object3D; items: KitMeshMergeEntry[] }>();

  for (const entry of entries) {
    const key = kitMergeGroupKey(entry.anchor, entry.material, entry.renderOrder);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.items.push(entry);
    } else {
      groups.set(key, { anchor: entry.anchor, items: [entry] });
    }
  }

  const merged: Mesh[] = [];

  for (const { anchor, items } of groups.values()) {
    if (items.length === 1) {
      const { geometry, material, renderOrder } = items[0];
      const mesh = new Mesh(geometry, material);
      mesh.renderOrder = renderOrder;
      anchor.add(mesh);
      merged.push(mesh);
      continue;
    }

    const geometries = alignKitGeometriesForMerge(items.map((item) => item.geometry));
    const mergedGeometry = mergeGeometries(geometries, false);
    if (!mergedGeometry) {
      for (const item of items) {
        const mesh = new Mesh(item.geometry, item.material);
        mesh.renderOrder = item.renderOrder;
        anchor.add(mesh);
        merged.push(mesh);
      }
      continue;
    }

    for (const geometry of geometries) {
      geometry.dispose();
    }

    const { material, renderOrder } = items[0];
    const mesh = new Mesh(mergedGeometry, material);
    mesh.renderOrder = renderOrder;
    anchor.add(mesh);
    merged.push(mesh);
  }

  return merged;
}

/**
 * Walk a kit clone, extract mergeable meshes into anchor-local baked geometry,
 * and remove emptied wrapper nodes.
 */
export function extractMergeableMeshesFromClone(
  clone: Object3D,
  socket: Object3D,
  entries: Array<KitMeshMergeEntry & { anchor: Object3D }>
): void {
  const anchor = findKitMergeAnchor(socket);
  anchor.updateMatrixWorld(true);
  const anchorInverse = new Matrix4().copy(anchor.matrixWorld).invert();

  const meshes: Mesh[] = [];
  clone.traverse((child) => {
    if ((child as Mesh).isMesh) meshes.push(child as Mesh);
  });

  for (const mesh of meshes) {
    const entry = extractMergeableKitMesh(mesh, anchor, anchorInverse);
    if (!entry) continue;
    entries.push({ ...entry, anchor });
  }

  pruneEmptyObject3D(clone);
}

function pruneEmptyObject3D(root: Object3D): void {
  const empty: Object3D[] = [];
  root.traverse((child) => {
    if (child === root) return;
    let hasMesh = false;
    child.traverse((desc) => {
      if ((desc as Mesh).isMesh) hasMesh = true;
    });
    if (!hasMesh) empty.push(child);
  });
  for (const node of empty) {
    node.parent?.remove(node);
  }
}

export function disposeMergedKitMeshes(meshes: Mesh[]): void {
  for (const mesh of meshes) {
    mesh.parent?.remove(mesh);
    mesh.geometry.dispose();
  }
}
