import {
  ListedMatoran,
  Matoran,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { GameItemId } from '../data/loot';
import { JOB_DETAILS } from '../data/jobs';
import { getProductivityModifier } from '../game/Jobs';

export function recruitMatoran(
  character: ListedMatoran,
  widgets: number,
  available: ListedMatoran[],
  addItem: (item: GameItemId, amount: number) => void
): {
  updatedWidgets: number;
  newRecruit: RecruitedMatoran | null;
  updatedAvailable: ListedMatoran[];
} {
  if (widgets < character.cost) {
    alert('Not enough widgets!');
    return {
      updatedWidgets: widgets,
      newRecruit: null,
      updatedAvailable: available,
    };
  }

  const recruitedCharacter: RecruitedMatoran = {
    ...character,
    exp: 0,
    status: MatoranStatus.Recruited,
  };

  character.requiredItems?.forEach((requirement) => {
    addItem(requirement.item, -requirement.quantity);
  });

  return {
    updatedWidgets: widgets - character.cost,
    newRecruit: recruitedCharacter,
    updatedAvailable: available.filter((m) => m.id !== character.id),
  };
}

export function assignJob(
  id: Matoran['id'],
  job: MatoranJob,
  matoran: RecruitedMatoran[]
): RecruitedMatoran[] {
  const baseRate = JOB_DETAILS[job].rate;
  const now = Date.now();

  return matoran.map((m) =>
    m.id === id
      ? {
          ...m,
          assignment: {
            job,
            expRatePerSecond: baseRate * getProductivityModifier(job, m),
            assignedAt: now,
          },
        }
      : m
  );
}

export function removeJob(
  id: Matoran['id'],
  matoran: RecruitedMatoran[]
): RecruitedMatoran[] {
  return matoran.map((m) =>
    m.id === id ? { ...m, assignment: undefined } : m
  );
}
