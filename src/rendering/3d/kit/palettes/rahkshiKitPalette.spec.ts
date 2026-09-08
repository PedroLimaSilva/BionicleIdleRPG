import { MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
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

  test('applyRahkshiBattleMaterialsToMesh tints skinned slots in place with colorNode', () => {
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

    applyRahkshiBattleMaterialsToMesh(mesh, { Battle_Armor: '#0055BF' });

    const materials = mesh.material as MeshStandardMaterial[];
    expect(materials[0]).toBe(armor);
    expect(materials[0].color.getHexString()).toBe('0055bf');
    expect(
      (materials[0] as MeshStandardMaterial & { colorNode?: unknown }).colorNode
    ).toBeDefined();
    expect(materials[1]).toBe(chassis);
    expect(materials[1].metalness).toBe(0.2);
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

    const next = mesh.material as MeshPhysicalMaterial;
    expect(next).not.toBe(metal);
    expect(next).toBeInstanceOf(MeshPhysicalMaterial);
    expect(next.color.getHexString()).toBe('583927');
    expect(next.metalness).toBe(0.9);
    expect(next.roughness).toBe(0.3);
  });
});
