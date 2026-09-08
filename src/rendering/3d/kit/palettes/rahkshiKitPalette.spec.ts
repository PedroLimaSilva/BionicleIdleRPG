import { MeshStandardMaterial } from 'three';
import { applyRahkshiBattleMaterialsToMesh } from './rahkshiKitPalette';

describe('applyRahkshiBattleMaterialsToMesh', () => {
  test('tints named slots without replacing materials', () => {
    const armor = new MeshStandardMaterial({ color: '#ffffff', name: 'Battle_Armor' });
    const metal = new MeshStandardMaterial({ color: '#ffffff', name: 'Battle_Metal' });
    const mesh = {
      frustumCulled: true,
      material: [armor, metal],
    } as unknown as import('three').Mesh;

    applyRahkshiBattleMaterialsToMesh(mesh, {
      Battle_Armor: '#0055BF',
      Battle_Metal: '#9BA19D',
    });

    expect(armor.color.getHexString()).toBe('0055bf');
    expect(armor.metalness).toBe(0.05);
    expect(metal.color.getHexString()).toBe('9ba19d');
    expect(metal.metalness).toBe(0.9);
    expect(mesh.frustumCulled).toBe(true);
  });
});
