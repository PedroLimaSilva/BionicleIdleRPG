import type { EnemyEncounter } from '../types/Combat';
import type { KranaCollection } from '../types/Krana';
import { isKranaCollected, parseKranaDropId } from './Krana';

/** Returns true if every krana in the encounter's loot table is already collected. */
export function areAllEncounterKranaCollected(
  encounter: EnemyEncounter,
  collectedKrana: KranaCollection
): boolean {
  for (const drop of encounter.loot) {
    const parsed = parseKranaDropId(drop.id);
    if (parsed && !isKranaCollected(collectedKrana, parsed.element, parsed.kranaId)) {
      return false;
    }
  }
  return true;
}

/** Returns true if the encounter has at least one krana in its loot (for filtering). */
function hasKranaLoot(encounter: EnemyEncounter): boolean {
  return encounter.loot.some((d) => parseKranaDropId(d.id) !== null);
}

/**
 * Filters encounters for the battle selector.
 * - Only shows the lowest-difficulty encounter per headliner that still has uncollected krana.
 * - If all krana for a headliner are collected across all tiers, none are shown.
 * - Respects unlockedAfter quest requirements.
 */
export function getVisibleEncounters(
  encounters: EnemyEncounter[],
  collectedKrana: KranaCollection,
  completedQuests: string[]
): EnemyEncounter[] {
  const byHeadliner = new Map<string, EnemyEncounter[]>();
  for (const e of encounters) {
    const list = byHeadliner.get(e.headliner) ?? [];
    list.push(e);
    byHeadliner.set(e.headliner, list);
  }

  const visible: EnemyEncounter[] = [];
  for (const list of byHeadliner.values()) {
    const sorted = [...list].sort((a, b) => a.difficulty - b.difficulty);
    // Show lowest-difficulty encounter that has uncollected krana, or has no krana (e.g. Bohrok Kal)
    const firstToShow = sorted.find(
      (e) =>
        !hasKranaLoot(e) ||
        !areAllEncounterKranaCollected(e, collectedKrana)
    );
    if (firstToShow) {
      visible.push(firstToShow);
    }
  }

  return visible.filter(
    (e) => !e.unlockedAfter || e.unlockedAfter.every((id) => completedQuests.includes(id))
  );
}
