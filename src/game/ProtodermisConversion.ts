/** Each protodermis spent grants this much character XP when training a Toa. */
export const PROTODERMIS_TO_EXP_RATIO = 1;

export function expGainedFromProtodermisSpend(protodermisSpent: number): number {
  return protodermisSpent * PROTODERMIS_TO_EXP_RATIO;
}
