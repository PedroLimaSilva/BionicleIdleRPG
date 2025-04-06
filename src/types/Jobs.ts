import { StoryProgression } from '../game/story';
import { ElementTribe } from './Matoran';

export enum MatoranJob {
  CharcoalMaker = 'CharcoalMaker',
  ProtodermisSmelter = 'ProtodermisSmelter',
  AlgaeHarvester = 'AlgaeHarvester',
  HydroTechnician = 'HydroTechnician',
  RahiNestWatcher = 'RahiNestWatcher',
  ChuteController = 'ChuteController',
  QuarryRunner = 'QuarryRunner',
  SculptureOperator = 'SculptureOperator',
  GlowWormTender = 'GlowWormTender',
  StasisTechnician = 'StasisTechnician',
  IceSculptor = 'IceSculptor',
  KnowledgeScribe = 'KnowledgeScribe',
}

export type JobDetails = {
  label: string;
  description: string;
  rate: number;
  elementAffinity: {
    favored: ElementTribe[];
    opposed: ElementTribe[];
  };
  unlock: {
    requiredProgress?: StoryProgression;
  };
};

export type JobAssignment = {
  job: MatoranJob;
  expRatePerSecond: number;
  assignedAt: number; // timestamp (ms)
};

export const enum ProductivityEffect {
  Idle = 'idle',
  Boosted = 'boosted',
  Penalized = 'penalized',
  Neutral = 'working',
}
