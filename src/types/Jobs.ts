export enum MatoranJob {
  Miner = 'Miner',
  Forager = 'Forager',
  Engineer = 'Engineer',
  Guard = 'Guard',
  Healer = 'Healer',
}

export const jobDetails: Record<
  MatoranJob,
  { label: string; description: string; rate: number }
> = {
  [MatoranJob.Miner]: {
    label: '⛏️ Miner',
    description: 'Gathers raw protodermis from mines.',
    rate: 1.0,
  },
  [MatoranJob.Forager]: {
    label: '🌿 Forager',
    description: 'Collects natural resources from the wild.',
    rate: 0.8,
  },
  [MatoranJob.Engineer]: {
    label: '🔧 Engineer',
    description: 'Maintains tools and structures.',
    rate: 0.6,
  },
  [MatoranJob.Guard]: {
    label: '🛡️ Guard',
    description: 'Defends the village from threats.',
    rate: 1.2,
  },
  [MatoranJob.Healer]: {
    label: '💊 Healer',
    description: 'Restores the health of allies.',
    rate: 0.7,
  },
};

export type JobAssignment = {
  job: MatoranJob;
  expRatePerSecond: number;
  assignedAt: number; // timestamp (ms)
};
