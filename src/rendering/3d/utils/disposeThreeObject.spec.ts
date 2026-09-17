import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D } from 'three';
import {
  disposeObject3DResources,
  isSharedGpuResource,
  markSharedGpuResource,
} from './disposeThreeObject';

describe('disposeObject3DResources', () => {
  it('disposes geometry only by default', () => {
    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);
    const root = new Object3D();
    root.add(mesh);

    const geometryDispose = jest.spyOn(geometry, 'dispose');
    const materialDispose = jest.spyOn(material, 'dispose');

    disposeObject3DResources(root);

    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).not.toHaveBeenCalled();
  });

  it('disposes cloned instance materials when disposeMaterials is true', () => {
    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial();
    const mesh = new Mesh(geometry, material);
    const root = new Object3D();
    root.add(mesh);

    const geometryDispose = jest.spyOn(geometry, 'dispose');
    const materialDispose = jest.spyOn(material, 'dispose');

    disposeObject3DResources(root, { disposeMaterials: true });

    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).toHaveBeenCalledTimes(1);
  });

  it('skips interned materials and shared GLTF geometry', () => {
    const geometry = new BoxGeometry();
    const shared = new MeshStandardMaterial();
    const owned = new MeshBasicMaterial();
    markSharedGpuResource(geometry);
    markSharedGpuResource(shared);
    const mesh = new Mesh(geometry, [shared, owned]);
    const root = new Object3D();
    root.add(mesh);

    const geometryDispose = jest.spyOn(geometry, 'dispose');
    const sharedDispose = jest.spyOn(shared, 'dispose');
    const ownedDispose = jest.spyOn(owned, 'dispose');

    disposeObject3DResources(root, { disposeMaterials: true });

    expect(geometryDispose).not.toHaveBeenCalled();
    expect(sharedDispose).not.toHaveBeenCalled();
    expect(ownedDispose).toHaveBeenCalledTimes(1);
    expect(isSharedGpuResource(shared)).toBe(true);
  });
});
