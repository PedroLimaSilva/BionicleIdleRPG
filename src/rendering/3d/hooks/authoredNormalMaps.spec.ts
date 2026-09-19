import { Mesh, MeshStandardMaterial, Object3D, Texture, Vector2 } from 'three';
import {
  AUTHORED_NORMAL_SCALE_USERDATA_KEY,
  setAuthoredNormalMapsEnabled,
} from './authoredNormalMaps';
import { DUMMY_NORMAL_MAP } from './dummyTextures';

describe('setAuthoredNormalMapsEnabled', () => {
  test('zeros normalScale without dropping the map, then restores it', () => {
    const map = new Texture();
    const mat = new MeshStandardMaterial({
      name: 'WeatheredMetal',
      normalMap: map,
      normalScale: new Vector2(1, 1),
    });
    const mesh = new Mesh();
    mesh.material = mat;
    const root = new Object3D();
    root.add(mesh);

    expect(setAuthoredNormalMapsEnabled(root, false)).toBe(1);
    expect(mat.normalMap).toBe(map);
    expect(mat.normalScale.x).toBe(0);
    expect(mat.normalScale.y).toBe(0);
    expect(mat.userData[AUTHORED_NORMAL_SCALE_USERDATA_KEY]).toEqual({ x: 1, y: 1 });

    expect(setAuthoredNormalMapsEnabled(root, true)).toBe(1);
    expect(mat.normalMap).toBe(map);
    expect(mat.normalScale.x).toBe(1);
    expect(mat.normalScale.y).toBe(1);
  });

  test('skips dummy warmup normals', () => {
    const mat = new MeshStandardMaterial({
      name: 'WeatheredMetal',
      normalMap: DUMMY_NORMAL_MAP,
    });
    const mesh = new Mesh();
    mesh.material = mat;
    const root = new Object3D();
    root.add(mesh);

    expect(setAuthoredNormalMapsEnabled(root, false)).toBe(0);
    expect(mat.normalScale.x).toBe(1);
    expect(mat.normalScale.y).toBe(1);
  });
});
