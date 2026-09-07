import { BufferAttribute, BufferGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import {
  countSceneGraphRenderStats,
  formatCharacterRenderCostLog,
  readFrameRenderStats,
} from './sceneDrawCallStats';

function boxMesh(material: MeshStandardMaterial): Mesh {
  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
  );
  return new Mesh(geom, material);
}

describe('sceneDrawCallStats', () => {
  test('readFrameRenderStats prefers drawCalls over frameCalls', () => {
    const stats = readFrameRenderStats({
      info: { render: { drawCalls: 42, frameCalls: 99, triangles: 1200 } },
    });
    expect(stats).toEqual({ drawCalls: 42, lines: 0, points: 0, triangles: 1200 });
  });

  test('countSceneGraphRenderStats counts meshes, materials, and triangles', () => {
    const root = new Group();
    const shared = new MeshStandardMaterial();
    root.add(boxMesh(shared));
    root.add(boxMesh(shared));

    expect(countSceneGraphRenderStats(root)).toEqual({
      drawCalls: 2,
      materials: 1,
      meshes: 2,
      triangles: 2,
    });
  });

  test('countSceneGraphRenderStats counts multi-material meshes as multiple draws', () => {
    const root = new Group();
    const mesh = boxMesh(new MeshStandardMaterial());
    mesh.material = [new MeshStandardMaterial(), new MeshStandardMaterial()];
    root.add(mesh);

    expect(countSceneGraphRenderStats(root)).toEqual({
      drawCalls: 2,
      materials: 2,
      meshes: 1,
      triangles: 1,
    });
  });

  test('formatCharacterRenderCostLog reports baseline to final delta', () => {
    expect(
      formatCharacterRenderCostLog(
        'Toa_Tahu',
        { drawCalls: 6, materials: 2, meshes: 6, triangles: 1000 },
        { drawCalls: 148, materials: 40, meshes: 142, triangles: 50000 }
      )
    ).toBe(
      '[character:Toa_Tahu] render cost: +142 draws (+38 materials, +49,000 tris) — draws 6 → 148'
    );
  });
});
