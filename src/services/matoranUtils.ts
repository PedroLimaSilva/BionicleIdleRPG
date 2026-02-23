import {
  BaseMatoran,
  ListedCharacterData,
  Mask,
  MatoranStage,
  RecruitedCharacterData,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { GameItemId } from '../data/loot';
import { JOB_DETAILS } from '../data/jobs';
import { getProductivityModifier } from '../game/Jobs';
import { MATORAN_DEX } from '../data/matoran';
import { GameState } from '../types/GameState';
import { LegoColor } from '../types/Colors';
import { isNuvaSymbolsSequestered } from '../game/nuvaSymbols';

export function isMatoran(matoran: BaseMatoran) {
  return [MatoranStage.Diminished, MatoranStage.Rebuilt, MatoranStage.Metru].includes(
    matoran.stage
  );
}

export function isBohrok(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.Bohrok;
}

export function isToaNuva(matoran: BaseMatoran) {
  return matoran.stage === MatoranStage.ToaNuva;
}

export function isToa(matoran: BaseMatoran) {
  return isToaMata(matoran) || isToaNuva(matoran);
}

export function isToaMata(matoran: BaseMatoran) {
  return MatoranStage.ToaMata === matoran.stage;
}

const FULL_MASK_SET = [
  Mask.Akaku,
  Mask.Hau,
  Mask.Huna,
  Mask.Kakama,
  Mask.Kaukau,
  Mask.Komau,
  Mask.Mahiki,
  Mask.Matatu,
  Mask.Miru,
  Mask.Pakari,
  Mask.Rau,
  Mask.Ruru,
];

export function masksCollected(
  matoran: BaseMatoran,
  storyProgress: GameState['completedQuests']
): Mask[] {
  // Toa Nuva have a single fixed mask defined in the matoran dex; collected Mata masks no longer apply
  if (isToaNuva(matoran)) {
    return [matoran.mask];
  }

  const masks: Mask[] = [];
  if (storyProgress.includes('maskhunt_final_collection')) {
    return FULL_MASK_SET;
  }
  masks.push(matoran.mask);
  switch (matoran.id) {
    case 'Toa_Tahu': {
      if (storyProgress.includes('maskhunt_tahu_cave_akaku')) {
        masks.push(Mask.Akaku);
      }
      if (storyProgress.includes('maskhunt_tahu_miru')) {
        masks.push(Mask.Miru);
      }
      if (storyProgress.includes('maskhunt_forest_tahu_kakama')) {
        masks.push(Mask.Kakama);
      }
      break;
    }
    case 'Toa_Kopaka': {
      if (storyProgress.includes('maskhunt_kopaka_pohatu_icecliff')) {
        masks.push(Mask.Hau);
      }
      if (storyProgress.includes('maskhunt_kopaka_mahiki_huna')) {
        masks.push(Mask.Mahiki, Mask.Huna);
      }
      if (storyProgress.includes('maskhunt_kopaka_pakari')) {
        masks.push(Mask.Pakari);
      }
      if (storyProgress.includes('story_toa_second_council')) {
        masks.push(Mask.Kaukau);
      }
      break;
    }
    case 'Toa_Pohatu': {
      if (storyProgress.includes('maskhunt_pohatu_kaukau_bluff')) {
        masks.push(Mask.Kaukau);
      }
      break;
    }
    case 'Toa_Onua': {
      if (storyProgress.includes('maskhunt_onua_matatu_hau')) {
        masks.push(Mask.Matatu, Mask.Hau);
      }
      if (storyProgress.includes('story_toa_second_council')) {
        masks.push(Mask.Kaukau);
      }
      break;
    }
    case 'Toa_Lewa': {
      if (storyProgress.includes('maskhunt_lewa_pakari')) {
        masks.push(Mask.Pakari);
      }
      if (storyProgress.includes('maskhunt_lewa_kakama_komau')) {
        masks.push(Mask.Kakama, Mask.Komau);
      }
      break;
    }
    case 'Toa_Gali': {
      if (storyProgress.includes('maskhunt_gali_miru')) {
        masks.push(Mask.Miru);
      }
      break;
    }
    default: {
      // Do nothing
    }
  }
  return masks;
}

export function getRecruitedMatoran(
  id: string,
  recruitedMatoran: RecruitedCharacterData[]
): BaseMatoran & RecruitedCharacterData {
  return {
    ...MATORAN_DEX[id],
    ...recruitedMatoran.find((m) => m.id === id)!,
  };
}

/**
 * When nuva symbols are sequestered, Toa Nuva masks should appear light gray.
 * Returns matoran with maskColorOverride set when applicable.
 */
export function withSequesteredMaskOverride<T extends BaseMatoran & RecruitedCharacterData>(
  matoran: T,
  completedQuests: string[]
): T {
  if (!isNuvaSymbolsSequestered(completedQuests) || !isToaNuva(matoran)) {
    return matoran;
  }
  return { ...matoran, maskColorOverride: LegoColor.LightGray };
}

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
  id: RecruitedCharacterData['id'],
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
  id: RecruitedCharacterData['id'],
  matoran: RecruitedCharacterData[]
): RecruitedCharacterData[] {
  return matoran.map((m) => (m.id === id ? { ...m, assignment: undefined } : m));
}
