import { MeshStandardMaterial } from 'three';
import { mapRahkshiGlowMaterials } from './rahkshiGlow';
import { applySelectiveBloomMrt } from './selectiveBloom';

describe('rahkshiGlow helpers', () => {
  test('mapRahkshiGlowMaterials clones the Battle_Bloom slot on Battle_Glow', () => {
    const bloom = new MeshStandardMaterial({ name: 'Battle_Bloom' });
    const mesh = {
      material: bloom,
      name: 'Battle_Glow',
    } as unknown as import('three').Mesh;

    const changed = mapRahkshiGlowMaterials(mesh, (mat) => {
      const clone = mat.clone();
      applySelectiveBloomMrt(clone);
      return clone;
    });

    expect(changed).toBe(true);
    const material = mesh.material as MeshStandardMaterial;
    expect(material).not.toBe(bloom);
    expect((material as MeshStandardMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
  });
});
