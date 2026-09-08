import { MeshStandardMaterial } from 'three';
import { applyRahkshiBattleMaterialsToMesh, rahkshiBattleTintMap } from './rahkshiKitPalette';
import { KraataPower } from '../../../../types/Kraata';
import { getRahkshiArmorColors } from '../../../../data/rahkshiArmorColors';

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
});
