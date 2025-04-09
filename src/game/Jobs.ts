import { JOB_DETAILS } from '../data/jobs';
import { JobAssignment, MatoranJob, ProductivityEffect } from '../types/Jobs';
import { RecruitedMatoran } from '../types/Matoran';
import { ActivityLogEntry, LogType } from '../types/Logging';
import { GameItemId, ITEM_DICTIONARY } from '../data/loot';
import { GameState } from '../types/GameState';
import { Inventory } from '../services/inventoryUtils';

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

export function getJobStatus(matoran: RecruitedMatoran): ProductivityEffect {
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
  now = Date.now()
): Inventory {
  const elapsedSeconds = Math.max(0, (now - assignment.assignedAt) / 1000);
  const unitsOfWork = elapsedSeconds * 0.15;
  const job = JOB_DETAILS[assignment.job];
  const drops: Inventory = {};

  if (!job.rewards) return drops;

  for (const reward of job.rewards) {
    const count = approximateBinomial(Math.floor(unitsOfWork), reward.chance);
    if (count > 0) {
      drops[reward.item] = count;
    }
  }

  return drops;
}

export function applyOfflineJobExp(
  characters: RecruitedMatoran[]
): [RecruitedMatoran[], ActivityLogEntry[], number, Inventory] {
  const now = Date.now();
  const logs: ActivityLogEntry[] = [];
  let currencyGain = 0;
  const loot: Inventory = {};

  const updated = characters.map((m) => {
    const [updatedMatoran, earned, rewards] = applyJobExp(m, now);

    Object.entries(rewards).forEach(([item, amount]) => {
      const itemId = item as GameItemId;
      loot[itemId] = (loot[itemId] ?? 0) + amount;
      logs.push({
        id: crypto.randomUUID(),
        message: `${m.name} found ${amount} ${ITEM_DICTIONARY[itemId].name} while you were away.`,
        type: LogType.Loot,
        timestamp: now,
      });
    });

    if (earned > 0) {
      currencyGain += earned;
      logs.push({
        id: crypto.randomUUID(),
        message: `${m.name} gained ${earned} EXP while you were away.`,
        type: LogType.Gain,
        timestamp: now,
      });
    }

    return updatedMatoran;
  });

  return [updated, logs, currencyGain, loot];
}

export function applyJobExp(
  matoran: RecruitedMatoran,
  now = Date.now()
): [RecruitedMatoran, number, Inventory] {
  if (!matoran.assignment) return [matoran, 0, {}];

  const earnedExp = computeEarnedExp(matoran.assignment);
  const rewards = rollJobRewards(matoran.assignment);

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
