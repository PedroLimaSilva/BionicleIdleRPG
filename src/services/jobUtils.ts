import { applyJobExp } from '../game/Jobs';
import { WIDGET_RATE } from '../data/jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { LogType } from '../types/Logging';
import { ActivityLogEntry } from '../types/Logging';
import { Inventory } from './inventoryUtils';
import { MATORAN_DEX } from '../data/matoran';

type TickResult = {
  updatedMatoran: RecruitedCharacterData;
  earnedWidgets: number;
  earnedLoot: Inventory;
  expGained: number;
  logs: ActivityLogEntry[];
};

export function tickMatoranJobExp(matoran: RecruitedCharacterData, now: number): TickResult {
  const [updated, exp, loot] = applyJobExp(matoran, now);
  const earnedWidgets = Math.floor(exp * WIDGET_RATE);

  const matoran_dex = MATORAN_DEX[matoran.id];

  const logs: ActivityLogEntry[] = [];

  if (earnedWidgets > 0) {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran_dex.name} earned ${earnedWidgets} widgets`,
      type: LogType.Widgets,
      timestamp: now,
    });
  }

  Object.entries(loot).forEach(([item, amount]) => {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran_dex.name} added ${amount} ${item} to the inventory`,
      type: LogType.Loot,
      timestamp: now,
    });
  });

  if (exp > 0) {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran_dex.name} gained ${exp} EXP`,
      type: LogType.Gain,
      timestamp: now,
    });
  }

  return {
    updatedMatoran: updated,
    earnedWidgets,
    earnedLoot: loot,
    expGained: exp,
    logs,
  };
}
