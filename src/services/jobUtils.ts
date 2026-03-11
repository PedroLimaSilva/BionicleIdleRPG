import { applyJobExp } from '../game/Jobs';
import { PROTODERMIS_RATE } from '../data/jobs';
import { RecruitedCharacterData } from '../types/Matoran';

type TickResult = {
  updatedMatoran: RecruitedCharacterData;
  earnedProtodermis: number;
  expGained: number;
};

export function tickMatoranJobExp(matoran: RecruitedCharacterData, now: number): TickResult {
  const [updated, exp] = applyJobExp(matoran, now);
  const earnedProtodermis = Math.floor(exp * PROTODERMIS_RATE);

  return {
    updatedMatoran: updated,
    earnedProtodermis,
    expGained: exp,
  };
}
