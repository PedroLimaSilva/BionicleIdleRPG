import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import {
  collectRahkshiBattleMeshUuids,
  resolveRahkshiBattleAppearanceTarget,
  setRahkshiLodVisibility,
} from './rahkshiLod';
import { RAHKSHI_BATTLE_BODY_MESH } from './rahkshiBattleMeshes';

describe('rahkshiLod visibility', () => {
  test('single-armature export toggles meshes by Battle_ prefix', () => {
    const detailed = new Group();
    const baked = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    baked.name = 'Face';
    const battleBody = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBody.name = RAHKSHI_BATTLE_BODY_MESH;
    detailed.add(baked);
    detailed.add(battleBody);

    setRahkshiLodVisibility(detailed, 'battle');
    expect(baked.visible).toBe(false);
    expect(battleBody.visible).toBe(true);

    setRahkshiLodVisibility(detailed, 'detailed');
    expect(baked.visible).toBe(true);
    expect(battleBody.visible).toBe(false);
  });

  test('resolveRahkshiBattleAppearanceTarget collects Battle_* meshes on Rahkshi', () => {
    const detailed = new Group();
    const baked = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    baked.name = 'Face';
    const battleBody = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    battleBody.name = RAHKSHI_BATTLE_BODY_MESH;
    detailed.add(baked);
    detailed.add(battleBody);

    const target = resolveRahkshiBattleAppearanceTarget(detailed);
    expect(target?.root).toBe(detailed);
    expect(target?.meshUuids.has(battleBody.uuid)).toBe(true);
    expect(target?.meshUuids.has(baked.uuid)).toBe(false);
    expect(collectRahkshiBattleMeshUuids(detailed)).toEqual(target?.meshUuids);
  });
});
