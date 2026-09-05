import { BoxGeometry, Mesh, MeshStandardMaterial, Texture } from 'three';
import { LegoColor } from '../../../types/Colors';
import { METRU_MASK_DISCOLORATION } from '../kit/palettes/metruKitPlayerPalette';
import {
  applyMaskDiscolorationUniforms,
  applyMaskPowerEmissive,
  setupMaskDiscolorationShader,
} from './maskDiscoloration';

type MaskTslMaterial = MeshStandardMaterial & {
  colorNode?: unknown;
  metalnessNode?: unknown;
  roughnessNode?: unknown;
};

describe('applyMaskPowerEmissive', () => {
  test('never enables emissive glow', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' });
    applyMaskPowerEmissive(mat, '#ff0000', true);
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.emissive.getHex()).toBe(0);
  });
});

describe('setupMaskDiscolorationShader', () => {
  test('installs TSL nodes, steals the emissive bake, and keys a unique bake program', () => {
    const bake = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: bake, name: 'Hau' }) as MaskTslMaterial;
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    setupMaskDiscolorationShader(mesh, LegoColor.Red);
    expect(mat.emissiveMap).toBeNull();
    expect(mat.userData.bakedDiscolorationMap).toBe(bake);
    expect(mat.colorNode).toBeDefined();
    expect(mat.metalnessNode).toBeDefined();
    expect(mat.roughnessNode).toBeDefined();
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.customProgramCacheKey()).toBe(`mask_bake_${mat.uuid}_${bake.uuid}`);
  });

  test('does not share a bake program across cloned mask materials', () => {
    const bakeA = new Texture();
    const bakeB = new Texture();
    const matA = new MeshStandardMaterial({ emissiveMap: bakeA, name: 'Hau' }) as MaskTslMaterial;
    const matB = new MeshStandardMaterial({
      emissiveMap: bakeB,
      name: 'Pakari',
    }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), matA), LegoColor.Red);
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), matB), LegoColor.Red);
    expect(matA.customProgramCacheKey()).not.toBe(matB.customProgramCacheKey());
  });

  test('skips glow materials', () => {
    const mat = new MeshStandardMaterial({ name: 'Glow' }) as MaskTslMaterial;
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    setupMaskDiscolorationShader(mesh, '#ffffff');
    expect(mat.colorNode).toBeUndefined();
  });

  test('applies Metru crown uniforms without enabling emission', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    setupMaskDiscolorationShader(mesh, LegoColor.Red);
    applyMaskDiscolorationUniforms(mat, METRU_MASK_DISCOLORATION, LegoColor.Red);
    expect(mat.emissiveIntensity).toBe(0);
    const crown = mat.userData.discolorationUniforms as { intensity: { value: number } };
    expect(crown.intensity.value).toBe(1);
  });
});
