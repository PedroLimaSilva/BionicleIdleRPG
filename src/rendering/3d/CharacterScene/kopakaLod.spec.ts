import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { setKopakaSheetVisibility } from './kopakaLod';
import {
  KOPAKA_SHEET_BODY_MESH,
  KOPAKA_SHEET_BRAIN_MESH,
  KOPAKA_SHEET_SWORD_MESH,
} from './kopakaSheetMeshes';

describe('kopakaLod visibility', () => {
  test('shows Body / Brain / Sword and hides leftover kit geo', () => {
    const root = new Group();
    const body = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    body.name = KOPAKA_SHEET_BODY_MESH;
    const brain = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    brain.name = KOPAKA_SHEET_BRAIN_MESH;
    const sword = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    sword.name = KOPAKA_SHEET_SWORD_MESH;
    const kitChest = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    kitChest.name = 'MataChest';
    root.add(body);
    root.add(brain);
    root.add(sword);
    root.add(kitChest);

    setKopakaSheetVisibility(root);
    expect(body.visible).toBe(true);
    expect(brain.visible).toBe(true);
    expect(sword.visible).toBe(true);
    expect(kitChest.visible).toBe(false);
  });

  test('shows skinned Body children parented under the Body group', () => {
    const root = new Group();
    const body = new Group();
    body.name = KOPAKA_SHEET_BODY_MESH;
    const part = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    part.name = 'Part-Evanetic__kit1-6_dot_1_dot_dat003';
    body.add(part);
    root.add(body);

    setKopakaSheetVisibility(root);
    expect(part.visible).toBe(true);
  });

  test('keeps Kanohi meshes under Masks visible', () => {
    const root = new Group();
    const masks = new Group();
    masks.name = 'Masks';
    const akaku = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    akaku.name = 'Akaku';
    masks.add(akaku);
    root.add(masks);

    setKopakaSheetVisibility(root);
    expect(akaku.visible).toBe(true);
  });
});
