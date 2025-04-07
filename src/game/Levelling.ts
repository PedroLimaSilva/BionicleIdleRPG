function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5)); // level 1 = 0 exp
}

export function getLevelFromExp(totalExp: number): number {
  let level = 1;
  while (totalExp >= expForLevel(level + 1)) {
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
  const expCurrent = expForLevel(level);
  const expForNextLevel = expForLevel(level + 1) - expCurrent;
  const progress = (totalExp - expCurrent) / expForNextLevel;
  return {
    level,
    currentLevelExp: totalExp - expCurrent,
    expForNextLevel,
    progress,
  };
}
