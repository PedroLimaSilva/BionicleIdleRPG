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

  test('Battle_Body group children toggle with battle LOD', () => {
    const detailed = new Group();
    const battleBodyGroup = new Group();
    battleBodyGroup.name = RAHKSHI_BATTLE_BODY_MESH;
    const part = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    part.name = 'Part-44136_dot_dat003';
    battleBodyGroup.add(part);
    detailed.add(battleBodyGroup);

    const baked = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    baked.name = 'Face';
    detailed.add(baked);

    setRahkshiLodVisibility(detailed, 'detailed');
    expect(part.visible).toBe(false);
    expect(baked.visible).toBe(true);

    setRahkshiLodVisibility(detailed, 'battle');
    expect(part.visible).toBe(true);
    expect(baked.visible).toBe(false);
  });

  test('resolveRahkshiBattleAppearanceTarget collects Battle_* meshes on Rahkshi', () => {
    const detailed = new Group();
    const baked = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    baked.name = 'Face';
    const battleBodyGroup = new Group();
    battleBodyGroup.name = RAHKSHI_BATTLE_BODY_MESH;
    const part = new Mesh(new BoxGeometry(), new MeshStandardMaterial());
    part.name = 'Part-slot';
    battleBodyGroup.add(part);
    detailed.add(baked);
    detailed.add(battleBodyGroup);

    const target = resolveRahkshiBattleAppearanceTarget(detailed);
    expect(target?.root).toBe(detailed);
    expect(target?.meshUuids.has(part.uuid)).toBe(true);
    expect(target?.meshUuids.has(baked.uuid)).toBe(false);
    expect(collectRahkshiBattleMeshUuids(detailed)).toEqual(target?.meshUuids);
  });
});
