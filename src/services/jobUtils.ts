import { applyJobExp } from '../game/Jobs';
import { WIDGET_RATE } from '../data/jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { Inventory } from './inventoryUtils';

type TickResult = {
  updatedMatoran: RecruitedCharacterData;
  earnedWidgets: number;
  earnedLoot: Inventory;
  expGained: number;
};

export function tickMatoranJobExp(matoran: RecruitedCharacterData, now: number): TickResult {
  const [updated, exp, loot] = applyJobExp(matoran, now);
  const earnedWidgets = Math.floor(exp * WIDGET_RATE);

  return {
    updatedMatoran: updated,
    earnedWidgets,
    earnedLoot: loot,
    expGained: exp,
  };
}
