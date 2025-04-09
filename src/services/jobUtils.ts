import { applyJobExp } from '../game/Jobs';
import { WIDGET_RATE } from '../data/jobs';
import { RecruitedMatoran } from '../types/Matoran';
import { LogType } from '../types/Logging';
import { ActivityLogEntry } from '../types/Logging';
import { Inventory } from './inventoryUtils';

type TickResult = {
  updatedMatoran: RecruitedMatoran;
  earnedWidgets: number;
  earnedLoot: Inventory;
  expGained: number;
  logs: ActivityLogEntry[];
};

export function tickMatoranJobExp(
  matoran: RecruitedMatoran,
  now: number
): TickResult {
  const [updated, exp, loot] = applyJobExp(matoran, now);
  const earnedWidgets = Math.floor(exp * WIDGET_RATE);

  const logs: ActivityLogEntry[] = [];

  if (earnedWidgets > 0) {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran.name} earned ${earnedWidgets} widgets`,
      type: LogType.Widgets,
      timestamp: now,
    });
  }

  Object.entries(loot).forEach(([item, amount]) => {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran.name} added ${amount} ${item} to the inventory`,
      type: LogType.Loot,
      timestamp: now,
    });
  });

  if (exp > 0) {
    logs.push({
      id: crypto.randomUUID(),
      message: `${matoran.name} gained ${exp} EXP`,
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
