import { COMBATANT_DEX } from '../../data/combat';
import type { ArenaId } from '../../types/Arena';
import type { EnemyEncounter } from '../../types/Combat';
import { ElementTribe } from '../../types/Matoran';

/** Arena used when an encounter does not declare one. */
export const DEFAULT_ENCOUNTER_ARENA: ArenaId = 'desert';

/** Resolve which battle arena an encounter is fought in. */
export function getEncounterArenaId(encounter: EnemyEncounter | undefined): ArenaId {
  return encounter?.arenaId ?? DEFAULT_ENCOUNTER_ARENA;
}

/**
 * Element tribe of an encounter's headliner, used to recolor recolorable arenas
 * (e.g. the desert) to reflect the tribe being fought. Returns `undefined` when
 * the headliner is not an elemental combatant (e.g. a Rahkshi kraata power).
 */
export function getEncounterTribe(encounter: EnemyEncounter | undefined): ElementTribe | undefined {
  if (!encounter) return undefined;
  return COMBATANT_DEX[encounter.headliner]?.element;
}
