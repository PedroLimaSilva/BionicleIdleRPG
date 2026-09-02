import { BoxGeometry, BufferAttribute, BufferGeometry, Mesh, PlaneGeometry } from 'three';
import {
  BEVEL_ALTITUDE_ATTR,
  BEVEL_BARY_ATTR,
  BEVEL_CONCAVE_ATTR,
  BEVEL_CONVEX_ATTR,
  getRuntimeGeometricBevelGeometry,
  meshHasRuntimeBevel,
} from './runtimeGeometricBevel';

function triangleWeights(
  geometry: BufferGeometry,
  tri: number
): { concave: number[]; convex: number[] } {
  const convex = geometry.getAttribute(BEVEL_CONVEX_ATTR);
  const concave = geometry.getAttribute(BEVEL_CONCAVE_ATTR);
  const i = tri * 3;
  return {
    concave: [concave.getX(i), concave.getY(i), concave.getZ(i)],
    convex: [convex.getX(i), convex.getY(i), convex.getZ(i)],
  };
}

describe('runtime geometric bevel', () => {
  test('does not mutate the source geometry', () => {
    const src = new BoxGeometry(1, 1, 1);
    const before = src.getAttribute('position').count;
    const out = getRuntimeGeometricBevelGeometry(src);
    expect(out).not.toBe(src);
    expect(src.getAttribute('position').count).toBe(before);
    expect(src.getAttribute(BEVEL_BARY_ATTR)).toBeUndefined();
    expect(out.userData.runtimeGeometricBevel).toBe(true);
  });

  test('caches the processed geometry per source', () => {
    const src = new BoxGeometry(1, 1, 1);
    expect(getRuntimeGeometricBevelGeometry(src)).toBe(getRuntimeGeometricBevelGeometry(src));
  });

  test('cube faces keep a coplanar diagonal and mark the 90° edges convex', () => {
    const out = getRuntimeGeometricBevelGeometry(new BoxGeometry(1, 1, 1));
    expect(out.getIndex()).toBeNull();
    expect(out.getAttribute(BEVEL_BARY_ATTR).count).toBe(36);
    const triCount = 12;
    for (let t = 0; t < triCount; t++) {
      const { concave, convex } = triangleWeights(out, t);
      expect(Math.max(...concave)).toBeLessThan(0.15);
      expect(Math.max(...convex)).toBeGreaterThan(0.7);
      expect(Math.min(...convex)).toBeLessThan(0.15);
    }
  });

  test('a flat plane has no geometric bevel', () => {
    const out = getRuntimeGeometricBevelGeometry(new PlaneGeometry(2, 2, 2, 2));
    const convex = out.getAttribute(BEVEL_CONVEX_ATTR);
    const concave = out.getAttribute(BEVEL_CONCAVE_ATTR);
    for (let i = 0; i < convex.count; i++) {
      expect(Math.max(convex.getX(i), convex.getY(i), convex.getZ(i))).toBeLessThan(0.15);
      expect(Math.max(concave.getX(i), concave.getY(i), concave.getZ(i))).toBeLessThan(0.15);
    }
  });

  test('a valley fold is concave on the shared edge', () => {
    const src = new BufferGeometry();
    src.setAttribute(
      'position',
      new BufferAttribute(
        new Float32Array([0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0.5, -1, 0]),
        3
      )
    );
    const out = getRuntimeGeometricBevelGeometry(src);
    const { concave, convex } = triangleWeights(out, 0);
    const shared = Math.max(concave[0], concave[1], concave[2]);
    expect(shared).toBeGreaterThan(0.7);
    expect(Math.max(...convex)).toBeLessThan(0.15);
  });

  test('face interiors are farther from sharp edges than the vertices', () => {
    const out = getRuntimeGeometricBevelGeometry(new BoxGeometry(1, 1, 1));
    const bary = out.getAttribute(BEVEL_BARY_ATTR);
    const alt = out.getAttribute(BEVEL_ALTITUDE_ATTR);
    const convex = out.getAttribute(BEVEL_CONVEX_ATTR);
    const centroidDist: number[] = [];
    const vertexDist: number[] = [];
    for (let t = 0; t < 12; t++) {
      const i = t * 3;
      const cx = convex.getX(i);
      const cy = convex.getY(i);
      const cz = convex.getZ(i);
      const hx = alt.getX(i);
      const hy = alt.getY(i);
      const hz = alt.getZ(i);
      const centroid = Math.min(
        cx > 0.5 ? (1 / 3) * hx : Infinity,
        cy > 0.5 ? (1 / 3) * hy : Infinity,
        cz > 0.5 ? (1 / 3) * hz : Infinity
      );
      centroidDist.push(centroid);
      vertexDist.push(0);
      expect(bary.getX(i)).toBe(1);
      expect(bary.getY(i)).toBe(0);
    }
    expect(Math.min(...centroidDist)).toBeGreaterThan(0.2);
    expect(Math.max(...vertexDist)).toBe(0);
  });

  test('meshHasRuntimeBevel is true only after processing', () => {
    const geom: BufferGeometry = new BoxGeometry(1, 1, 1);
    const mesh = new Mesh(geom);
    expect(meshHasRuntimeBevel(mesh)).toBe(false);
    mesh.geometry = getRuntimeGeometricBevelGeometry(mesh.geometry);
    expect(meshHasRuntimeBevel(mesh)).toBe(true);
  });
});
