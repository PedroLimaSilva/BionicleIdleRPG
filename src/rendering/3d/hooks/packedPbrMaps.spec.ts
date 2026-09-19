import { Mesh, MeshStandardMaterial, Object3D } from 'three';
import {
  PACKED_METALNESS_HAS_MAP_KEY,
  PACKED_ROUGHNESS_HAS_MAP_KEY,
  setPackedMetalnessEnabled,
  setPackedRoughnessEnabled,
  writePackedPbrChannelFlags,
} from './packedPbrMaps';

describe('packed PBR channel flags', () => {
  test('writePackedPbrChannelFlags plants ones on packed materials and clears otherwise', () => {
    const packed = new MeshStandardMaterial();
    writePackedPbrChannelFlags(packed, true);
    expect(packed.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(1);
    expect(packed.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);

    const noise = new MeshStandardMaterial();
    noise.userData[PACKED_ROUGHNESS_HAS_MAP_KEY] = 1;
    writePackedPbrChannelFlags(noise, false);
    expect(noise.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBeUndefined();
    expect(noise.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBeUndefined();
  });

  test('dex toggles zero / restore without dropping the bake material', () => {
    const mat = new MeshStandardMaterial({ name: 'WeatheredMetal' });
    writePackedPbrChannelFlags(mat, true);
    const mesh = new Mesh();
    mesh.material = mat;
    const root = new Object3D();
    root.add(mesh);

    expect(setPackedRoughnessEnabled(root, false)).toBe(1);
    expect(mat.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(0);
    expect(mat.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);

    expect(setPackedMetalnessEnabled(root, false)).toBe(1);
    expect(mat.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(0);

    expect(setPackedRoughnessEnabled(root, true)).toBe(1);
    expect(setPackedMetalnessEnabled(root, true)).toBe(1);
    expect(mat.userData[PACKED_ROUGHNESS_HAS_MAP_KEY]).toBe(1);
    expect(mat.userData[PACKED_METALNESS_HAS_MAP_KEY]).toBe(1);
  });

  test('skips materials that are not packed', () => {
    const mat = new MeshStandardMaterial({ name: 'WeatheredMetal' });
    const mesh = new Mesh();
    mesh.material = mat;
    const root = new Object3D();
    root.add(mesh);

    expect(setPackedRoughnessEnabled(root, false)).toBe(0);
    expect(setPackedMetalnessEnabled(root, false)).toBe(0);
  });
});
