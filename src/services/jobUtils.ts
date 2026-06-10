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
    earnedProtodermis,
    expGained: exp,
    updatedMatoran: updated,
  };
}

type TickRosterResult = {
  updated: RecruitedCharacterData[];
  protodermisGain: number;
};

/** Applies one online job tick to every assigned character; idle roster members are unchanged. */
export function tickRecruitedCharactersJobExp(
  characters: RecruitedCharacterData[],
  now: number
): TickRosterResult {
  let protodermisGain = 0;

  const updated = characters.map((matoran) => {
    if (!matoran.assignment) return matoran;

    const { earnedProtodermis, updatedMatoran } = tickMatoranJobExp(matoran, now);
    protodermisGain += earnedProtodermis;
    return updatedMatoran;
  });

  return { protodermisGain, updated };
}
