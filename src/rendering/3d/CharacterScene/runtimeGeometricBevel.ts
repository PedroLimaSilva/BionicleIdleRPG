/**
 * Runtime geometric bevel (spike).
 *
 * CPU finds sharp convex / concave dihedrals (position-welded adjacency, so
 * split-normal kit meshes still share edges). The GPU then interpolates
 * per-corner barycentric + triangle altitude varyings so fragments know
 * object-space distance to each triangle edge. Wear is a band of
 * `runtimeBevelRadius` along convex edges; cavity uses concave edges.
 *
 * This is the look a baked RG bevel map should match — view-independent,
 * UV-free, and not screen-space dFdx(normal).
 *
 * Vertex shader cannot compute dihedrals (no adjacency). It *does* carry the
 * barycentric / altitude / edge-weight varyings the fragment stage needs.
 */

import {
  BufferAttribute,
  BufferGeometry,
  InterleavedBufferAttribute,
  Mesh,
  Object3D,
  Vector3,
} from 'three';

export const BEVEL_BARY_ATTR = 'bevelBary';
export const BEVEL_CONVEX_ATTR = 'bevelConvex';
export const BEVEL_CONCAVE_ATTR = 'bevelConcave';
export const BEVEL_ALTITUDE_ATTR = 'bevelAltitude';

const WELD_QUANT = 1e5;
const COPLANAR_DOT = 0.998;
const processedCache = new WeakMap<BufferGeometry, BufferGeometry>();

const _ab = new Vector3();
const _ac = new Vector3();
const _tmp = new Vector3();

type Attr = BufferAttribute | InterleavedBufferAttribute;

function weldKey(x: number, y: number, z: number): string {
  return `${Math.round(x * WELD_QUANT)}:${Math.round(y * WELD_QUANT)}:${Math.round(z * WELD_QUANT)}`;
}

function faceNormal(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  cx: number,
  cy: number,
  cz: number,
  target: Vector3
): number {
  _ab.set(bx - ax, by - ay, bz - az);
  _ac.set(cx - ax, cy - ay, cz - az);
  target.crossVectors(_ab, _ac);
  const len = target.length();
  if (len < 1e-12) {
    target.set(0, 0, 0);
    return 0;
  }
  target.multiplyScalar(1 / len);
  return len;
}

function altitudeToEdge(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  cx: number,
  cy: number,
  cz: number
): number {
  const area2 = _tmp
    .crossVectors(_ab.set(bx - ax, by - ay, bz - az), _ac.set(cx - ax, cy - ay, cz - az))
    .length();
  const edge = Math.hypot(cx - bx, cy - by, cz - bz);
  if (edge < 1e-12) return 0;
  return area2 / edge;
}

function readComponent(attr: Attr, index: number, component: number): number {
  if (component === 0) return attr.getX(index);
  if (component === 1) return attr.getY(index);
  if (component === 2) return attr.getZ(index);
  return attr.getW(index);
}

function copyAttributeDeindexed(
  src: Attr,
  triIndex: ArrayLike<number>,
  itemSize: number
): BufferAttribute {
  const out = new Float32Array(triIndex.length * itemSize);
  for (let i = 0; i < triIndex.length; i++) {
    const srcI = triIndex[i];
    const dst = i * itemSize;
    for (let c = 0; c < itemSize; c++) {
      out[dst + c] = readComponent(src, srcI, c);
    }
  }
  return new BufferAttribute(out, itemSize);
}

function buildTriIndex(geometry: BufferGeometry): Uint32Array {
  const pos = geometry.getAttribute('position');
  const index = geometry.getIndex();
  if (index) {
    const out = new Uint32Array(index.count);
    for (let i = 0; i < index.count; i++) out[i] = index.getX(i);
    return out;
  }
  const out = new Uint32Array(pos.count);
  for (let i = 0; i < pos.count; i++) out[i] = i;
  return out;
}

/**
 * Returns a non-indexed geometry with bevel corner attributes. Cached per
 * source geometry. Does not mutate `source`.
 */
export function getRuntimeGeometricBevelGeometry(source: BufferGeometry): BufferGeometry {
  if (source.userData.runtimeGeometricBevel === true && source.getAttribute(BEVEL_BARY_ATTR)) {
    return source;
  }
  const cached = processedCache.get(source);
  if (cached) return cached;

  const pos = source.getAttribute('position');
  if (!pos || pos.count < 3) return source;

  const triIndex = buildTriIndex(source);
  const triCount = Math.floor(triIndex.length / 3);
  if (triCount < 1) return source;

  const weldOfSrc = new Int32Array(pos.count);
  const weldPos: number[] = [];
  const weldMap = new Map<string, number>();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = weldKey(x, y, z);
    let id = weldMap.get(key);
    if (id === undefined) {
      id = weldMap.size;
      weldMap.set(key, id);
      weldPos.push(x, y, z);
    }
    weldOfSrc[i] = id;
  }

  type Face = {
    n: Vector3;
    w: [number, number, number];
    area2: number;
  };
  const faces: Face[] = [];
  const edgeFaces = new Map<string, number[]>();

  for (let t = 0; t < triCount; t++) {
    const i0 = triIndex[t * 3];
    const i1 = triIndex[t * 3 + 1];
    const i2 = triIndex[t * 3 + 2];
    const n = new Vector3();
    const area2 = faceNormal(
      pos.getX(i0),
      pos.getY(i0),
      pos.getZ(i0),
      pos.getX(i1),
      pos.getY(i1),
      pos.getZ(i1),
      pos.getX(i2),
      pos.getY(i2),
      pos.getZ(i2),
      n
    );
    const w: [number, number, number] = [weldOfSrc[i0], weldOfSrc[i1], weldOfSrc[i2]];
    faces.push({ area2, n, w });
    const edges: Array<[number, number]> = [
      [w[0], w[1]],
      [w[1], w[2]],
      [w[2], w[0]],
    ];
    for (const [a, b] of edges) {
      const key = a < b ? `${a},${b}` : `${b},${a}`;
      const list = edgeFaces.get(key);
      if (list) list.push(t);
      else edgeFaces.set(key, [t]);
    }
  }

  const convexByFace = Array.from({ length: triCount }, () => [0, 0, 0]);
  const concaveByFace = Array.from({ length: triCount }, () => [0, 0, 0]);

  const oppositeCorner = (w: [number, number, number], ea: number, eb: number): number => {
    if (w[0] !== ea && w[0] !== eb) return 0;
    if (w[1] !== ea && w[1] !== eb) return 1;
    return 2;
  };

  const sharpnessFromDot = (dot: number): number => {
    const d = Math.min(1, Math.max(-1, dot));
    if (d >= COPLANAR_DOT) return 0;
    return Math.min(1, (1 - d) / 0.5);
  };

  for (const [key, incident] of edgeFaces) {
    if (incident.length < 2) continue;
    const comma = key.indexOf(',');
    const ea = Number(key.slice(0, comma));
    const eb = Number(key.slice(comma + 1));
    const aPos = new Vector3(weldPos[ea * 3], weldPos[ea * 3 + 1], weldPos[ea * 3 + 2]);

    for (let p = 0; p < incident.length; p++) {
      for (let q = p + 1; q < incident.length; q++) {
        const fa = incident[p];
        const fb = incident[q];
        const faceA = faces[fa];
        const faceB = faces[fb];
        const cornerB = oppositeCorner(faceB.w, ea, eb);
        const other = faceB.w[cornerB];
        _tmp.set(weldPos[other * 3], weldPos[other * 3 + 1], weldPos[other * 3 + 2]).sub(aPos);
        const side = faceA.n.dot(_tmp);
        const sharp = sharpnessFromDot(faceA.n.dot(faceB.n));
        const cornerA = oppositeCorner(faceA.w, ea, eb);
        if (side > 1e-8) {
          concaveByFace[fa][cornerA] = Math.max(concaveByFace[fa][cornerA], sharp);
          concaveByFace[fb][cornerB] = Math.max(concaveByFace[fb][cornerB], sharp);
        } else if (side < -1e-8) {
          convexByFace[fa][cornerA] = Math.max(convexByFace[fa][cornerA], sharp);
          convexByFace[fb][cornerB] = Math.max(convexByFace[fb][cornerB], sharp);
        }
      }
    }
  }

  const bary = new Float32Array(triCount * 9);
  const convex = new Float32Array(triCount * 9);
  const concave = new Float32Array(triCount * 9);
  const altitude = new Float32Array(triCount * 9);
  const baryCorner = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  for (let t = 0; t < triCount; t++) {
    const i0 = triIndex[t * 3];
    const i1 = triIndex[t * 3 + 1];
    const i2 = triIndex[t * 3 + 2];
    const ax = pos.getX(i0);
    const ay = pos.getY(i0);
    const az = pos.getZ(i0);
    const bx = pos.getX(i1);
    const by = pos.getY(i1);
    const bz = pos.getZ(i1);
    const cx = pos.getX(i2);
    const cy = pos.getY(i2);
    const cz = pos.getZ(i2);
    const h0 = altitudeToEdge(ax, ay, az, bx, by, bz, cx, cy, cz);
    const h1 = altitudeToEdge(bx, by, bz, cx, cy, cz, ax, ay, az);
    const h2 = altitudeToEdge(cx, cy, cz, ax, ay, az, bx, by, bz);
    const heights = [h0, h1, h2];
    for (let k = 0; k < 3; k++) {
      const dst = (t * 3 + k) * 3;
      bary[dst] = baryCorner[k][0];
      bary[dst + 1] = baryCorner[k][1];
      bary[dst + 2] = baryCorner[k][2];
      convex[dst] = convexByFace[t][0];
      convex[dst + 1] = convexByFace[t][1];
      convex[dst + 2] = convexByFace[t][2];
      concave[dst] = concaveByFace[t][0];
      concave[dst + 1] = concaveByFace[t][1];
      concave[dst + 2] = concaveByFace[t][2];
      altitude[dst] = heights[0];
      altitude[dst + 1] = heights[1];
      altitude[dst + 2] = heights[2];
    }
  }

  const out = new BufferGeometry();
  for (const name of Object.keys(source.attributes)) {
    if (name.startsWith('bevel')) continue;
    const attr = source.getAttribute(name);
    if (!attr) continue;
    out.setAttribute(name, copyAttributeDeindexed(attr, triIndex, attr.itemSize));
  }
  out.setAttribute(BEVEL_BARY_ATTR, new BufferAttribute(bary, 3));
  out.setAttribute(BEVEL_CONVEX_ATTR, new BufferAttribute(convex, 3));
  out.setAttribute(BEVEL_CONCAVE_ATTR, new BufferAttribute(concave, 3));
  out.setAttribute(BEVEL_ALTITUDE_ATTR, new BufferAttribute(altitude, 3));
  if (source.groups.length > 0) {
    for (const group of source.groups) {
      out.addGroup(group.start, group.count, group.materialIndex);
    }
  }
  out.userData = { ...source.userData, runtimeGeometricBevel: true };
  processedCache.set(source, out);
  return out;
}

export function meshHasRuntimeBevel(mesh: Mesh): boolean {
  const attr = mesh.geometry?.getAttribute(BEVEL_BARY_ATTR);
  return !!attr && attr.count > 0;
}

/** Replace mesh geometries under `root` with cached runtime-bevel variants. */
export function applyRuntimeGeometricBevelToObject(root: Object3D): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    if (!mesh.geometry) return;
    mesh.geometry = getRuntimeGeometricBevelGeometry(mesh.geometry);
  });
}
