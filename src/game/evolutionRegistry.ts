import { RecruitedCharacterData } from '../types/Matoran';
import type { EvolutionType } from '../types/Evolution';
import {
  canEvolveBohrokToKal,
  evolveBohrokToKal,
  BOHROK_KAL_EVOLUTION_COST,
} from './BohrokEvolution';
import {
  canEvolveMatoranToRebuilt,
  evolveMatoranToRebuilt,
  MATORAN_REBUILT_COST,
} from './MatoranEvolution';
import {
  canEvolveToaToNuva,
  evolveToaToNuva,
  TOA_NUVA_COST,
} from './ToaEvolution';

export type { EvolutionType };

export interface EvolutionHandler {
  canEvolve: (
    matoran: RecruitedCharacterData,
    completedQuests: string[]
  ) => boolean;
  evolve: (matoran: RecruitedCharacterData) => RecruitedCharacterData;
  cost: number;
}

export const EVOLUTION_HANDLERS: Record<EvolutionType, EvolutionHandler> = {
  bohrok_kal: {
    canEvolve: (m) => canEvolveBohrokToKal(m),
    evolve: evolveBohrokToKal,
    cost: BOHROK_KAL_EVOLUTION_COST,
  },
  matoran_rebuilt: {
    canEvolve: (m, q) => canEvolveMatoranToRebuilt(m, q),
    evolve: evolveMatoranToRebuilt,
    cost: MATORAN_REBUILT_COST,
  },
  toa_nuva: {
    canEvolve: (m, q) => canEvolveToaToNuva(m, q),
    evolve: evolveToaToNuva,
    cost: TOA_NUVA_COST,
  },
};
