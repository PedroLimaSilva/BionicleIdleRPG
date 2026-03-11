import { JOB_DETAILS } from '../data/jobs';
import { JobAssignment, MatoranJob, ProductivityEffect } from '../types/Jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { GameState } from '../types/GameState';
import { CHARACTER_DEX } from '../data/dex/index';
import { isBohrokOrKal } from './matoranStage';

export function isJobUnlocked(job: MatoranJob, gameState: GameState): boolean {
  const jobData = JOB_DETAILS[job];
  const { requiredProgress } = jobData.unlock;

  const progressMet =
    !requiredProgress ||
    requiredProgress.reduce(
      (acc: boolean, quest) => acc && gameState.completedQuests.includes(quest),
      true
    );

  return progressMet;
}

export function getAvailableJobs(
  gameState: GameState,
  matoran?: RecruitedCharacterData
): MatoranJob[] {
  let jobs = Object.keys(JOB_DETAILS)
    .filter((key): key is MatoranJob => key in MatoranJob)
    .filter((job) => isJobUnlocked(job, gameState));

  if (matoran) {
    const matoranDex = CHARACTER_DEX[matoran.id];
    if (!matoranDex) {
      return jobs.filter((job) => !JOB_DETAILS[job].allowedStages);
    }
    const effectiveMatoran = {
      ...matoranDex,
      stage: matoran.stage ?? matoranDex.stage,
    };

    jobs = jobs.filter((job) => {
      const { allowedStages } = JOB_DETAILS[job];
      if (isBohrokOrKal(effectiveMatoran)) {
        // Bohrok only have access to reconstruction jobs (jobs with allowedStages for Bohrok)
        return allowedStages?.includes(effectiveMatoran.stage) ?? false;
      }
      if (!allowedStages) return true;
      return allowedStages.includes(effectiveMatoran.stage);
    });
  }

  return jobs;
}

export function getJobStatus(matoran: RecruitedCharacterData): ProductivityEffect {
  if (!matoran.assignment?.job) return ProductivityEffect.Idle;

  const characterDex = CHARACTER_DEX[matoran.id];

  const affinity = JOB_DETAILS[matoran.assignment.job].elementAffinity;
  if (affinity.favored.includes(characterDex.element)) return ProductivityEffect.Boosted;
  if (affinity.opposed.includes(characterDex.element)) return ProductivityEffect.Penalized;

  return ProductivityEffect.Neutral;
}

export function getProductivityModifier(job: MatoranJob, matoran: RecruitedCharacterData): number {
  const { elementAffinity } = JOB_DETAILS[job];

  const characterDex = CHARACTER_DEX[matoran.id];

  if (elementAffinity.favored.includes(characterDex.element)) {
    return 1.2; // +20% productivity
  } else if (elementAffinity.opposed.includes(characterDex.element)) {
    return 0.8; // -20% productivity
  } else {
    return 1.0; // neutral
  }
}

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const EIGHTEEN_HOURS_MS = 18 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

/**
 * Applies diminishing returns for offline job rewards:
 * - 0-12h: full rewards (1.0x)
 * - 12-18h: half rewards (0.5x)
 * - 18-24h: quarter rewards (0.25x)
 * - Beyond 24h: no additional rewards
 */
function getEffectiveElapsedMs(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const capped = Math.min(elapsedMs, TWENTY_FOUR_HOURS_MS);

  let effective = 0;
  // 0-12h: full
  effective += Math.min(TWELVE_HOURS_MS, capped) * 1.0;
  // 12-18h: half
  effective += Math.min(6 * 60 * 60 * 1000, Math.max(0, capped - TWELVE_HOURS_MS)) * 0.5;
  // 18-24h: quarter
  effective += Math.min(6 * 60 * 60 * 1000, Math.max(0, capped - EIGHTEEN_HOURS_MS)) * 0.25;

  return effective;
}

function computeEarnedExp(
  assignment: JobAssignment,
  now = Date.now(),
  effectiveElapsedSeconds?: number
): number {
  const elapsedSeconds =
    effectiveElapsedSeconds !== undefined
      ? effectiveElapsedSeconds
      : Math.max(0, (now - assignment.assignedAt) / 1000);
  return Math.floor(elapsedSeconds * assignment.expRatePerSecond);
}

export function applyOfflineJobExp(
  characters: RecruitedCharacterData[],
  now = Date.now()
): [RecruitedCharacterData[], number] {
  let currencyGain = 0;

  const updated = characters.map((m) => {
    const [updatedMatoran, earned] = applyJobExp(m, now, true);

    if (earned > 0) {
      currencyGain += earned;
    }

    return updatedMatoran;
  });

  return [updated, currencyGain];
}

export function applyJobExp(
  matoran: RecruitedCharacterData,
  now = Date.now(),
  applyDiminishingReturns = false
): [RecruitedCharacterData, number] {
  if (!matoran.assignment) return [matoran, 0];

  const rawElapsedMs = Math.max(0, now - matoran.assignment.assignedAt);
  const effectiveElapsedSeconds = applyDiminishingReturns
    ? getEffectiveElapsedMs(rawElapsedMs) / 1000
    : undefined;

  const earnedExp = computeEarnedExp(matoran.assignment, now, effectiveElapsedSeconds);

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
