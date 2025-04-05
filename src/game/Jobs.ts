import { JOB_DETAILS } from '../data/jobs';
import { GameState } from '../providers/Game';
import { JobAssignment, MatoranJob } from '../types/Jobs';
import { RecruitedMatoran } from '../types/Matoran';

export function isJobUnlocked(job: MatoranJob, gameState: GameState): boolean {
  const jobData = JOB_DETAILS[job];
  const { requiredProgress } = jobData.unlock;
  
  const progressMet =
    !requiredProgress || gameState.storyProgress.includes(requiredProgress);

  return progressMet;
}

export function getAvailableJobs(gameState: GameState): MatoranJob[] {
  return Object.keys(JOB_DETAILS)
    .filter((key): key is MatoranJob => key in MatoranJob)
    .filter((job) => isJobUnlocked(job, gameState));
}

function computeEarnedExp(assignment: JobAssignment, now = Date.now()): number {
  const elapsedSeconds = Math.max(0, (now - assignment.assignedAt) / 1000);
  return Math.floor(elapsedSeconds * assignment.expRatePerSecond);
}

export function applyOfflineJobExp(
  characters: RecruitedMatoran[]
): RecruitedMatoran[] {
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
