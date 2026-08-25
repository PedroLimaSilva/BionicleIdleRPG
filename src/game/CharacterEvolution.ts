import { isCustomCharacterId, Mask, MatoranStage, RecruitedCharacterData } from '../types/Matoran';
import { CHARACTER_DEX } from '../data/dex/index';
import { getLevelFromExp } from './Levelling';
import { MOL_TAKANUVA_RISES_QUEST_ID } from '../data/quests/mask_of_light';
import {
  METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID,
  METRU_NUI_SAGA_BEGIN_QUEST_ID,
} from '../data/quests/metru_nui';
import { METRU_TOA_EVOLUTION_MAP } from './metruMatoran';
import { DEFAULT_CUSTOM_MATA_MODEL_ID } from './customMataBuild';

export const EVOLUTION_LEVEL_REQUIREMENT = 40;
export const BOHROK_KAL_LEVEL_REQUIREMENT = 100;
export const TAKANUVA_LEVEL_REQUIREMENT = 100;
export const CUSTOM_TOA_LEVEL_REQUIREMENT = 60;
export const METRU_TOA_METRU_LEVEL_REQUIREMENT = 27;
export const METRU_TOA_METRU_COST = 3000;

/** Cost for upgrading a custom matoran to Rebuilt form (matches the standard Rebuilt cost). */
export const CUSTOM_REBUILT_COST = 1000;
/** Cost for evolving a custom matoran to Toa Mata form. */
export const CUSTOM_TOA_COST = 3000;

/**
 * Special quest id used to gate custom-character Toa evolution. Completing the Metru Nui
 * saga opener unlocks custom Toa evolution for player-created characters.
 */
export const CUSTOM_TOA_UNLOCK_QUEST_ID = METRU_NUI_SAGA_BEGIN_QUEST_ID;

export interface EvolutionPath {
  unlockedByQuest: string;
  levelRequired: number;
  maskRequired?: Mask;
  protodermisCost: number;
  evolutions: Record<string, string>;
  stageOverrides?: Record<string, MatoranStage>;
}

export const EVOLUTION_PATHS: EvolutionPath[] = [
  {
    evolutions: {
      Toa_Gali: 'Toa_Gali_Nuva',
      Toa_Kopaka: 'Toa_Kopaka_Nuva',
      Toa_Lewa: 'Toa_Lewa_Nuva',
      Toa_Onua: 'Toa_Onua_Nuva',
      Toa_Pohatu: 'Toa_Pohatu_Nuva',
      Toa_Tahu: 'Toa_Tahu_Nuva',
    },
    levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
    protodermisCost: 5000,
    unlockedByQuest: 'bohrok_evolve_toa_nuva',
  },
  {
    evolutions: {
      Huki: 'Hewkii',
      Jala: 'Jaller',
      Maku: 'Macku',
    },
    levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
    protodermisCost: 1000,
    stageOverrides: {
      Hafu: MatoranStage.Rebuilt,
      Hahli: MatoranStage.Rebuilt,
      Kapura: MatoranStage.Rebuilt,
      Kivi: MatoranStage.Rebuilt,
      Kongu: MatoranStage.Rebuilt,
      Kopeke: MatoranStage.Rebuilt,
      Lumi: MatoranStage.Rebuilt,
      Matoro: MatoranStage.Rebuilt,
      Nuparu: MatoranStage.Rebuilt,
      Onepu: MatoranStage.Rebuilt,
      Taipu: MatoranStage.Rebuilt,
      Takua: MatoranStage.Rebuilt,
      Tamaru: MatoranStage.Rebuilt,
    },
    unlockedByQuest: 'bohrok_kal_naming_day',
  },
  {
    evolutions: {
      gahlok: 'gahlok_kal',
      kohrak: 'kohrak_kal',
      lehvak: 'lehvak_kal',
      nuhvok: 'nuhvok_kal',
      pahrak: 'pahrak_kal',
      tahnok: 'tahnok_kal',
    },
    levelRequired: BOHROK_KAL_LEVEL_REQUIREMENT,
    protodermisCost: 5000,
    unlockedByQuest: 'bohrok_kal_naming_day',
  },
  {
    evolutions: {
      Takua: 'Takanuva',
    },
    levelRequired: TAKANUVA_LEVEL_REQUIREMENT,
    maskRequired: Mask.Avohkii,
    protodermisCost: 3000,
    unlockedByQuest: MOL_TAKANUVA_RISES_QUEST_ID,
  },
  {
    evolutions: METRU_TOA_EVOLUTION_MAP,
    levelRequired: METRU_TOA_METRU_LEVEL_REQUIREMENT,
    protodermisCost: METRU_TOA_METRU_COST,
    unlockedByQuest: METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID,
  },
];

export interface AvailableEvolution {
  evolvedId?: string;
  stageOverride?: MatoranStage;
  maskRequired?: Mask;
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
  if (isCustomCharacterId(character.id)) {
    const currentStage = character.stage ?? CHARACTER_DEX[character.id]?.stage;
    if (
      currentStage === MatoranStage.Diminished &&
      completedQuests.includes('bohrok_kal_naming_day')
    ) {
      return {
        label: `Upgrade to ${MatoranStage.Rebuilt} form`,
        levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
        protodermisCost: CUSTOM_REBUILT_COST,
        stageOverride: MatoranStage.Rebuilt,
      };
    }
    if (
      currentStage === MatoranStage.Rebuilt &&
      completedQuests.includes(CUSTOM_TOA_UNLOCK_QUEST_ID)
    ) {
      return {
        label: `Evolve to Toa`,
        levelRequired: CUSTOM_TOA_LEVEL_REQUIREMENT,
        protodermisCost: CUSTOM_TOA_COST,
        stageOverride: MatoranStage.ToaMata,
      };
    }
    return null;
  }

  for (const path of EVOLUTION_PATHS) {
    if (!completedQuests.includes(path.unlockedByQuest)) continue;

    const evolvedId = path.evolutions[character.id];
    if (evolvedId) {
      const evolvedName = CHARACTER_DEX[evolvedId]?.name ?? evolvedId;
      return {
        evolvedId,
        label: `Evolve to ${evolvedName}`,
        levelRequired: path.levelRequired,
        maskRequired: path.maskRequired,
        protodermisCost: path.protodermisCost,
      };
    }

    const targetStage = path.stageOverrides?.[character.id];
    if (targetStage !== undefined) {
      const currentStage = character.stage ?? CHARACTER_DEX[character.id]?.stage;
      if (currentStage !== targetStage) {
        return {
          label: `Upgrade to ${targetStage} form`,
          levelRequired: path.levelRequired,
          maskRequired: path.maskRequired,
          protodermisCost: path.protodermisCost,
          stageOverride: targetStage,
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
      stage: CHARACTER_DEX[evolution.evolvedId]?.stage,
    };
  }
  if (evolution.stageOverride !== undefined) {
    const next: RecruitedCharacterData = {
      ...character,
      stage: evolution.stageOverride,
    };
    if (
      isCustomCharacterId(character.id) &&
      evolution.stageOverride === MatoranStage.ToaMata &&
      character.customMataModelId === undefined
    ) {
      next.customMataModelId = DEFAULT_CUSTOM_MATA_MODEL_ID;
    }
    return next;
  }
  return character;
}
