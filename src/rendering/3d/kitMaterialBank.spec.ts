import { LegoColor } from '../../types/Colors';
import { getWeatheredMetalMaterial } from './CharacterScene/WeatheredMetalMaterial';
import { buildTransmissiveKitMaterial } from './hooks/transmissiveKitMaterial';
import {
  BANK_PLASTIC_WEATHERED,
  isKitMaterialBankPrimed,
  primeKitMaterialBank,
  resetKitMaterialBankPrimeFlag,
} from './kitMaterialBank';

describe('primeKitMaterialBank', () => {
  afterEach(() => {
    resetKitMaterialBankPrimeFlag();
  });

  test('is idempotent and seeds weathered plus transmissive instances', () => {
    expect(isKitMaterialBankPrimed()).toBe(false);
    primeKitMaterialBank();
    primeKitMaterialBank();
    expect(isKitMaterialBankPrimed()).toBe(true);

    const red = getWeatheredMetalMaterial(LegoColor.Red, BANK_PLASTIC_WEATHERED);
    const blue = getWeatheredMetalMaterial(LegoColor.Blue, BANK_PLASTIC_WEATHERED);
    expect(red).not.toBe(blue);
    expect(red.customProgramCacheKey?.()).toBe(blue.customProgramCacheKey?.());

    const brainA = buildTransmissiveKitMaterial(
      'Brain',
      'brain',
      LegoColor.TransNeonGreen,
      LegoColor.TransNeonGreen,
      0.1
    );
    const brainB = buildTransmissiveKitMaterial(
      'Brain',
      'brain',
      LegoColor.TransNeonGreen,
      LegoColor.TransNeonGreen,
      0.1
    );
    expect(brainA).toBe(brainB);
  });
});
