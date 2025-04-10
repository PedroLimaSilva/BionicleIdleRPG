import {
  ListedCharacterData,
  Matoran,
  RecruitedCharacterData,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { GameItemId } from '../data/loot';
import { JOB_DETAILS } from '../data/jobs';
import { getProductivityModifier } from '../game/Jobs';

export function recruitMatoran(
  character: ListedCharacterData,
  widgets: number,
  buyableCharacters: ListedCharacterData[],
  addItem: (item: GameItemId, amount: number) => void
): {
  updatedWidgets: number;
  newRecruit: RecruitedCharacterData | null;
  updatedBuyable: ListedCharacterData[];
} {
  if (widgets < character.cost) {
    alert('Not enough widgets!');
    return {
      updatedWidgets: widgets,
      newRecruit: null,
      updatedBuyable: buyableCharacters,
    };
  }

  const recruitedCharacter: RecruitedCharacterData = {
    id: character.id,
    exp: 0,
  };

  character.requiredItems?.forEach((requirement) => {
    addItem(requirement.item, -requirement.quantity);
  });

  return {
    updatedWidgets: widgets - character.cost,
    newRecruit: recruitedCharacter,
    updatedBuyable: buyableCharacters.filter((m) => m.id !== character.id),
  };
}

export function assignJob(
  id: Matoran['id'],
  job: MatoranJob,
  matoran: RecruitedCharacterData[]
): RecruitedCharacterData[] {
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
  matoran: RecruitedCharacterData[]
): RecruitedCharacterData[] {
  return matoran.map((m) =>
    m.id === id ? { ...m, assignment: undefined } : m
  );
}
