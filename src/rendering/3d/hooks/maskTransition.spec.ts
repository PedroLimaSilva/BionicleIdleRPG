import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import {
  collectOpacities,
  createMaskTransitionState,
  setAnimatedOpacity,
  startMaskTransition,
} from './maskTransition';
import { prepareClonedMaskMaterial } from './maskMaterial';

function makeOpaqueMaterial(name: string): MeshStandardMaterial {
  const mat = new MeshStandardMaterial({ name, opacity: 1 });
  prepareClonedMaskMaterial(mat);
  return mat;
}

function makeOpaqueMaskRoot(): Object3D {
  const root = new Group();
  root.add(new Mesh(new BoxGeometry(), makeOpaqueMaterial('Hau_baked')));

  const multiSlot = new Mesh(new BoxGeometry(), makeOpaqueMaterial('Hau_baked'));
  multiSlot.material = [
    makeOpaqueMaterial('Hau_baked'),
    makeOpaqueMaterial('Lens'),
  ] as unknown as MeshStandardMaterial;
  root.add(multiSlot);

  return root;
}

describe('mask transition opacity', () => {
  it('collectOpacities includes every material slot on multi-material meshes', () => {
    const root = makeOpaqueMaskRoot();
    const opacities = collectOpacities(root);
    expect(opacities.size).toBe(3);
  });

  it('startMaskTransition enables transparent pass on opaque Kanohi', () => {
    const root = makeOpaqueMaskRoot();
    const bodyMat = (root.children[0] as Mesh).material as MeshStandardMaterial;
    expect(bodyMat.transparent).toBe(false);
    const versionBefore = bodyMat.version;

    const transitionRef = { current: createMaskTransitionState() };
    startMaskTransition(transitionRef, new Group(), root);

    expect(bodyMat.transparent).toBe(true);
    expect(bodyMat.version).toBeGreaterThan(versionBefore);
  });

  it('setAnimatedOpacity forces transparent blending and scales resting opacity', () => {
    const root = makeOpaqueMaskRoot();
    const opacities = collectOpacities(root);
    const bodyMat = (root.children[0] as Mesh).material as MeshStandardMaterial;

    setAnimatedOpacity(root, opacities, 0.4);

    expect(bodyMat.transparent).toBe(true);
    expect(bodyMat.opacity).toBeCloseTo(0.4);
    expect(bodyMat.depthWrite).toBe(false);
  });
});
