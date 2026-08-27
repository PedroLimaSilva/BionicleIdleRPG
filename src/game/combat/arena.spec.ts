import { COMBATANT_DEX } from '../../data/combat';
import { DEFAULT_ENCOUNTER_ARENA, getEncounterArenaId, getEncounterTribe } from './arena';
import type { EnemyEncounter } from '../../types/Combat';

const baseEncounter: EnemyEncounter = {
  description: '',
  difficulty: 1,
  headliner: 'tahnok',
  id: 'test',
  loot: [],
  name: 'Test',
  waves: [[]],
};

describe('getEncounterArenaId', () => {
  it('defaults to the desert arena', () => {
    expect(getEncounterArenaId(undefined)).toBe('desert');
    expect(getEncounterArenaId(baseEncounter)).toBe(DEFAULT_ENCOUNTER_ARENA);
  });

  it('uses an explicit arenaId when present', () => {
    expect(getEncounterArenaId({ ...baseEncounter, arenaId: 'mangaia' })).toBe('mangaia');
    expect(getEncounterArenaId({ ...baseEncounter, arenaId: 'metru' })).toBe('metru');
  });
});

describe('getEncounterTribe', () => {
  it('returns the element tribe of the headliner', () => {
    expect(getEncounterTribe(baseEncounter)).toBe(COMBATANT_DEX['tahnok'].element);
    expect(getEncounterTribe(baseEncounter)).toBeDefined();
  });

  it('returns undefined for no encounter or an unknown headliner', () => {
    expect(getEncounterTribe(undefined)).toBeUndefined();
    expect(getEncounterTribe({ ...baseEncounter, headliner: '___missing___' })).toBeUndefined();
  });
});
