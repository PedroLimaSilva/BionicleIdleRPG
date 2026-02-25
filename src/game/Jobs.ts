import { JOB_DETAILS } from '../data/jobs';
import { JobAssignment, MatoranJob, ProductivityEffect } from '../types/Jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { ActivityLogEntry, LogType } from '../types/Logging';
import { GameItemId, ITEM_DICTIONARY } from '../data/loot';
import { GameState } from '../types/GameState';
import { Inventory } from '../services/inventoryUtils';
import { MATORAN_DEX } from '../data/matoran';

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
    const matoranDex = MATORAN_DEX[matoran.id];
    if (!matoranDex) {
      return jobs.filter((job) => !JOB_DETAILS[job].allowedStages);
    }
    jobs = jobs.filter((job) => {
      const { allowedStages } = JOB_DETAILS[job];
      if (!allowedStages) return true;
      return allowedStages.includes(matoranDex.stage);
    });
  }

  return jobs;
}

export function getJobStatus(matoran: RecruitedCharacterData): ProductivityEffect {
  if (!matoran.assignment?.job) return ProductivityEffect.Idle;

  const matoran_dex = MATORAN_DEX[matoran.id];

  const affinity = JOB_DETAILS[matoran.assignment.job].elementAffinity;
  if (affinity.favored.includes(matoran_dex.element)) return ProductivityEffect.Boosted;
  if (affinity.opposed.includes(matoran_dex.element)) return ProductivityEffect.Penalized;

  return ProductivityEffect.Neutral;
}

export function getProductivityModifier(job: MatoranJob, matoran: RecruitedCharacterData): number {
  const { elementAffinity } = JOB_DETAILS[job];

  const matoran_dex = MATORAN_DEX[matoran.id];

  if (elementAffinity.favored.includes(matoran_dex.element)) {
    return 1.2; // +20% productivity
  } else if (elementAffinity.opposed.includes(matoran_dex.element)) {
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

function approximateBinomial(trials: number, probability: number): number {
  // Very low chance or high trials — use Poisson
  if (trials * probability < 30) {
    const lambda = trials * probability;
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    while (p > L) {
      k++;
      p *= Math.random();
    }
    return k - 1;
  }

  // Otherwise: use Normal approximation
  const mean = trials * probability;
  const stddev = Math.sqrt(trials * probability * (1 - probability));
  const gaussian = Math.round(mean + stddev * (Math.random() * 2 - 1));
  return Math.max(0, gaussian);
}

function rollJobRewards(
  assignment: JobAssignment,
  now = Date.now(),
  effectiveElapsedSeconds?: number
): Inventory {
  const elapsedSeconds =
    effectiveElapsedSeconds !== undefined
      ? effectiveElapsedSeconds
      : Math.max(0, (now - assignment.assignedAt) / 1000);
  const job = JOB_DETAILS[assignment.job];
  const drops: Inventory = {};

  if (!job.rewards) return drops;

  for (const reward of job.rewards) {
    const count = approximateBinomial(Math.floor(elapsedSeconds), reward.chance);
    if (count > 0) {
      drops[reward.item] = count;
    }
  }

  return drops;
}

export function applyOfflineJobExp(
  characters: RecruitedCharacterData[],
  now = Date.now()
): [RecruitedCharacterData[], ActivityLogEntry[], number, Inventory] {
  const logs: ActivityLogEntry[] = [];
  let currencyGain = 0;
  const loot: Inventory = {};

  const updated = characters.map((m) => {
    const [updatedMatoran, earned, rewards] = applyJobExp(m, now, true);
    const matoran = MATORAN_DEX[updatedMatoran.id];

    Object.entries(rewards).forEach(([item, amount]) => {
      const itemId = item as GameItemId;
      loot[itemId] = (loot[itemId] ?? 0) + amount;
      logs.push({
        id: crypto.randomUUID(),
        message: `${matoran.name} found ${amount} ${ITEM_DICTIONARY[itemId].name} while you were away.`,
        type: LogType.Loot,
        timestamp: now,
      });
    });

    if (earned > 0) {
      currencyGain += earned;
      logs.push({
        id: crypto.randomUUID(),
        message: `${matoran.name} gained ${earned} EXP while you were away.`,
        type: LogType.Gain,
        timestamp: now,
      });
    }

    return updatedMatoran;
  });

  return [updated, logs, currencyGain, loot];
}

export function applyJobExp(
  matoran: RecruitedCharacterData,
  now = Date.now(),
  applyDiminishingReturns = false
): [RecruitedCharacterData, number, Inventory] {
  if (!matoran.assignment) return [matoran, 0, {}];

  const rawElapsedMs = Math.max(0, now - matoran.assignment.assignedAt);
  const effectiveElapsedSeconds =
    applyDiminishingReturns
      ? getEffectiveElapsedMs(rawElapsedMs) / 1000
      : undefined;

  const earnedExp = computeEarnedExp(matoran.assignment, now, effectiveElapsedSeconds);
  const rewards = rollJobRewards(matoran.assignment, now, effectiveElapsedSeconds);

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
    rewards,
  ];
}
