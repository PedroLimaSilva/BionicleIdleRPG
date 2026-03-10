import { Combatant, EnemyEncounter } from '../types/Combat';
import { BattlePhase } from '../hooks/useBattleState';
import { ElementTribe } from '../types/Matoran';
import { COMBATANT_DEX } from '../data/combat';
import type { KranaReward } from '../types/GameState';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';
import { GameItemId } from '../data/loot';
import { isKranaLootId } from './Krana';
import {
  isKranaCollected,
  isKranaCollectionActive,
  isKranaElement,
  parseKranaDropId,
} from './Krana';

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

/** Get krana loot entries from encounter that match the given element. */
function getKranaLootForElement(
  encounter: EnemyEncounter,
  element: ElementTribe
): { element: KranaElement; kranaId: KranaId; chance: number }[] {
  const result: { element: KranaElement; kranaId: KranaId; chance: number }[] = [];
  for (const drop of encounter.loot) {
    const parsed = parseKranaDropId(drop.id);
    if (parsed && parsed.element === element) {
      result.push({ element: parsed.element, kranaId: parsed.kranaId, chance: drop.chance });
    }
  }
  return result;
}

/**
 * Compute which Krana would be awarded for this battle (one roll per defeated enemy).
 * Uses the encounter's loot table when available
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
  const awardedThisBattle = new Set<string>();
  for (const element of elements) {
    if (!isKranaElement(element)) continue;
    const kranaLoot = getKranaLootForElement(encounter, element);
    let awarded: KranaReward | null = null;
    if (kranaLoot.length > 0) {
      for (const { element: el, kranaId, chance } of kranaLoot) {
        const key = `${el}:${kranaId}`;
        if (
          !isKranaCollected(collectedKrana, el, kranaId) &&
          !awardedThisBattle.has(key) &&
          Math.random() < chance
        ) {
          awarded = { element: el, kranaId };
          awardedThisBattle.add(key);
          break;
        }
      }
    }
    if (awarded) rewards.push(awarded);
  }
  return rewards;
}

export type ItemReward = { id: GameItemId; qty: number };

/**
 * Non-Krana loot entries (e.g. kraata) from an encounter. Used for "one per kill, equal chance" resolution.
 */
function getKraataLootTable(encounter: EnemyEncounter): { id: string }[] {
  return encounter.loot.filter((d) => !isKranaLootId(d.id)).map((d) => ({ id: d.id }));
}

/**
 * Rolls for non-Krana item drops (e.g. kraata) from an encounter's loot table.
 *
 * Kraata (Rahkshi): one roll per defeated enemy (Victory, Defeat, or Retreat). Each kill guarantees
 * exactly one kraata; which one is chosen with equal probability (roll in [0,1) → index = floor(roll * table.length)).
 *
 * Other item drops: only on Victory, one roll per loot entry (unchanged).
 */
export function computeItemRewardsForBattle(
  encounter: EnemyEncounter,
  phase: BattlePhase,
  currentWave: number,
  currentEnemies: Combatant[]
): ItemReward[] {
  const kraataTable = getKraataLootTable(encounter);

  if (kraataTable.length > 0) {
    const defeatedCount = getEnemiesDefeatedCount(encounter, phase, currentWave, currentEnemies);
    const rewards: ItemReward[] = [];
    for (let i = 0; i < defeatedCount; i++) {
      const roll = Math.random();
      const index = Math.floor(roll * kraataTable.length);
      const id = kraataTable[index].id as GameItemId;
      const existing = rewards.find((r) => r.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        rewards.push({ id, qty: 1 });
      }
    }
    return rewards;
  }

  if (phase !== BattlePhase.Victory) return [];

  const rewards: ItemReward[] = [];
  for (const drop of encounter.loot) {
    if (isKranaLootId(drop.id)) continue;
    if (Math.random() < drop.chance) {
      const existing = rewards.find((r) => r.id === drop.id);
      if (existing) {
        existing.qty += 1;
      } else {
        rewards.push({ id: drop.id as GameItemId, qty: 1 });
      }
    }
  }
  return rewards;
}
