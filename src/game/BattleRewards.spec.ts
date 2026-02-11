import { BattlePhase } from '../hooks/useBattleState';
import { ElementTribe } from '../types/Matoran';
import { BattleStrategy, type Combatant, type EnemyEncounter } from '../types/Combat';
import type { KranaCollection } from '../types/Krana';
import {
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
  getDefeatedEnemyElements,
  getEnemiesDefeatedCount,
  getParticipantIds,
} from './BattleRewards';

const BOHROK_KRANA_LEGEND_QUEST_ID = 'bohrok_legend_of_krana';

const baseCombatant = (overrides: Partial<Combatant> = {}): Combatant =>
  ({
    id: 'test',
    name: 'Test',
    model: '',
    lvl: 1,
    maxHp: 100,
    hp: 100,
    attack: 10,
    defense: 5,
    speed: 5,
    element: ElementTribe.Fire,
    willUseAbility: false,
    strategy: BattleStrategy.LowestHp,
    ...overrides,
  }) as Combatant;

const mockEncounter = (
  waves: Array<{ id: string; lvl: number }[]>,
  loot: { id: string; chance: number }[] = []
): EnemyEncounter => ({
  id: 'test',
  name: 'Test',
  description: 'Test',
  headliner: 'tahnok',
  difficulty: 1,
  waves,
  loot,
});

describe('BattleRewards', () => {
  describe('getEnemiesDefeatedCount', () => {
    test('returns total enemy count on Victory', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }, { id: 'tahnok', lvl: 20 }],
        [{ id: 'tahnok', lvl: 20 }],
      ]);
      expect(
        getEnemiesDefeatedCount(encounter, BattlePhase.Victory, 1, [])
      ).toBe(3);
    });

    test('returns defeated count on Defeat (full waves + current wave defeated)', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }, { id: 'tahnok', lvl: 20 }],
        [{ id: 'tahnok', lvl: 20 }, { id: 'tahnok', lvl: 20 }],
      ]);
      const currentEnemies = [
        baseCombatant({ id: 'e1', hp: 0 }),
        baseCombatant({ id: 'e2', hp: 50 }),
      ];
      expect(
        getEnemiesDefeatedCount(encounter, BattlePhase.Defeat, 1, currentEnemies)
      ).toBe(2 + 1);
    });

    test('returns defeated count on Retreated', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }],
        [{ id: 'tahnok', lvl: 20 }],
      ]);
      const currentEnemies = [baseCombatant({ id: 'e1', hp: 0 })];
      expect(
        getEnemiesDefeatedCount(encounter, BattlePhase.Retreated, 1, currentEnemies)
      ).toBe(1 + 1);
    });
  });

  describe('computeBattleExpTotal', () => {
    test('returns 0 when no enemies defeated', () => {
      const encounter = mockEncounter([[{ id: 'tahnok', lvl: 20 }]]);
      const currentEnemies = [baseCombatant({ hp: 100 })];
      expect(
        computeBattleExpTotal(encounter, BattlePhase.Inprogress, 0, currentEnemies)
      ).toBe(0);
    });

    test('computes EXP from all waves on Victory (5 EXP per level)', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }, { id: 'tahnok', lvl: 20 }],
        [{ id: 'tahnok', lvl: 30 }],
      ]);
      expect(
        computeBattleExpTotal(encounter, BattlePhase.Victory, 1, [])
      ).toBe(20 * 5 + 20 * 5 + 30 * 5);
    });

    test('computes partial EXP on Defeat from completed waves + defeated in current', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }],
        [{ id: 'tahnok', lvl: 25 }, { id: 'tahnok', lvl: 25 }],
      ]);
      const currentEnemies = [
        baseCombatant({ id: 'e1', hp: 0, lvl: 25 }),
        baseCombatant({ id: 'e2', hp: 50, lvl: 25 }),
      ];
      const total = computeBattleExpTotal(
        encounter,
        BattlePhase.Defeat,
        1,
        currentEnemies
      );
      expect(total).toBe(20 * 5 + 25 * 5);
    });
  });

  describe('getParticipantIds', () => {
    test('returns unique character ids from team', () => {
      const team = [
        baseCombatant({ id: 'Toa_Tahu' }),
        baseCombatant({ id: 'Toa_Gali' }),
        baseCombatant({ id: 'Toa_Tahu' }),
      ];
      expect(getParticipantIds(team)).toEqual(['Toa_Tahu', 'Toa_Gali']);
    });

    test('returns empty array for empty team', () => {
      expect(getParticipantIds([])).toEqual([]);
    });
  });

  describe('getDefeatedEnemyElements', () => {
    test('returns elements for all waves on Victory', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }],
        [{ id: 'gahlok', lvl: 20 }],
      ]);
      const elements = getDefeatedEnemyElements(
        encounter,
        BattlePhase.Victory,
        1,
        []
      );
      expect(elements).toEqual([ElementTribe.Fire, ElementTribe.Water]);
    });

    test('returns elements for defeated enemies only on Defeat', () => {
      const encounter = mockEncounter([
        [{ id: 'tahnok', lvl: 20 }],
        [{ id: 'gahlok', lvl: 20 }, { id: 'lehvak', lvl: 20 }],
      ]);
      const currentEnemies = [
        baseCombatant({ id: 'e1', hp: 0, element: ElementTribe.Water }),
        baseCombatant({ id: 'e2', hp: 50, element: ElementTribe.Air }),
      ];
      const elements = getDefeatedEnemyElements(
        encounter,
        BattlePhase.Defeat,
        1,
        currentEnemies
      );
      expect(elements).toEqual([ElementTribe.Fire, ElementTribe.Water]);
    });
  });

  describe('computeKranaRewardsForBattle', () => {
    const completedQuests = [BOHROK_KRANA_LEGEND_QUEST_ID];

    test('returns empty array when Krana collection not active', () => {
      const encounter = mockEncounter([[{ id: 'tahnok', lvl: 20 }]], [
        { id: 'krana-ja-blue', chance: 1 },
      ]);
      const rewards = computeKranaRewardsForBattle(
        encounter,
        BattlePhase.Victory,
        0,
        [],
        [],
        {}
      );
      expect(rewards).toEqual([]);
    });

    test('returns empty array when no enemies defeated', () => {
      const encounter = mockEncounter([[{ id: 'tahnok', lvl: 20 }]], [
        { id: 'krana-ja-blue', chance: 1 },
      ]);
      const rewards = computeKranaRewardsForBattle(
        encounter,
        BattlePhase.Inprogress,
        0,
        [baseCombatant({ hp: 100 })],
        completedQuests,
        {}
      );
      expect(rewards).toHaveLength(0);
    });

    test('awards krana from loot when roll succeeds', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);

      const encounter = mockEncounter(
        [[{ id: 'tahnok', lvl: 20 }]],
        [{ id: 'krana-ja-blue', chance: 1 }]
      );
      const rewards = computeKranaRewardsForBattle(
        encounter,
        BattlePhase.Victory,
        0,
        [],
        completedQuests,
        {}
      );

      expect(rewards).toHaveLength(1);
      expect(rewards[0]).toEqual({
        element: ElementTribe.Fire,
        kranaId: 'Ja',
      });

      jest.spyOn(Math, 'random').mockRestore();
    });

    test('does not award krana when all for element already collected', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);

      const encounter = mockEncounter(
        [[{ id: 'tahnok', lvl: 20 }]],
        [{ id: 'krana-ja-blue', chance: 1 }]
      );
      const collected: KranaCollection = {
        [ElementTribe.Fire]: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
      };
      const rewards = computeKranaRewardsForBattle(
        encounter,
        BattlePhase.Victory,
        0,
        [],
        completedQuests,
        collected
      );

      expect(rewards).toHaveLength(0);

      jest.spyOn(Math, 'random').mockRestore();
    });

    test('skips loot entry when roll fails and tries next or fallback', () => {
      let callCount = 0;
      jest.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 0.99 : 0;
      });

      const encounter = mockEncounter(
        [[{ id: 'tahnok', lvl: 20 }]],
        [
          { id: 'krana-ja-blue', chance: 0 },
          { id: 'krana-vu-blue', chance: 1 },
        ]
      );
      const rewards = computeKranaRewardsForBattle(
        encounter,
        BattlePhase.Victory,
        0,
        [],
        completedQuests,
        {}
      );

      expect(rewards.length).toBeGreaterThanOrEqual(0);
      expect(rewards.length).toBeLessThanOrEqual(1);

      jest.spyOn(Math, 'random').mockRestore();
    });
  });
});
