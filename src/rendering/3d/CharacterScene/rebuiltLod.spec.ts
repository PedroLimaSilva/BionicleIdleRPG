import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { setRebuiltSheetVisibility } from './rebuiltLod';
import { REBUILT_SHEET_BODY_MESH, REBUILT_SHEET_BRAIN_MESH } from './rebuiltSheetMeshes';

describe('rebuiltLod visibility', () => {
  test('shows Body_Baked / Brain and hides leftover kit geo', () => {
    const root = new Group();
    const body = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    body.name = REBUILT_SHEET_BODY_MESH;
    const brain = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    brain.name = REBUILT_SHEET_BRAIN_MESH;
    const kitTorso = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    kitTorso.name = 'MatoranBody';
    root.add(body);
    root.add(brain);
    root.add(kitTorso);

    setRebuiltSheetVisibility(root);
    expect(body.visible).toBe(true);
    expect(brain.visible).toBe(true);
    expect(kitTorso.visible).toBe(false);
  });

  test('shows primitives parented under the Body_Baked group', () => {
    const root = new Group();
    const body = new Group();
    body.name = REBUILT_SHEET_BODY_MESH;
    const part = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    part.name = 'Part-Body.002';
    body.add(part);
    root.add(body);

    setRebuiltSheetVisibility(root);
    expect(part.visible).toBe(true);
  });

  test('keeps Kanohi meshes under Masks visible', () => {
    const root = new Group();
    const masks = new Group();
    masks.name = 'Masks';
    const hau = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    hau.name = 'Hau';
    masks.add(hau);
    root.add(masks);

    setRebuiltSheetVisibility(root);
    expect(hau.visible).toBe(true);
  });
});
