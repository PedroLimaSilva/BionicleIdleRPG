const TAHU_NUVA_INFECTED_START_QUEST_ID = 'mol_fall_of_ta_koro';
const TAHU_NUVA_INFECTED_END_QUEST_ID = 'mol_tahu_poisoned';

export function isTahuNuvaInfectedMaskPeriod(completedQuests: string[]): boolean {
  return (
    completedQuests.includes(TAHU_NUVA_INFECTED_START_QUEST_ID) &&
    !completedQuests.includes(TAHU_NUVA_INFECTED_END_QUEST_ID)
  );
}
