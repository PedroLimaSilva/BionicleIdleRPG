import {
  Bone,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import {
  buildMergedKitMeshes,
  extractMergeableKitMesh,
  extractMergeableMeshesFromClone,
  findKitMergeAnchor,
  isMergeableKitMesh,
  kitMergeGroupKey,
  normalizeKitGeometryForMerge,
} from './kitGeometryMerge';
import { buildTransmissiveKitMaterial } from './transmissiveKitMaterial';
import { applySelectiveBloomMrt } from '../CharacterScene/selectiveBloom';
import { getWeatheredMetalMaterial } from '../CharacterScene/WeatheredMetalMaterial';

function boxMesh(
  material: MeshStandardMaterial,
  position: [number, number, number] = [0, 0, 0]
): Mesh {
  const geom = new BufferGeometry();
  geom.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
  );
  const mesh = new Mesh(geom, material);
  mesh.position.set(...position);
  return mesh;
}

function rigWithSocket(): { bone: Bone; socket: Object3D } {
  const bone = new Bone();
  bone.name = 'Arm_Upper_L';
  const socket = new Object3D();
  socket.name = 'Axle6L';
  bone.add(socket);
  return { bone, socket };
}

describe('kitGeometryMerge', () => {
  test('isMergeableKitMesh rejects multi-material, transmissive, and bloom MRT meshes', () => {
    const standard = boxMesh(new MeshStandardMaterial());
    expect(isMergeableKitMesh(standard)).toBe(true);

    const multi = boxMesh(new MeshStandardMaterial());
    multi.material = [new MeshStandardMaterial(), new MeshStandardMaterial()];
    expect(isMergeableKitMesh(multi)).toBe(false);

    const transmissive = boxMesh(
      buildTransmissiveKitMaterial('Main', 'brain', '#ff0000', '#000000', 0)
    );
    expect(isMergeableKitMesh(transmissive)).toBe(false);

    const bloom = new MeshStandardMaterial({ name: 'Glow' });
    applySelectiveBloomMrt(bloom);
    expect(isMergeableKitMesh(boxMesh(bloom))).toBe(false);
  });

  test('findKitMergeAnchor returns the nearest bone ancestor', () => {
    const { bone, socket } = rigWithSocket();
    expect(findKitMergeAnchor(socket)).toBe(bone);
    expect(findKitMergeAnchor(bone)).toBe(bone);
  });

  test('extractMergeableKitMesh bakes mesh offset into anchor-local space', () => {
    const { bone, socket } = rigWithSocket();
    const root = new Group();
    root.add(bone);
    root.updateMatrixWorld(true);

    const material = getWeatheredMetalMaterial('#111111');
    const mesh = boxMesh(material, [0.5, 0, 0]);
    socket.add(mesh);
    socket.position.set(1, 0, 0);
    root.updateMatrixWorld(true);

    const anchorInverse = bone.matrixWorld.clone().invert();
    const entry = extractMergeableKitMesh(mesh, bone, anchorInverse);
    expect(entry).not.toBeNull();
    expect(mesh.parent).toBeNull();

    const pos = entry!.geometry.getAttribute('position');
    expect(pos.getX(0)).toBeCloseTo(1.5, 4);
  });

  test('normalizeKitGeometryForMerge pads missing uv and strips extra attributes', () => {
    const geom = new BufferGeometry();
    geom.setAttribute(
      'position',
      new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
    );
    geom.setAttribute(
      'normal',
      new BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3)
    );
    geom.setAttribute(
      'color',
      new BufferAttribute(new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]), 3)
    );

    const normalized = normalizeKitGeometryForMerge(geom);
    expect(normalized.getAttribute('uv')).toBeDefined();
    expect(normalized.getAttribute('color')).toBeUndefined();
    expect(Object.keys(normalized.attributes).sort()).toEqual(['normal', 'position', 'uv']);
  });

  test('buildMergedKitMeshes combines meshes with mismatched GLB attribute layouts', () => {
    const bone = new Bone();
    const material = getWeatheredMetalMaterial('#444444');
    const withUv = boxMesh(material).geometry;
    const withoutUv = new BufferGeometry();
    withoutUv.setAttribute(
      'position',
      new BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]), 3)
    );
    withoutUv.setAttribute(
      'normal',
      new BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0]), 3)
    );

    const merged = buildMergedKitMeshes([
      { anchor: bone, geometry: withUv, material, renderOrder: 0 },
      { anchor: bone, geometry: withoutUv, material, renderOrder: 0 },
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].geometry.getAttribute('position').count).toBe(6);
  });

  test('buildMergedKitMeshes combines meshes with the same anchor and material', () => {
    const bone = new Bone();
    const material = getWeatheredMetalMaterial('#222222');
    const entries = [
      {
        anchor: bone,
        geometry: boxMesh(material).geometry,
        material,
        renderOrder: 0,
      },
      {
        anchor: bone,
        geometry: boxMesh(material, [2, 0, 0]).geometry,
        material,
        renderOrder: 0,
      },
    ];

    const merged = buildMergedKitMeshes(entries);
    expect(merged).toHaveLength(1);
    expect(merged[0].geometry.getAttribute('position').count).toBe(6);
    expect(bone.children).toHaveLength(1);
  });

  test('kitMergeGroupKey distinguishes material and render order', () => {
    const anchor = new Bone();
    const a = new MeshStandardMaterial();
    const b = new MeshStandardMaterial();
    expect(kitMergeGroupKey(anchor, a, 0)).not.toBe(kitMergeGroupKey(anchor, b, 0));
    expect(kitMergeGroupKey(anchor, a, 0)).not.toBe(kitMergeGroupKey(anchor, a, 11));
  });

  test('extractMergeableMeshesFromClone pulls rigid meshes off the clone', () => {
    const { bone, socket } = rigWithSocket();
    const root = new Group();
    root.add(bone);

    const clone = new Group();
    const material = getWeatheredMetalMaterial('#333333');
    clone.add(boxMesh(material));
    socket.add(clone);
    root.updateMatrixWorld(true);

    const entries: Array<{
      anchor: Object3D;
      geometry: BufferGeometry;
      material: MeshStandardMaterial;
      renderOrder: number;
    }> = [];
    extractMergeableMeshesFromClone(clone, socket, entries);
    expect(entries).toHaveLength(1);
    expect(clone.children).toHaveLength(0);
  });

  test('merges multiple socket clones on the same bone into one mesh per material', () => {
    const bone = new Bone();
    bone.name = 'Arm_Upper_L';
    const root = new Group();
    root.add(bone);
    const material = getWeatheredMetalMaterial('#111111');
    const entries: Array<{
      anchor: Object3D;
      geometry: BufferGeometry;
      material: MeshStandardMaterial;
      renderOrder: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      const socket = new Object3D();
      socket.position.set(i * 0.1, 0, 0);
      bone.add(socket);
      const clone = new Group();
      clone.add(boxMesh(material));
      socket.add(clone);
      root.updateMatrixWorld(true);
      extractMergeableMeshesFromClone(clone, socket, entries);
    }

    const merged = buildMergedKitMeshes(entries);
    expect(entries).toHaveLength(5);
    expect(merged).toHaveLength(1);
    expect(bone.children.filter((child) => (child as Mesh).isMesh)).toHaveLength(1);
  });
});
