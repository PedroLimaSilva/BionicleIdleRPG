import { Combatant, EnemyEncounter } from '../types/Combat';
import { BattlePhase } from '../hooks/useBattleState';

/** EXP granted per defeated enemy, scaled by enemy level. */
const EXP_PER_LEVEL = 5;

/**
 * Number of enemies defeated so far (for Victory = all in encounter;
 * for Defeat/Retreat = completed waves + defeated in current wave).
 */
export function getEnemiesDefeatedCount(
  encounter: EnemyEncounter,
  phase: BattlePhase,
  currentWave: number,
  currentEnemies: Combatant[]
): number {
  if (phase === BattlePhase.Victory) {
    return encounter.waves.reduce((sum, wave) => sum + wave.length, 0);
  }
  // Defeat or Retreated: full waves cleared + defeated in current wave
  let count = 0;
  for (let w = 0; w < currentWave; w++) {
    count += encounter.waves[w].length;
  }
  count += currentEnemies.filter((e) => e.hp <= 0).length;
  return count;
}

/**
 * Total EXP to split among participants, based on defeated enemies' levels.
 */
export function computeBattleExpTotal(
  encounter: EnemyEncounter,
  phase: BattlePhase,
  currentWave: number,
  currentEnemies: Combatant[]
): number {
  const defeatedCount = getEnemiesDefeatedCount(
    encounter,
    phase,
    currentWave,
    currentEnemies
  );
  if (defeatedCount === 0) return 0;

  if (phase === BattlePhase.Victory) {
    let total = 0;
    for (const wave of encounter.waves) {
      for (const slot of wave) {
        total += slot.lvl * EXP_PER_LEVEL;
      }
    }
    return total;
  }

  let total = 0;
  for (let w = 0; w < currentWave; w++) {
    for (const slot of encounter.waves[w]) {
      total += slot.lvl * EXP_PER_LEVEL;
    }
  }
  for (const e of currentEnemies) {
    if (e.hp <= 0) total += e.lvl * EXP_PER_LEVEL;
  }
  return total;
}

/**
 * Character IDs that participated in battle.
 * Team combatants use character id (e.g. Toa_Tahu) as their combatant id.
 */
export function getParticipantIds(team: Combatant[]): string[] {
  return [...new Set(team.map((t) => t.id))];
}
