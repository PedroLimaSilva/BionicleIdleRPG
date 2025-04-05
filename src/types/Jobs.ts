export enum MatoranJob {
  Miner = 'Miner',
  Forager = 'Forager',
  Engineer = 'Engineer',
  Guard = 'Guard',
  Healer = 'Healer',
}

export type JobAssignment = {
  job: MatoranJob;
  expRatePerSecond: number;
  assignedAt: number; // timestamp (ms)
};
