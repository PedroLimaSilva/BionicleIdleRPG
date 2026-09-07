import type { Material, Object3D } from 'three';
import { Mesh } from 'three';

/** GPU frame counters from `renderer.info` (live HUD only — timing-sensitive). */
export type FrameRenderStats = {
  drawCalls: number;
  triangles: number;
  lines: number;
  points: number;
};

/**
 * Stable scene-graph cost for a character subtree. Counted on the CPU so refresh
 * rate and render-pipeline timing do not affect the result.
 */
export type SceneGraphRenderStats = {
  /** One GPU draw per mesh material slot (multi-material meshes count multiple). */
  drawCalls: number;
  materials: number;
  meshes: number;
  triangles: number;
};

export function readFrameRenderStats(gl: {
  info: {
    render: {
      drawCalls?: number;
      frameCalls?: number;
      triangles?: number;
      lines?: number;
      points?: number;
    };
  };
}): FrameRenderStats {
  const render = gl.info.render;
  return {
    drawCalls: render.drawCalls ?? render.frameCalls ?? 0,
    lines: render.lines ?? 0,
    points: render.points ?? 0,
    triangles: render.triangles ?? 0,
  };
}

export function countSceneGraphRenderStats(
  root: Object3D | null | undefined
): SceneGraphRenderStats {
  const materials = new Set<Material>();
  let meshes = 0;
  let drawCalls = 0;
  let triangles = 0;

  if (!root) {
    return { drawCalls, materials: 0, meshes, triangles };
  }

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;

    meshes += 1;
    const material = mesh.material;
    if (Array.isArray(material)) {
      drawCalls += material.length;
      for (const entry of material) {
        if (entry) materials.add(entry);
      }
    } else if (material) {
      drawCalls += 1;
      materials.add(material);
    }

    const geometry = mesh.geometry;
    const position = geometry.getAttribute('position');
    if (!position) return;

    const index = geometry.index;
    if (index) {
      triangles += Math.floor(index.count / 3);
      return;
    }

    triangles += Math.floor(position.count / 3);
  });

  return {
    drawCalls,
    materials: materials.size,
    meshes,
    triangles,
  };
}

export function formatCharacterRenderCostLog(
  label: string,
  baseline: SceneGraphRenderStats,
  final: SceneGraphRenderStats
): string {
  const deltaDraws = final.drawCalls - baseline.drawCalls;
  const deltaMaterials = final.materials - baseline.materials;
  const deltaTriangles = final.triangles - baseline.triangles;
  return `[character:${label}] render cost: +${deltaDraws} draws (+${deltaMaterials} materials, +${deltaTriangles.toLocaleString()} tris) — draws ${baseline.drawCalls} → ${final.drawCalls}`;
}
