import { isTahuNuvaInfectedMaskPeriod } from './masks';

describe('mask story helpers', () => {
  test('tracks Tahu infection window from Ta-Koro fall until healing', () => {
    expect(isTahuNuvaInfectedMaskPeriod([])).toBe(false);
    expect(isTahuNuvaInfectedMaskPeriod(['mol_fall_of_ta_koro'])).toBe(true);
    expect(isTahuNuvaInfectedMaskPeriod(['mol_fall_of_ta_koro', 'mol_tahu_poisoned'])).toBe(false);
  });
});
