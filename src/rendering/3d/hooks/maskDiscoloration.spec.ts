import {
  BoxGeometry,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Texture,
} from 'three';
import { LegoColor } from '../../../types/Colors';
import { METRU_MASK_DISCOLORATION } from '../kit/palettes/metruKitPlayerPalette';
import { KAUKAU_TRANSMISSION } from './maskMaterial';
import {
  applyMaskDiscolorationUniforms,
  applyMaskPowerEmissive,
  MASK_POWER_EMISSIVE_INTENSITY,
  setupMaskDiscolorationShader,
} from './maskDiscoloration';

type MaskTslMaterial = MeshStandardMaterial & {
  colorNode?: unknown;
  emissiveNode?: unknown;
  metalnessNode?: unknown;
  mrtNode?: unknown;
  roughnessNode?: unknown;
};

describe('applyMaskPowerEmissive', () => {
  test('emits the mask color at the documented intensity while active', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    applyMaskPowerEmissive(mat, '#ff0000', true);
    expect(mat.emissiveIntensity).toBe(MASK_POWER_EMISSIVE_INTENSITY);
    expect(mat.emissive.getHex()).toBe(0xff0000);
    expect(mat.mrtNode).toBeDefined();
  });

  test('clears emission and bloom when inactive', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    applyMaskPowerEmissive(mat, '#ff0000', true);
    applyMaskPowerEmissive(mat, '#ff0000', false);
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.emissive.getHex()).toBe(0);
    expect(mat.mrtNode).toBeUndefined();
  });
});

describe('setupMaskDiscolorationShader', () => {
  test('installs TSL nodes, steals the emissive bake, and keys a shared topology program', () => {
    const bake = new Texture();
    const mat = new MeshStandardMaterial({ emissiveMap: bake, name: 'Hau' }) as MaskTslMaterial;
    const mesh = new Mesh(new BoxGeometry(1, 1, 1), mat);
    setupMaskDiscolorationShader(mesh, LegoColor.Red);
    expect(mat.emissiveMap).toBeNull();
    expect(mat.userData.bakedDiscolorationMap).toBe(bake);
    expect(mat.aoMap).toBe(bake);
    expect(mat.aoMapIntensity).toBe(0);
    expect(mat.userData.maskCrownColor).toBeInstanceOf(Color);
    expect(mat.userData.maskPowerColor).toBeInstanceOf(Color);
    expect(mat.userData.maskCrownIntensity).toBe(0);
    expect(mat.userData.maskPowerBloom).toBe(0);
    expect(mat.colorNode).toBeDefined();
    expect(mat.emissiveNode).toBeDefined();
    expect(mat.mrtNode).toBeDefined();
    expect(mat.metalnessNode).toBeDefined();
    expect(mat.roughnessNode).toBeDefined();
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.customProgramCacheKey()).toBe('mask_discolor|tx0|dc1');
  });

  test('shares a bake program across cloned mask materials', () => {
    const bakeA = new Texture();
    const bakeB = new Texture();
    const matA = new MeshStandardMaterial({ emissiveMap: bakeA, name: 'Hau' }) as MaskTslMaterial;
    const matB = new MeshStandardMaterial({
      emissiveMap: bakeB,
      name: 'Pakari',
    }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), matA), LegoColor.Red);
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), matB), LegoColor.Red);
    expect(matA.customProgramCacheKey()).toBe('mask_discolor|tx0|dc1');
    expect(matA.customProgramCacheKey()).toBe(matB.customProgramCacheKey());
    expect(matA.colorNode).toBe(matB.colorNode);
    expect(matA).not.toBe(matB);
  });

  test('masks without a bake skip the bake-sample graph', () => {
    const plain = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    const baked = new MeshStandardMaterial({
      emissiveMap: new Texture(),
      name: 'Hau',
    }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), plain), LegoColor.Red);
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), baked), LegoColor.Red);
    expect(plain.customProgramCacheKey()).toBe('mask_discolor|tx0|dc0');
    expect(baked.customProgramCacheKey()).toBe('mask_discolor|tx0|dc1');
    expect(plain.colorNode).not.toBe(baked.colorNode);
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
    expect(mat.userData.maskCrownIntensity).toBe(1);
  });

  test('toggles mask-power emission when the color uniform lost Color.prototype', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), mat), LegoColor.Red);
    const power = mat.userData.maskPowerUniforms as {
      bloomIntensity: { value: number };
      color: { value: { b: number; g: number; r: number } };
      intensity: { value: number };
    };
    power.color.value = { b: 0, g: 0, r: 0 };

    applyMaskPowerEmissive(mat, LegoColor.Red, true);
    const red = new Color(LegoColor.Red);
    expect(power.intensity.value).toBe(MASK_POWER_EMISSIVE_INTENSITY);
    expect(power.bloomIntensity.value).toBe(1);
    expect(power.color.value.r).toBeCloseTo(red.r, 5);
    expect(power.color.value.g).toBeCloseTo(red.g, 5);
    expect(power.color.value.b).toBeCloseTo(red.b, 5);

    applyMaskPowerEmissive(mat, LegoColor.Red, false);
    expect(power.intensity.value).toBe(0);
    expect(power.bloomIntensity.value).toBe(0);
    expect(power.color.value.r).toBe(0);
    expect(power.color.value.g).toBe(0);
    expect(power.color.value.b).toBe(0);
  });

  test('toggles mask-power emission and bloom through TSL uniforms after the first compile', () => {
    const mat = new MeshStandardMaterial({ name: 'Hau' }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), mat), LegoColor.Red);
    applyMaskPowerEmissive(mat, LegoColor.Red, true);
    expect(mat.emissiveIntensity).toBe(MASK_POWER_EMISSIVE_INTENSITY);
    expect(mat.mrtNode).toBeDefined();
    const power = mat.userData.maskPowerUniforms as {
      bloomIntensity: { value: number };
      color: { value: { getHex: () => number } };
      intensity: { value: number };
    };
    expect(power.intensity.value).toBe(MASK_POWER_EMISSIVE_INTENSITY);
    expect(power.bloomIntensity.value).toBe(1);
    expect(power.color.value.getHex()).toBe(0xc91a09);
    applyMaskPowerEmissive(mat, LegoColor.Red, false);
    expect(power.intensity.value).toBe(0);
    expect(power.bloomIntensity.value).toBe(0);
    expect(mat.emissiveIntensity).toBe(0);
    expect(mat.mrtNode).toBeDefined();
  });

  test('keeps frosted Kaukau on scalar metalness instead of a metalnessNode', () => {
    const mat = new MeshPhysicalMaterial({
      name: 'Kaukau_baked',
      opacity: 1,
      transmission: KAUKAU_TRANSMISSION,
    }) as MaskTslMaterial;
    setupMaskDiscolorationShader(new Mesh(new BoxGeometry(1, 1, 1), mat), LegoColor.Blue);
    expect(mat.colorNode).toBeDefined();
    expect(mat.metalnessNode).toBeUndefined();
    expect(mat.roughnessNode).toBeUndefined();
  });
});
