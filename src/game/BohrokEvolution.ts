import { RecruitedCharacterData } from '../types/Matoran';
import { MATORAN_DEX } from '../data/matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

const BOHROK_KAL_LEVEL = 100;

const BOHROK_TO_KAL_ID: Record<string, string> = {
  tahnok: 'tahnok_kal',
  gahlok: 'gahlok_kal',
  lehvak: 'lehvak_kal',
  pahrak: 'pahrak_kal',
  nuhvok: 'nuhvok_kal',
  kohrak: 'kohrak_kal',
};

/**
 * Evolves a Bohrok to Bohrok Kal when they reach level 100.
 * Returns the same matoran if evolution does not apply.
 */
export function evolveBohrokToKalIfReady(
  matoran: RecruitedCharacterData
): RecruitedCharacterData {
  const matoranDex = MATORAN_DEX[matoran.id];
  if (!matoranDex || matoranDex.stage !== MatoranStage.Bohrok) {
    return matoran;
  }

  const level = getLevelFromExp(matoran.exp);
  if (level < BOHROK_KAL_LEVEL) {
    return matoran;
  }

  const evolvedId = BOHROK_TO_KAL_ID[matoran.id];
  if (!evolvedId) {
    return matoran;
  }

  return {
    ...matoran,
    id: evolvedId,
  };
}
