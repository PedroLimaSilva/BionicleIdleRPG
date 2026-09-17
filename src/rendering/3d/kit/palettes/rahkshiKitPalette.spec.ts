import { MeshStandardMaterial, Mesh, BoxGeometry, Group } from 'three';
import {
  applyRahkshiBattleMaterialsToMesh,
  applyRahkshiBattleSpeciesMetalToMesh,
  internRahkshiSharedBattleMaterials,
  rahkshiBattleTintMap,
  resetRahkshiSharedBattleMaterialsForTests,
} from './rahkshiKitPalette';
import { KraataPower } from '../../../../types/Kraata';
import { getRahkshiArmorColors } from '../../../../data/rahkshiArmorColors';
import { isSharedGpuResource } from '../../utils/disposeThreeObject';

describe('rahkshi battle LOD tints', () => {
  test('rahkshiBattleTintMap only includes armor and joint slots', () => {
    const dex = getRahkshiArmorColors(KraataPower.Fragmentation);
    expect(rahkshiBattleTintMap(dex)).toEqual({
      Battle_Armor: dex.armor,
      Battle_Joint: dex.joint,
    });
  });

  test('applyRahkshiBattleMaterialsToMesh tints skinned slots in place', () => {
    const armor = new MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.1,
      name: 'Battle_Armor',
    });
    const chassis = new MeshStandardMaterial({
      color: '#aaaaaa',
      metalness: 0.2,
      name: 'Battle_Chassis',
    });
    const mesh = {
      frustumCulled: true,
      isSkinnedMesh: true,
      material: [armor, chassis],
    } as unknown as import('three').SkinnedMesh;

    applyRahkshiBattleMaterialsToMesh(mesh, { Battle_Armor: '#583927' });

    expect(armor.color.getHexString()).toBe('583927');
    expect((armor as MeshStandardMaterial & { skinning?: boolean }).skinning).toBe(true);
    expect(chassis.color.getHexString()).toBe('aaaaaa');
    expect(chassis.metalness).toBe(0.2);
    expect(mesh.frustumCulled).toBe(false);
  });

  test('applyRahkshiBattleMaterialsToMesh boosts Battle_Metal PBR when tinted', () => {
    const metal = new MeshStandardMaterial({
      color: '#888888',
      metalness: 0.1,
      name: 'Battle_Metal',
    });
    const mesh = {
      isSkinnedMesh: false,
      material: metal,
    } as unknown as import('three').SkinnedMesh;

    applyRahkshiBattleMaterialsToMesh(mesh, { Battle_Metal: '#583927' });

    expect(metal.color.getHexString()).toBe('583927');
    expect(metal.metalness).toBe(0.9);
    expect(metal.roughness).toBe(0.3);
  });

  test('applyRahkshiBattleSpeciesMetalToMesh keeps authored silver and boosts PBR', () => {
    const metal = new MeshStandardMaterial({
      color: '#545b56',
      metalness: 0.1,
      name: 'Battle_Metal',
    });
    const mesh = {
      frustumCulled: true,
      isSkinnedMesh: true,
      material: metal,
    } as unknown as import('three').SkinnedMesh;

    applyRahkshiBattleSpeciesMetalToMesh(mesh);

    expect(metal.color.getHexString()).toBe('545b56');
    expect(metal.metalness).toBe(0.9);
    expect(metal.roughness).toBe(0.3);
    expect(mesh.frustumCulled).toBe(false);
  });

  test('does not CPU-skin vertices to compute a bounding sphere', () => {
    const armor = new MeshStandardMaterial({ color: '#ffffff', name: 'Battle_Armor' });
    const computeBoundingSphere = jest.fn();
    const mesh = {
      computeBoundingSphere,
      frustumCulled: true,
      geometry: { computeBoundingSphere: jest.fn() },
      isSkinnedMesh: true,
      material: armor,
    } as unknown as import('three').SkinnedMesh;

    applyRahkshiBattleMaterialsToMesh(mesh, { Battle_Armor: '#583927' });

    expect(computeBoundingSphere).not.toHaveBeenCalled();
    expect(mesh.geometry.computeBoundingSphere).not.toHaveBeenCalled();
    expect(mesh.frustumCulled).toBe(false);
  });
});

describe('internRahkshiSharedBattleMaterials', () => {
  beforeEach(() => {
    resetRahkshiSharedBattleMaterialsForTests();
  });

  function meshWith(name: string, color: string): Mesh {
    return new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color, name }));
  }

  test('shares unchanging slots across clones and keeps tint slots private', () => {
    const first = new Group();
    first.add(meshWith('Battle_Chassis', '#aaaaaa'), meshWith('Battle_Armor', '#ffffff'));
    const second = new Group();
    second.add(meshWith('Battle_Chassis', '#bbbbbb'), meshWith('Battle_Armor', '#cccccc'));

    internRahkshiSharedBattleMaterials(first);
    internRahkshiSharedBattleMaterials(second);

    const firstChassis = (first.children[0] as Mesh).material as MeshStandardMaterial;
    const secondChassis = (second.children[0] as Mesh).material as MeshStandardMaterial;
    const firstArmor = (first.children[1] as Mesh).material as MeshStandardMaterial;
    const secondArmor = (second.children[1] as Mesh).material as MeshStandardMaterial;

    expect(secondChassis).toBe(firstChassis);
    expect(isSharedGpuResource(firstChassis)).toBe(true);
    expect(firstArmor).not.toBe(secondArmor);
    expect(isSharedGpuResource(firstArmor)).toBe(false);
    expect(firstArmor.color.getHexString()).toBe('ffffff');
    expect(secondArmor.color.getHexString()).toBe('cccccc');
  });
});
