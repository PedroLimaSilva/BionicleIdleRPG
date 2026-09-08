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

    setRahkshiLodVisibility(detailed, 'detailed');
    expect(baked.visible).toBe(true);
    expect(battleBody.visible).toBe(false);

    setRahkshiLodVisibility(detailed, 'battle');
    expect(baked.visible).toBe(false);
    expect(battleBody.visible).toBe(true);
  });

  test('species overlays stay hidden in detailed mode even when staff matches', () => {
    const detailed = new Group();
    const species = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    species.name = 'Battle_Guurahk';
    detailed.add(species);

    setRahkshiLodVisibility(detailed, 'detailed', 'Guurahk');
    expect(species.visible).toBe(false);
  });

  test('species overlays follow staff prefix in battle mode', () => {
    const detailed = new Group();
    const guurahk = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    guurahk.name = 'Battle_Guurahk';
    const panrahk = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    panrahk.name = 'Battle_Panrahk';
    detailed.add(guurahk);
    detailed.add(panrahk);

    setRahkshiLodVisibility(detailed, 'battle', 'Panrahk');
    expect(guurahk.visible).toBe(false);
    expect(panrahk.visible).toBe(true);
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
