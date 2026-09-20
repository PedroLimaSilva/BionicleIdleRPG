import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { reparentTahuBattleBrain, setTahuLodVisibility, TAHU_BATTLE_BRAIN_SOCKET } from './tahuLod';
import { TAHU_BATTLE_BODY_MESH, TAHU_BATTLE_BRAIN_MESH } from './tahuBattleMeshes';

describe('tahuLod visibility', () => {
  test('shows Battle_* meshes for sheet and battle, and hides leftover kit geo', () => {
    const root = new Group();
    const battleBody = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBody.name = TAHU_BATTLE_BODY_MESH;
    const battleBrain = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBrain.name = TAHU_BATTLE_BRAIN_MESH;
    const kitChest = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    kitChest.name = 'MataChest';
    root.add(battleBody);
    root.add(battleBrain);
    root.add(kitChest);

    setTahuLodVisibility(root, 'sheet');
    expect(battleBody.visible).toBe(true);
    expect(battleBrain.visible).toBe(true);
    expect(kitChest.visible).toBe(false);

    setTahuLodVisibility(root, 'battle');
    expect(battleBody.visible).toBe(true);
    expect(battleBrain.visible).toBe(true);
    expect(kitChest.visible).toBe(false);
  });

  test('shows skinned Brain primitives parented under the Battle_Brain group', () => {
    const root = new Group();
    const battleBrain = new Group();
    battleBrain.name = TAHU_BATTLE_BRAIN_MESH;
    const gel = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    gel.name = 'Brain';
    battleBrain.add(gel);
    root.add(battleBrain);

    setTahuLodVisibility(root, 'sheet');
    expect(gel.visible).toBe(true);
  });

  test('keeps Kanohi meshes under Masks visible', () => {
    const root = new Group();
    const masks = new Group();
    masks.name = 'Masks';
    const hau = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    hau.name = 'Hau';
    masks.add(hau);
    root.add(masks);

    setTahuLodVisibility(root, 'sheet');
    expect(hau.visible).toBe(true);
  });

  test('reparents Battle_Brain onto Head without moving bind-pose world position', () => {
    const root = new Group();
    const head = new Group();
    head.name = TAHU_BATTLE_BRAIN_SOCKET;
    head.position.set(0, 1, 0);
    const brain = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    brain.name = TAHU_BATTLE_BRAIN_MESH;
    brain.position.set(0, 1, 0);
    root.add(head);
    root.add(brain);
    root.updateMatrixWorld(true);
    const worldBefore = brain.getWorldPosition(new Vector3());

    reparentTahuBattleBrain(root);
    root.updateMatrixWorld(true);

    expect(brain.parent).toBe(head);
    expect(brain.getWorldPosition(new Vector3()).distanceTo(worldBefore)).toBeCloseTo(0);

    head.position.set(0, 2, 0);
    root.updateMatrixWorld(true);
    expect(brain.getWorldPosition(new Vector3()).y).toBeCloseTo(2);
  });
});
