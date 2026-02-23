import { ElementTribe } from '../types/Matoran';
import type { EnemyEncounter } from '../types/Combat';
import type { KranaCollection } from '../types/Krana';
import { areAllEncounterKranaCollected, getVisibleEncounters } from './encounterVisibility';

const mockEncounter = (
  id: string,
  headliner: string,
  difficulty: number,
  loot: { id: string; chance: number }[],
  unlockedAfter?: string[]
): EnemyEncounter => ({
  id,
  name: `Encounter ${id}`,
  description: 'Test',
  headliner: headliner as EnemyEncounter['headliner'],
  difficulty,
  waves: [[{ id: headliner, lvl: 20 }]],
  loot,
  ...(unlockedAfter && { unlockedAfter }),
});

describe('encounterVisibility', () => {
  describe('areAllEncounterKranaCollected', () => {
    test('returns true when all loot krana are collected', () => {
      const encounter = mockEncounter('tahnok-1', 'tahnok', 1, [
        { id: 'krana-xa-blue', chance: 0.15 },
        { id: 'krana-bo-blue', chance: 0.1 },
      ]);
      const collected: KranaCollection = {
        [ElementTribe.Fire]: ['Xa', 'Bo'],
      };
      expect(areAllEncounterKranaCollected(encounter, collected)).toBe(true);
    });

    test('returns false when any loot krana is not collected', () => {
      const encounter = mockEncounter('tahnok-1', 'tahnok', 1, [
        { id: 'krana-xa-blue', chance: 0.15 },
        { id: 'krana-bo-blue', chance: 0.1 },
      ]);
      const collected: KranaCollection = {
        [ElementTribe.Fire]: ['Xa'],
      };
      expect(areAllEncounterKranaCollected(encounter, collected)).toBe(false);
    });

    test('returns true when loot is empty', () => {
      const encounter = mockEncounter('empty', 'tahnok', 1, []);
      expect(areAllEncounterKranaCollected(encounter, {})).toBe(true);
    });

    test('returns true when loot has non-krana items (parseKranaDropId returns null)', () => {
      const encounter = mockEncounter('mixed', 'tahnok', 1, [
        { id: 'krana-ja-blue', chance: 0.15 },
        { id: 'charcoal', chance: 0.5 },
      ]);
      const collected: KranaCollection = { [ElementTribe.Fire]: ['Ja'] };
      expect(areAllEncounterKranaCollected(encounter, collected)).toBe(true);
    });
  });

  describe('getVisibleEncounters', () => {
    test('returns lowest-difficulty encounter per headliner with uncollected krana', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('tahnok-1', 'tahnok', 1, [
          { id: 'krana-xa-blue', chance: 0.15 },
          { id: 'krana-bo-blue', chance: 0.1 },
        ]),
        mockEncounter('tahnok-2', 'tahnok', 2, [
          { id: 'krana-su-blue', chance: 0.15 },
          { id: 'krana-za-blue', chance: 0.1 },
        ]),
        mockEncounter('gahlok-1', 'gahlok', 1, [
          { id: 'krana-xa-orange', chance: 0.15 },
        ]),
      ];
      const collected = {};
      const completed = ['bohrok_legend_of_krana'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(2);
      expect(visible.map((e) => e.id)).toContain('tahnok-1');
      expect(visible.map((e) => e.id)).toContain('gahlok-1');
      expect(visible.map((e) => e.id)).not.toContain('tahnok-2');
    });

    test('shows next tier when all krana from lower tier collected', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('tahnok-1', 'tahnok', 1, [
          { id: 'krana-xa-blue', chance: 0.15 },
          { id: 'krana-bo-blue', chance: 0.1 },
        ]),
        mockEncounter('tahnok-2', 'tahnok', 2, [
          { id: 'krana-su-blue', chance: 0.15 },
          { id: 'krana-za-blue', chance: 0.1 },
        ]),
      ];
      const collected: KranaCollection = { [ElementTribe.Fire]: ['Xa', 'Bo'] };
      const completed = ['bohrok_legend_of_krana'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('tahnok-2');
    });

    test('excludes headliner entirely when all krana collected across tiers', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('tahnok-1', 'tahnok', 1, [
          { id: 'krana-xa-blue', chance: 0.15 },
          { id: 'krana-bo-blue', chance: 0.1 },
        ]),
        mockEncounter('tahnok-2', 'tahnok', 2, [
          { id: 'krana-su-blue', chance: 0.15 },
          { id: 'krana-za-blue', chance: 0.1 },
        ]),
      ];
      const collected: KranaCollection = {
        [ElementTribe.Fire]: ['Xa', 'Bo', 'Su', 'Za'],
      };
      const completed = ['bohrok_legend_of_krana'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(0);
    });

    test('respects unlockedAfter quest requirement', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('locked', 'tahnok', 1, [{ id: 'krana-xa-blue', chance: 0.15 }], [
          'some_other_quest',
        ]),
      ];
      const collected = {};
      const completed = ['bohrok_legend_of_krana'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(0);
    });

    test('includes encounter when unlockedAfter quests are completed', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('unlocked', 'tahnok', 1, [{ id: 'krana-xa-blue', chance: 0.15 }], [
          'bohrok_legend_of_krana',
        ]),
      ];
      const collected = {};
      const completed = ['bohrok_legend_of_krana'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('unlocked');
    });

    test('shows encounters with no krana loot (e.g. Bohrok Kal)', () => {
      const encounters: EnemyEncounter[] = [
        mockEncounter('tahnok_kal-1', 'tahnok_kal', 5, [], ['bohrok_kal_stolen_symbols']),
      ];
      const collected = {};
      const completed = ['bohrok_kal_stolen_symbols'];

      const visible = getVisibleEncounters(encounters, collected, completed);
      expect(visible).toHaveLength(1);
      expect(visible[0].id).toBe('tahnok_kal-1');
    });
  });
});
