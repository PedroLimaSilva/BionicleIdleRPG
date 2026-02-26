import { RecruitedCharacterData } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';
import { getEffectiveStage } from './characterStage';
import { evolveCharacter } from './MatoranEvolution';
import { MatoranStage } from '../types/Matoran';

export const TOA_NUVA_QUEST_ID = 'bohrok_evolve_toa_nuva';
export const TOA_NUVA_LEVEL = 50;
export const TOA_NUVA_COST = 3000;

const TOA_MATA_TO_NUVA: Record<string, string> = {
  Toa_Tahu: 'Toa_Tahu_Nuva',
  Toa_Gali: 'Toa_Gali_Nuva',
  Toa_Pohatu: 'Toa_Pohatu_Nuva',
  Toa_Onua: 'Toa_Onua_Nuva',
  Toa_Kopaka: 'Toa_Kopaka_Nuva',
  Toa_Lewa: 'Toa_Lewa_Nuva',
};

/**
 * Returns true if the Toa Mata can evolve to Toa Nuva (quest complete, level 50+).
 */
export function canEvolveToaToNuva(
  matoran: RecruitedCharacterData,
  completedQuests: string[]
): boolean {
  if (!completedQuests.includes(TOA_NUVA_QUEST_ID)) {
    return false;
  }

  if (!(matoran.id in TOA_MATA_TO_NUVA)) {
    return false;
  }

  const effectiveStage = getEffectiveStage(matoran);
  if (effectiveStage !== MatoranStage.ToaMata) {
    return false;
  }

  const level = getLevelFromExp(matoran.exp);
  return level >= TOA_NUVA_LEVEL;
}

/**
 * Returns the evolved Toa Nuva character data. Call only when canEvolveToaToNuva is true.
 */
export function evolveToaToNuva(
  matoran: RecruitedCharacterData
): RecruitedCharacterData {
  return evolveCharacter(matoran, { evolutionMap: TOA_MATA_TO_NUVA });
}
