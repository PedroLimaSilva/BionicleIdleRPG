import { MeshStandardMaterial } from 'three';
import { prepareClonedMaskMaterial } from './maskMaterial';

describe('prepareClonedMaskMaterial', () => {
  it('forces dielectric shading on non-glow mask materials', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau_baked', metalness: 1, roughness: 0.1 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0);
    expect(mat.roughness).toBe(0.55);
  });

  it('leaves glow materials metallic for emissive lenses', () => {
    const mat = new MeshStandardMaterial({ name: 'Kopaka Glow', metalness: 0.8, roughness: 0.2 });
    prepareClonedMaskMaterial(mat);
    expect(mat.transparent).toBe(true);
    expect(mat.metalness).toBe(0.8);
    expect(mat.roughness).toBe(0.2);
  });
});
