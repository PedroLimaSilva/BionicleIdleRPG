import { JobAssignment, MatoranJob } from '../types/Jobs';
import { RecruitedMatoran } from '../types/Matoran';

export const jobExpRates: Record<MatoranJob, number> = {
  [MatoranJob.Miner]: 1,
  [MatoranJob.Forager]: 0.8,
  [MatoranJob.Engineer]: 0.6,
  [MatoranJob.Guard]: 1.2,
  [MatoranJob.Healer]: 0.7,
};

function computeEarnedExp(assignment: JobAssignment, now = Date.now()): number {
  const elapsedSeconds = Math.max(0, (now - assignment.assignedAt) / 1000);
  return Math.floor(elapsedSeconds * assignment.expRatePerSecond);
}

export function applyOfflineJobExp(characters: RecruitedMatoran[]): RecruitedMatoran[] {
  const now = Date.now();
  return characters.map((m) => applyJobExp(m, now));
}

export function applyJobExp(
  matoran: RecruitedMatoran,
  now = Date.now()
): RecruitedMatoran {
  if (!matoran.assignment) return matoran;

  const earnedExp = computeEarnedExp(matoran.assignment);

  return {
    ...matoran,
    exp: matoran.exp + earnedExp,
    assignment: {
      ...matoran.assignment,
      assignedAt: now, // reset timer
    },
  };
}

export function assignJob(
  matoran: RecruitedMatoran,
  job: MatoranJob
): RecruitedMatoran {
  return {
    ...matoran,
    assignment: {
      job,
      expRatePerSecond: jobExpRates[job],
      assignedAt: Date.now(),
    },
  };
}
