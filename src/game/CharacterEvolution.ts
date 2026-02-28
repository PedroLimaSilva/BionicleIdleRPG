import { MatoranStage, RecruitedCharacterData } from '../types/Matoran';
import { CHARACTER_DEX } from '../data/dex/index';
import { getLevelFromExp } from './Levelling';

export const EVOLUTION_LEVEL_REQUIREMENT = 50;
export const BOHROK_KAL_LEVEL_REQUIREMENT = 100;

export interface EvolutionPath {
  unlockedByQuest: string;
  levelRequired: number;
  protodermisCost: number;
  evolutions: Record<string, string>;
  stageOverrides?: Record<string, MatoranStage>;
}

export const EVOLUTION_PATHS: EvolutionPath[] = [
  {
    unlockedByQuest: 'bohrok_evolve_toa_nuva',
    levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
    protodermisCost: 5000,
    evolutions: {
      Toa_Tahu: 'Toa_Tahu_Nuva',
      Toa_Gali: 'Toa_Gali_Nuva',
      Toa_Pohatu: 'Toa_Pohatu_Nuva',
      Toa_Onua: 'Toa_Onua_Nuva',
      Toa_Kopaka: 'Toa_Kopaka_Nuva',
      Toa_Lewa: 'Toa_Lewa_Nuva',
    },
  },
  {
    unlockedByQuest: 'bohrok_kal_naming_day',
    levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
    protodermisCost: 1000,
    evolutions: {
      Jala: 'Jaller',
      Maku: 'Macku',
      Huki: 'Hewkii',
    },
    stageOverrides: {
      Kapura: MatoranStage.Rebuilt,
      Takua: MatoranStage.Rebuilt,
      Hahli: MatoranStage.Rebuilt,
      Nuparu: MatoranStage.Rebuilt,
      Onepu: MatoranStage.Rebuilt,
      Kongu: MatoranStage.Rebuilt,
      Matoro: MatoranStage.Rebuilt,
      Lumi: MatoranStage.Rebuilt,
      Kivi: MatoranStage.Rebuilt,
      Taipu: MatoranStage.Rebuilt,
      Tamaru: MatoranStage.Rebuilt,
      Kopeke: MatoranStage.Rebuilt,
      Hafu: MatoranStage.Rebuilt,
    },
  },
  {
    unlockedByQuest: 'bohrok_kal_naming_day',
    levelRequired: BOHROK_KAL_LEVEL_REQUIREMENT,
    protodermisCost: 5000,
    evolutions: {
      tahnok: 'tahnok_kal',
      gahlok: 'gahlok_kal',
      lehvak: 'lehvak_kal',
      pahrak: 'pahrak_kal',
      nuhvok: 'nuhvok_kal',
      kohrak: 'kohrak_kal',
    },
  },
];

export interface AvailableEvolution {
  evolvedId?: string;
  stageOverride?: MatoranStage;
  label: string;
  levelRequired: number;
  protodermisCost: number;
}

/**
 * Checks all evolution paths for a pending evolution for the given character.
 * Returns null if no evolution is available.
 */
export function getAvailableEvolution(
  character: RecruitedCharacterData,
  completedQuests: string[]
): AvailableEvolution | null {
  for (const path of EVOLUTION_PATHS) {
    if (!completedQuests.includes(path.unlockedByQuest)) continue;

    const evolvedId = path.evolutions[character.id];
    if (evolvedId) {
      const evolvedName = CHARACTER_DEX[evolvedId]?.name ?? evolvedId;
      return {
        evolvedId,
        label: `Evolve to ${evolvedName}`,
        levelRequired: path.levelRequired,
        protodermisCost: path.protodermisCost,
      };
    }

    const targetStage = path.stageOverrides?.[character.id];
    if (targetStage !== undefined) {
      const currentStage = character.stage ?? CHARACTER_DEX[character.id]?.stage;
      if (currentStage !== targetStage) {
        return {
          stageOverride: targetStage,
          label: `Upgrade to ${targetStage} form`,
          levelRequired: path.levelRequired,
          protodermisCost: path.protodermisCost,
        };
      }
    }
  }
  return null;
}

export function meetsEvolutionLevel(
  character: RecruitedCharacterData,
  evolution: AvailableEvolution
): boolean {
  return getLevelFromExp(character.exp) >= evolution.levelRequired;
}

/**
 * Returns evolved character data. Only call when evolution is available.
 */
export function applyCharacterEvolution(
  character: RecruitedCharacterData,
  evolution: AvailableEvolution
): RecruitedCharacterData {
  if (evolution.evolvedId) {
    return {
      ...character,
      id: evolution.evolvedId,
      maskOverride: undefined,
    };
  }
  if (evolution.stageOverride !== undefined) {
    return {
      ...character,
      stage: evolution.stageOverride,
    };
  }
  return character;
}
