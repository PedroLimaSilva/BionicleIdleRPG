import { Combatant, EnemyEncounter } from '../types/Combat';
import { BattlePhase } from '../hooks/useBattleState';
import { ElementTribe } from '../types/Matoran';
import { COMBATANT_DEX } from '../data/combat';
import type { KranaElement, KranaId } from '../types/Krana';
import type { KranaReward } from '../types/GameState';
import { KranaCollection } from '../types/Krana';
import { ALL_KRANA_IDS, isKranaCollected, isKranaCollectionActive, KRANA_ELEMENTS } from './Krana';

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
  const defeatedCount = getEnemiesDefeatedCount(encounter, phase, currentWave, currentEnemies);
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

/**
 * Element of each defeated enemy (one per enemy), in order, for Krana rolls.
 * Uses Bohrok element from COMBATANT_DEX for wave slots; current wave uses combatant.element.
 */
export function getDefeatedEnemyElements(
  encounter: EnemyEncounter,
  phase: BattlePhase,
  currentWave: number,
  currentEnemies: Combatant[]
): ElementTribe[] {
  const elements: ElementTribe[] = [];

  if (phase === BattlePhase.Victory) {
    for (const wave of encounter.waves) {
      for (const slot of wave) {
        const template = COMBATANT_DEX[slot.id];
        if (template) elements.push(template.element);
      }
    }
    return elements;
  }

  for (let w = 0; w < currentWave; w++) {
    for (const slot of encounter.waves[w]) {
      const template = COMBATANT_DEX[slot.id];
      if (template) elements.push(template.element);
    }
  }
  for (const e of currentEnemies) {
    if (e.hp <= 0) elements.push(e.element);
  }
  return elements;
}

/**
 * Compute which Krana would be awarded for this battle (one roll per defeated enemy).
 * Used to display on the battle end screen and to apply the same list when collecting.
 */
export function computeKranaRewardsForBattle(
  encounter: EnemyEncounter,
  phase: BattlePhase,
  currentWave: number,
  currentEnemies: Combatant[],
  completedQuests: string[],
  collectedKrana: KranaCollection
): KranaReward[] {
  if (!isKranaCollectionActive(completedQuests)) return [];
  const elements = getDefeatedEnemyElements(encounter, phase, currentWave, currentEnemies);
  const rewards: KranaReward[] = [];
  for (const element of elements) {
    if (!KRANA_ELEMENTS.includes(element)) continue;
    const kranaId = ALL_KRANA_IDS[Math.floor(Math.random() * ALL_KRANA_IDS.length)];
    if (!isKranaCollected(collectedKrana, element, kranaId)) {
      rewards.push({ element, kranaId });
    }
  }
  return rewards;
}
