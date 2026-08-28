import { Mask } from '../../types/Matoran';
import { resolveWornMask } from './wornMask';

describe('resolveWornMask', () => {
  const hau = { mask: Mask.Hau };

  test('uses the dex default when it is collected and there is no override', () => {
    expect(resolveWornMask(hau, [Mask.Hau, Mask.Kakama])).toBe(Mask.Hau);
  });

  test('falls back to the first collected mask when the dex default is not collected', () => {
    expect(resolveWornMask(hau, [Mask.Kakama, Mask.Miru])).toBe(Mask.Kakama);
  });

  test('honors a collected mask override', () => {
    expect(resolveWornMask({ ...hau, maskOverride: Mask.Kakama }, [Mask.Hau, Mask.Kakama])).toBe(
      Mask.Kakama
    );
  });

  test('ignores an override that has not been collected', () => {
    expect(resolveWornMask({ ...hau, maskOverride: Mask.Kakama }, [Mask.Hau])).toBe(Mask.Hau);
  });

  test('unlockAllMasks honors any override without a collection check', () => {
    expect(
      resolveWornMask({ ...hau, maskOverride: Mask.Kakama, unlockAllMasks: true }, [Mask.Hau])
    ).toBe(Mask.Kakama);
  });

  test('unlockAllMasks without an override keeps the dex default', () => {
    expect(resolveWornMask({ ...hau, unlockAllMasks: true }, [])).toBe(Mask.Hau);
  });

  test('falls back to the dex default when the collected list is empty', () => {
    expect(resolveWornMask(hau, [])).toBe(Mask.Hau);
  });
});
