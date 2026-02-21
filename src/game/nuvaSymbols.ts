/** Quest IDs for the Bohrok Kal arc. Used to derive Nuva symbols state. */
export const BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID = 'bohrok_kal_stolen_symbols';
export const BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID = 'bohrok_kal_final_confrontation';

/**
 * True when the Bohrok Kal have sequestered the Nuva symbols and the Toa have not yet reclaimed them.
 * Derived from completed quests: stolen symbols completed, final confrontation not yet completed.
 */
export function isNuvaSymbolsSequestered(completedQuests: string[]): boolean {
  return (
    completedQuests.includes(BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID) &&
    !completedQuests.includes(BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID)
  );
}
