import { getGreatMaskNodeName } from './greatMasks';
import { Mask } from '../../types/Matoran';

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
