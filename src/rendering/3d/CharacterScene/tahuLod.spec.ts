import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { reparentTahuBattleBrain, setTahuLodVisibility, TAHU_BATTLE_BRAIN_SOCKET } from './tahuLod';
import { TAHU_BATTLE_BODY_MESH, TAHU_BATTLE_BRAIN_MESH } from './tahuBattleMeshes';

describe('tahuLod visibility', () => {
  test('hides Battle_* meshes in detailed mode and shows them in battle', () => {
    const root = new Group();
    const battleBody = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBody.name = TAHU_BATTLE_BODY_MESH;
    const battleBrain = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBrain.name = TAHU_BATTLE_BRAIN_MESH;
    root.add(battleBody);
    root.add(battleBrain);

    setTahuLodVisibility(root, 'detailed');
    expect(battleBody.visible).toBe(false);
    expect(battleBrain.visible).toBe(false);

    setTahuLodVisibility(root, 'battle');
    expect(battleBody.visible).toBe(true);
    expect(battleBrain.visible).toBe(true);
  });

  test('shows skinned Brain primitives parented under the Battle_Brain group', () => {
    const root = new Group();
    const battleBrain = new Group();
    battleBrain.name = TAHU_BATTLE_BRAIN_MESH;
    const gel = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    gel.name = 'Brain';
    battleBrain.add(gel);
    root.add(battleBrain);

    setTahuLodVisibility(root, 'detailed');
    expect(gel.visible).toBe(false);

    setTahuLodVisibility(root, 'battle');
    expect(gel.visible).toBe(true);
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
