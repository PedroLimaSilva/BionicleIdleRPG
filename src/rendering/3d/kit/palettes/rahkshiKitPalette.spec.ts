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

  test('applyRahkshiBattleMaterialsToMesh tints matching slots and leaves others', () => {
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
      material: [armor, chassis],
    } as unknown as import('three').Mesh;

    applyRahkshiBattleMaterialsToMesh(mesh, { Battle_Armor: '#0055BF' });

    expect(armor.color.getHexString()).toBe('0055bf');
    expect(armor.metalness).toBe(0.1);
    expect(chassis.color.getHexString()).toBe('aaaaaa');
    expect(chassis.metalness).toBe(0.2);
  });
});
