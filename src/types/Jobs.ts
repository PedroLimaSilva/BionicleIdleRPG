import { ElementTribe } from './Matoran';
import { MatoranStage } from './Matoran';
import { Quest } from './Quests';

export enum MatoranJob {
  CharcoalMaker = 'CharcoalMaker',
  ProtodermisSmelter = 'ProtodermisSmelter',
  AlgaeHarvester = 'AlgaeHarvester',
  HydroTechnician = 'HydroTechnician',
  RahiNestWatcher = 'RahiNestWatcher',
  ChuteController = 'ChuteController',
  QuarryRunner = 'QuarryRunner',
  SculptureOperator = 'SculptureOperator',
  LightStoneFarmer = 'LightStoneFarmer',
  StasisTechnician = 'StasisTechnician',
  IceSculptor = 'IceSculptor',
  KnowledgeScribe = 'KnowledgeScribe',
  TaKoroRebuilder = 'TaKoroRebuilder',
  GaKoroRebuilder = 'GaKoroRebuilder',
  LeKoroRebuilder = 'LeKoroRebuilder',
  PoKoroRebuilder = 'PoKoroRebuilder',
  OnuKoroRebuilder = 'OnuKoroRebuilder',
  KoKoroRebuilder = 'KoKoroRebuilder',
}

export interface JobDetails {
  label: string;
  description: string;
  rate: number;
  elementAffinity: {
    favored: ElementTribe[];
    opposed: ElementTribe[];
  };
  unlock: {
    requiredProgress?: Quest['id'][];
  };
  /** If set, only characters with these stages can be assigned this job. */
  allowedStages?: MatoranStage[];
}

export type JobAssignment = {
  job: MatoranJob;
  expRatePerSecond: number;
  assignedAt: number; // timestamp (ms)
};

export const enum ProductivityEffect {
  Idle = 'Idle',
  Boosted = 'Boosted',
  Penalized = 'Penalized',
  Neutral = 'Working',
}
