import { MeshStandardMaterial } from 'three';
import { mapRahkshiGlowMaterials } from './rahkshiGlow';
import { applySelectiveBloomMrt } from './selectiveBloom';

describe('rahkshiGlow helpers', () => {
  test('mapRahkshiGlowMaterials clones every emissive slot on Battle_Glow', () => {
    const bloom = new MeshStandardMaterial({ name: 'Battle_Bloom' });
    const glow = new MeshStandardMaterial({ name: 'Glow' });
    const mesh = {
      material: [bloom, glow],
      name: 'Battle_Glow',
    } as unknown as import('three').Mesh;

    const changed = mapRahkshiGlowMaterials(mesh, (mat) => {
      const clone = mat.clone();
      applySelectiveBloomMrt(clone);
      return clone;
    });

    expect(changed).toBe(true);
    const materials = mesh.material as MeshStandardMaterial[];
    expect(materials[0]).not.toBe(bloom);
    expect(materials[1]).not.toBe(glow);
    expect((materials[0] as MeshStandardMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
    expect((materials[1] as MeshStandardMaterial & { mrtNode?: unknown }).mrtNode).toBeDefined();
  });
});
