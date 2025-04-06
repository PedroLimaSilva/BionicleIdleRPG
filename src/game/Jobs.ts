import { JOB_DETAILS } from '../data/jobs';
import { GameState } from '../providers/Game';
import { JobAssignment, MatoranJob, ProductivityEffect } from '../types/Jobs';
import { RecruitedMatoran } from '../types/Matoran';
import { ActivityLogEntry, LogType } from '../types/Logging';

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

export function getJobStatus(
  matoran: RecruitedMatoran,
): ProductivityEffect {
  if (!matoran.assignment?.job) return ProductivityEffect.Idle;

  const affinity = JOB_DETAILS[matoran.assignment.job].elementAffinity;
  if (affinity.favored.includes(matoran.element))
    return ProductivityEffect.Boosted;
  if (affinity.opposed.includes(matoran.element))
    return ProductivityEffect.Penalized;

  return ProductivityEffect.Neutral;
}

export function getProductivityModifier(
  job: MatoranJob,
  matoran: RecruitedMatoran
): number {
  const { elementAffinity } = JOB_DETAILS[job];

  if (elementAffinity.favored.includes(matoran.element)) {
    return 1.2; // +20% productivity
  } else if (elementAffinity.opposed.includes(matoran.element)) {
    return 0.8; // -20% productivity
  } else {
    return 1.0; // neutral
  }
}

function computeEarnedExp(assignment: JobAssignment, now = Date.now()): number {
  const elapsedSeconds = Math.max(0, (now - assignment.assignedAt) / 1000);
  return Math.floor(elapsedSeconds * assignment.expRatePerSecond);
}

export function applyOfflineJobExp(
  characters: RecruitedMatoran[]
): [RecruitedMatoran[], ActivityLogEntry[]] {
  const now = Date.now();
  const logs: ActivityLogEntry[] = [];

  const updated = characters.map((m) => {
    const [updatedMatoran, earned] = applyJobExp(m, now);
    if (earned > 0) {
      logs.push({
        id: crypto.randomUUID(),
        message: `${m.name} gained ${earned} EXP while you were away.`,
        type: LogType.Gain,
        timestamp: now,
      });
    }
    return updatedMatoran;
  });
  console.log('applyOfflineJobs', JSON.stringify(logs));
  return [updated, logs];
}

export function applyJobExp(
  matoran: RecruitedMatoran,
  now = Date.now()
): [RecruitedMatoran, number] {
  if (!matoran.assignment) return [matoran, 0];

  const earnedExp = computeEarnedExp(matoran.assignment);

  return [
    {
      ...matoran,
      exp: matoran.exp + earnedExp,
      assignment: {
        ...matoran.assignment,
        assignedAt: now, // reset timer
      },
    },
    earnedExp,
  ];
}
