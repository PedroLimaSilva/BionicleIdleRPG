import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { applyMaskPowerEmissive, setupMaskDiscolorationShader } from './maskDiscoloration';

describe('applyMaskPowerEmissive', () => {
  test('never enables emissive glow', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' });
    applyMaskPowerEmissive(mat, '#ff0000', true);
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.emissive.getHex()).toBe(0);
  });

  test('setupMaskDiscolorationShader does not install TSL nodes', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' });
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    setupMaskDiscolorationShader(mesh, '#ffffff');
    expect(mat.colorNode).toBeUndefined();
    expect(mat.emissiveNode).toBeUndefined();
  });
});
