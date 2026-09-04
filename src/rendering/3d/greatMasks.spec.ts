import { getGreatMaskNodeName } from './greatMasks';
import { Mask } from '../../types/Matoran';

describe('getGreatMaskNodeName', () => {
  test('passes through Toa Metru avatar ids that already include _Great', () => {
    expect(getGreatMaskNodeName(Mask.HauGreat)).toBe('Hau_Great');
    expect(getGreatMaskNodeName(Mask.HunaGreat)).toBe('Huna_Great');
    expect(getGreatMaskNodeName(Mask.RuruGreat)).toBe('Ruru_Great');
  });

  test('appends _Great for Mata ids used on the Toa Metru rig', () => {
    expect(getGreatMaskNodeName(Mask.Hau)).toBe('Hau_Great');
    expect(getGreatMaskNodeName('Matatu')).toBe('Matatu_Great');
  });
});
