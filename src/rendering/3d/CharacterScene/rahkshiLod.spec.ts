import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { setRahkshiLodVisibility } from './rahkshiLod';
import { RAHKSHI_BATTLE_LOD_GROUP } from './rahkshiBattleMeshes';

describe('rahkshiLod visibility', () => {
  test('legacy dual-armature export toggles whole rig roots', () => {
    const detailed = new Group();
    const battle = new Group();
    detailed.visible = true;
    battle.visible = true;

    setRahkshiLodVisibility(detailed, battle, 'battle');
    expect(detailed.visible).toBe(false);
    expect(battle.visible).toBe(true);

    setRahkshiLodVisibility(detailed, battle, 'detailed');
    expect(detailed.visible).toBe(true);
    expect(battle.visible).toBe(false);
  });

  test('single-armature export toggles meshes under Battle_LOD', () => {
    const detailed = new Group();
    const battleLod = new Group();
    battleLod.name = RAHKSHI_BATTLE_LOD_GROUP;
    const baked = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    baked.name = 'Face';
    const battleBody = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBody.name = 'SkinnedMesh';
    detailed.add(baked);
    battleLod.add(battleBody);
    detailed.add(battleLod);

    setRahkshiLodVisibility(detailed, null, 'battle');
    expect(baked.visible).toBe(false);
    expect(battleBody.visible).toBe(true);

    setRahkshiLodVisibility(detailed, null, 'detailed');
    expect(baked.visible).toBe(true);
    expect(battleBody.visible).toBe(false);
  });
});
