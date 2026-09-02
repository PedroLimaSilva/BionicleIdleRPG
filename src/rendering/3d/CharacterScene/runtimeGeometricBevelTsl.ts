/**
 * TSL graph for runtime geometric bevel — same math as the GLSL weathered path.
 *
 * three **0.160** exposes this language as `three/nodes` (`tslFn`, `attribute`,
 * `varying`, `fwidth`). The later `three/tsl` entry and first-class WebGPU
 * NodeMaterials land around r167+. This Canvas still uses WebGLRenderer
 * without the legacy `WebGLNodes` patch (that patch overrides
 * `Material.onBeforeRender` and would break `onBeforeCompile` weathering).
 *
 * Vertex GPU: `varying(attribute('bevelBary'|'bevelConvex'|…))` is exactly
 * the interpolator the fragment stage needs. Dihedrals stay CPU-side.
 *
 * Future wiring once WebGPU / TSL materials are on the canvas:
 *
 *   const packed = runtimeBevelPackedNode({ radius: 0.12 });
 *   mat.colorNode = vec3(packed.x, packed.y, 0); // debug RG
 */

import { attribute, float, max, smoothstep, tslFn, varying, vec3 } from 'three/nodes';
import {
  BEVEL_ALTITUDE_ATTR,
  BEVEL_BARY_ATTR,
  BEVEL_CONCAVE_ATTR,
  BEVEL_CONVEX_ATTR,
} from './runtimeGeometricBevel';

export type RuntimeBevelTslInputs = {
  radius: number;
};

function edgeBand(dist: ReturnType<typeof varying>, radius: ReturnType<typeof float>) {
  return float(1).sub(smoothstep(float(0), radius, dist));
}

/** Packed vec3: x = convex wear, y = concave cavity, z = 0. */
export const runtimeBevelPackedNode = tslFn(({ radius }: RuntimeBevelTslInputs) => {
  const bary = varying(attribute(BEVEL_BARY_ATTR, 'vec3'));
  const convex = varying(attribute(BEVEL_CONVEX_ATTR, 'vec3'));
  const concave = varying(attribute(BEVEL_CONCAVE_ATTR, 'vec3'));
  const altitude = varying(attribute(BEVEL_ALTITUDE_ATTR, 'vec3'));
  const r = float(radius);
  const dist = bary.mul(altitude);
  const wear = max(
    max(edgeBand(dist.x, r).mul(convex.x), edgeBand(dist.y, r).mul(convex.y)),
    edgeBand(dist.z, r).mul(convex.z)
  );
  const cavity = max(
    max(edgeBand(dist.x, r).mul(concave.x), edgeBand(dist.y, r).mul(concave.y)),
    edgeBand(dist.z, r).mul(concave.z)
  );
  return vec3(wear, cavity, float(0));
});
