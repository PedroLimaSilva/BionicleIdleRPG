import { expGainedFromProtodermisSpend, PROTODERMIS_TO_EXP_RATIO } from './ProtodermisConversion';

describe('ProtodermisConversion', () => {
  test('exp gained matches ratio', () => {
    expect(PROTODERMIS_TO_EXP_RATIO).toBe(1);
    expect(expGainedFromProtodermisSpend(1)).toBe(1);
    expect(expGainedFromProtodermisSpend(50)).toBe(50);
    expect(expGainedFromProtodermisSpend(2000)).toBe(2000);
  });
});
