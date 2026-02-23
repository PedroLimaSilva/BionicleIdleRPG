import {
  isNuvaSymbolsSequestered,
  BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
  BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
} from './nuvaSymbols';

describe('isNuvaSymbolsSequestered', () => {
  test('returns false when stolen symbols not completed', () => {
    expect(isNuvaSymbolsSequestered([])).toBe(false);
    expect(isNuvaSymbolsSequestered(['other_quest'])).toBe(false);
    expect(isNuvaSymbolsSequestered([BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID])).toBe(false);
  });

  test('returns true when stolen symbols completed but final confrontation not', () => {
    expect(isNuvaSymbolsSequestered([BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID])).toBe(true);
    expect(
      isNuvaSymbolsSequestered([BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID, 'other_quest'])
    ).toBe(true);
  });

  test('returns false when both stolen symbols and final confrontation completed', () => {
    expect(
      isNuvaSymbolsSequestered([
        BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
        BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
      ])
    ).toBe(false);
  });
});
