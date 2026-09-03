import {
  BoxGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import {
  collectOpacities,
  collectTransmissions,
  createMaskTransitionState,
  setAnimatedOpacity,
  startMaskTransition,
} from './maskTransition';
import {
  configureKaukauTransmission,
  KAUKAU_TRANSMISSION,
  prepareClonedMaskMaterial,
} from './maskMaterial';

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

function makeKaukauMaskRoot(): Object3D {
  const root = new Group();
  const mat = new MeshPhysicalMaterial({ name: 'Kaukau_baked', opacity: 1, roughness: 0.5 });
  configureKaukauTransmission(mat);
  prepareClonedMaskMaterial(mat);
  root.add(new Mesh(new BoxGeometry(), mat));
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

  it('collectTransmissions captures Mata Kaukau transmission materials', () => {
    const root = makeKaukauMaskRoot();
    const transmissions = collectTransmissions(root);
    expect(transmissions.size).toBe(1);
    expect(transmissions.values().next().value).toBe(KAUKAU_TRANSMISSION);
  });

  it('setAnimatedOpacity fades Mata Kaukau via transmission, not opacity', () => {
    const root = makeKaukauMaskRoot();
    const mat = (root.children[0] as Mesh).material as MeshPhysicalMaterial;
    const opacities = collectOpacities(root);
    const transmissions = collectTransmissions(root);

    setAnimatedOpacity(root, opacities, 0.5, transmissions);

    expect(mat.transparent).toBe(true);
    expect(mat.depthWrite).toBe(false);
    expect(mat.transmission).toBeCloseTo(KAUKAU_TRANSMISSION * 0.5);
    expect(mat.opacity).toBe(1);
  });
});
