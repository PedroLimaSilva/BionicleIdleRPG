import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { applySheetMeshShadows, SHEET_SHADOW_MAP_SIZE } from './sheetShadows';

describe('applySheetMeshShadows', () => {
  test('marks meshes under the character root as casters and receivers', () => {
    const root = new Group();
    const body = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    body.castShadow = false;
    body.receiveShadow = false;
    root.add(body);
    applySheetMeshShadows(root);
    expect(body.castShadow).toBe(true);
    expect(body.receiveShadow).toBe(true);
    expect(SHEET_SHADOW_MAP_SIZE).toBe(1024);
  });
});
