import { JobAssignment, MatoranJob } from '../types/Jobs';
import { RecruitedMatoran } from '../types/Matoran';

export const jobExpRates: Record<MatoranJob, number> = {
  [MatoranJob.Miner]: 1,
  [MatoranJob.Forager]: 0.8,
  [MatoranJob.Engineer]: 0.6,
  [MatoranJob.Guard]: 1.2,
  [MatoranJob.Healer]: 0.7,
};

function computeEarnedExp(job: JobAssignment, now = Date.now()): number {
  const durationSec = (now - job.assignedAt) / 1000;
  return Math.floor(durationSec * job.expRatePerSecond);
}

export function applyJobExp(
  matoran: RecruitedMatoran,
  now = Date.now()
): RecruitedMatoran {
  if (!matoran.assignment) return matoran;

  const earned = computeEarnedExp(matoran.assignment, now);

  return {
    ...matoran,
    exp: matoran.exp + earned,
    assignment: {
      ...matoran.assignment,
      assignedAt: now, // reset timestamp
    },
  };
}

export function assignJob(matoran: RecruitedMatoran, job: MatoranJob): RecruitedMatoran {
  return {
    ...matoran,
    assignment: {
      job,
      expRatePerSecond: jobExpRates[job],
      assignedAt: Date.now(),
    },
  };
}