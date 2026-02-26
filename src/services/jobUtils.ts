import { applyJobExp } from '../game/Jobs';
import { PROTODERMIS_RATE } from '../data/jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { Inventory } from './inventoryUtils';

type TickResult = {
  updatedMatoran: RecruitedCharacterData;
  earnedProtodermis: number;
  earnedLoot: Inventory;
  expGained: number;
};

export function tickMatoranJobExp(matoran: RecruitedCharacterData, now: number): TickResult {
  const [updated, exp, loot] = applyJobExp(matoran, now);
  const earnedProtodermis = Math.floor(exp * PROTODERMIS_RATE);

  return {
    updatedMatoran: updated,
    earnedProtodermis,
    earnedLoot: loot,
    expGained: exp,
  };
}
