import {
  Bone,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
} from 'three';
import { cloneGltfInstance } from './cloneGltfInstance';
import { isSharedGpuResource } from './disposeThreeObject';

describe('cloneGltfInstance', () => {
  it('gives each instance its own materials so color tints do not leak', () => {
    const shared = new MeshStandardMaterial({ color: '#ffffff', name: 'Primary' });
    const mesh = new Mesh(new BoxGeometry(), shared);
    const template = new Group();
    template.add(mesh);

    const first = cloneGltfInstance(template);
    const second = cloneGltfInstance(template);
    const firstMat = (first.children[0] as Mesh).material as MeshStandardMaterial;
    const secondMat = (second.children[0] as Mesh).material as MeshStandardMaterial;

    expect(firstMat).not.toBe(shared);
    expect(secondMat).not.toBe(shared);
    expect(firstMat).not.toBe(secondMat);

    firstMat.color = new Color('#c91a09');
    expect(secondMat.color.getHexString()).toBe('ffffff');
    expect(shared.color.getHexString()).toBe('ffffff');
  });

  it('rebinds a private skeleton so shared rigs do not pose together', () => {
    const bone = new Bone();
    bone.name = 'Spine';
    const geometry = new BoxGeometry();
    const material = new MeshStandardMaterial();
    const mesh = new SkinnedMesh(geometry, material);
    mesh.add(bone);
    mesh.bind(new Skeleton([bone]));
    const template = new Group();
    template.add(mesh);

    const first = cloneGltfInstance(template);
    const second = cloneGltfInstance(template);
    const firstSkinned = first.children[0] as SkinnedMesh;
    const secondSkinned = second.children[0] as SkinnedMesh;

    expect(firstSkinned.skeleton).not.toBe(mesh.skeleton);
    expect(secondSkinned.skeleton).not.toBe(mesh.skeleton);
    expect(firstSkinned.skeleton).not.toBe(secondSkinned.skeleton);
    expect(firstSkinned.skeleton.bones[0]).not.toBe(bone);
    expect(firstSkinned.skeleton.bones[0]).toBe(firstSkinned.children[0]);
  });

  it('marks cloned geometry as shared so defeat dispose cannot poison the GLTF', () => {
    const geometry = new BoxGeometry();
    const mesh = new Mesh(geometry, new MeshStandardMaterial());
    const template = new Group();
    template.add(mesh);

    const clone = cloneGltfInstance(template);
    const clonedMesh = clone.children[0] as Mesh;

    expect(clonedMesh.geometry).toBe(geometry);
    expect(isSharedGpuResource(geometry)).toBe(true);
  });
});
