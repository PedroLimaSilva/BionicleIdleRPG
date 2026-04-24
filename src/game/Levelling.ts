/** Minimum total experience needed to be at least this level (level 1 is 0). */
export function getTotalExpThresholdForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

export function getLevelFromExp(totalExp: number): number {
  let level = 1;
  while (totalExp >= getTotalExpThresholdForLevel(level + 1)) {
    level++;
  }
  return level;
}

export function getExpProgress(totalExp: number): {
  level: number;
  currentLevelExp: number;
  expForNextLevel: number;
  progress: number; // between 0 and 1
} {
  const level = getLevelFromExp(totalExp);
  const expCurrent = getTotalExpThresholdForLevel(level);
  const expForNextLevel = getTotalExpThresholdForLevel(level + 1) - expCurrent;
  const progress = (totalExp - expCurrent) / expForNextLevel;
  return {
    currentLevelExp: totalExp - expCurrent,
    expForNextLevel,
    level,
    progress,
  };
}
