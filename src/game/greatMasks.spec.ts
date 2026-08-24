import { getGreatMaskNodeName, getGreatMaskVariant } from './greatMasks';
import { Mask } from '../types/Matoran';

describe('getGreatMaskNodeName', () => {
  test('strips the _Great suffix used for Toa Metru avatar ids', () => {
    expect(getGreatMaskNodeName(Mask.HauGreat)).toBe('Hau');
    expect(getGreatMaskNodeName(Mask.HunaGreat)).toBe('Huna');
    expect(getGreatMaskNodeName(Mask.RuruGreat)).toBe('Ruru');
  });

  test('passes through Masks.glb node names and Mata ids', () => {
    expect(getGreatMaskNodeName(Mask.Hau)).toBe('Hau');
    expect(getGreatMaskNodeName('Matatu')).toBe('Matatu');
  });
});

describe('getGreatMaskVariant', () => {
  test('upgrades every Kanohi with a Great sculpt', () => {
    expect(getGreatMaskVariant(Mask.Hau)).toBe(Mask.HauGreat);
    expect(getGreatMaskVariant(Mask.Huna)).toBe(Mask.HunaGreat);
    expect(getGreatMaskVariant(Mask.Komau)).toBe(Mask.KomauGreat);
    expect(getGreatMaskVariant(Mask.Mahiki)).toBe(Mask.MahikiGreat);
    expect(getGreatMaskVariant(Mask.Matatu)).toBe(Mask.MatatuGreat);
    expect(getGreatMaskVariant(Mask.Rau)).toBe(Mask.RauGreat);
    expect(getGreatMaskVariant(Mask.Ruru)).toBe(Mask.RuruGreat);
  });

  test('is idempotent and leaves sculpt-less Kanohi alone', () => {
    expect(getGreatMaskVariant(Mask.HunaGreat)).toBe(Mask.HunaGreat);
    expect(getGreatMaskVariant(Mask.Akaku)).toBe(Mask.Akaku);
    expect(getGreatMaskVariant(Mask.Kaukau)).toBe(Mask.Kaukau);
    expect(getGreatMaskVariant(Mask.HauNuva)).toBe(Mask.HauNuva);
  });
});
