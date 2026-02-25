import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { decrementWaveCounters, decrementMaskPowerCounter } from './combatUtils';

describe('Mask Power Cooldowns', () => {
  describe('Wave-based Cooldowns', () => {
    test('decrements wave-based mask power duration when active', () => {
      const combatant: Combatant = {
        id: 'test',
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test mask',
          shortName: Mask.Pakari,
          longName: 'Test Mask',
          target: 'self',
          active: true,
          cooldown: { unit: 'wave', amount: 0 },
          effect: {
            type: 'ATK_MULT',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 3 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('deactivates mask power when duration reaches 0', () => {
      const combatant: Combatant = {
        id: 'Toa_Tahu', // Use a real combatant ID so it can look up the original mask
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test mask',
          shortName: Mask.Hau,
          longName: 'Test Mask',
          target: 'self',
          active: true,
          cooldown: { unit: 'wave', amount: 0 },
          effect: {
            type: 'DMG_MITIGATOR',
            multiplier: 0.5,
            duration: { unit: 'wave', amount: 1 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.active).toBe(false);
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      // Cooldown should be copied from MASK_POWERS when duration expires (Hau has wave cooldown of 1)
      expect(updated.maskPower?.cooldown.amount).toBe(1);
      expect(updated.maskPower?.cooldown.unit).toBe('wave');
    });

    test('decrements cooldown when mask power is inactive', () => {
      const combatant: Combatant = {
        id: 'test',
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test mask',
          shortName: Mask.Pakari,
          longName: 'Test Mask',
          target: 'self',
          active: false,
          cooldown: { unit: 'wave', amount: 3 },
          effect: {
            type: 'ATK_MULT',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 2 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.cooldown.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(false);
    });

    test('does not decrement non-wave counters', () => {
      const combatant: Combatant = {
        id: 'test',
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test mask',
          shortName: Mask.Pakari,
          longName: 'Test Mask',
          target: 'self',
          active: true,
          cooldown: { unit: 'turn', amount: 0 },
          effect: {
            type: 'ATK_MULT',
            multiplier: 1.5,
            duration: { unit: 'turn', amount: 3 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      // Should not change because duration unit is 'turn', not 'wave'
      expect(updated.maskPower?.effect.duration.amount).toBe(3);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('handles multiple combatants', () => {
      const combatants: Combatant[] = [
        {
          id: 'test1',
          name: 'Test1',
          model: '',
          lvl: 1,
          hp: 100,
          maxHp: 100,
          attack: 10,
          defense: 5,
          speed: 5,
          element: ElementTribe.Fire,
          strategy: BattleStrategy.Random,
          willUseAbility: false,
          maskPower: {
            description: 'Test mask',
            shortName: Mask.Pakari,
            longName: 'Test Mask',
            target: 'self',
            active: true,
            cooldown: { unit: 'wave', amount: 0 },
            effect: {
              type: 'ATK_MULT',
              multiplier: 1.5,
              duration: { unit: 'wave', amount: 2 },
            },
          },
        },
        {
          id: 'test2',
          name: 'Test2',
          model: '',
          lvl: 1,
          hp: 100,
          maxHp: 100,
          attack: 10,
          defense: 5,
          speed: 5,
          element: ElementTribe.Water,
          strategy: BattleStrategy.Random,
          willUseAbility: false,
          maskPower: {
            description: 'Test mask',
            shortName: Mask.Kaukau,
            longName: 'Test Mask',
            target: 'self',
            active: false,
            cooldown: { unit: 'wave', amount: 3 },
            effect: {
              type: 'HEAL',
              multiplier: 0.2,
              duration: { unit: 'wave', amount: 1 },
            },
          },
        },
      ];

      const updated = decrementWaveCounters(combatants);

      expect(updated[0].maskPower?.effect.duration.amount).toBe(1);
      expect(updated[1].maskPower?.cooldown.amount).toBe(2);
    });

    test('cooldown does not go below 0', () => {
      const combatant: Combatant = {
        id: 'test',
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test mask',
          shortName: Mask.Pakari,
          longName: 'Test Mask',
          target: 'self',
          active: false,
          cooldown: { unit: 'wave', amount: 0 },
          effect: {
            type: 'ATK_MULT',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 2 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      // Cooldown is already 0, should stay 0
      expect(updated.maskPower?.cooldown.amount).toBe(0);
    });
  });

  describe('decrementMaskPowerCounter – per-unit decrement behavior', () => {
    /** Helper to build a combatant with a specific mask power config */
    function makeCombatant(
      overrides: Partial<{
        id: string;
        active: boolean;
        shortName: Mask;
        durationUnit: 'attack' | 'hit' | 'turn' | 'round' | 'wave';
        durationAmount: number;
        cooldownUnit: 'turn' | 'wave';
        cooldownAmount: number;
      }> = {}
    ): Combatant {
      const {
        id = 'test',
        active = true,
        shortName = Mask.Pakari,
        durationUnit = 'attack',
        durationAmount = 2,
        cooldownUnit = 'turn',
        cooldownAmount = 0,
      } = overrides;
      return {
        id,
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
        maskPower: {
          description: 'Test',
          shortName,
          longName: 'Test Mask',
          target: 'self',
          active,
          cooldown: { unit: cooldownUnit, amount: cooldownAmount },
          effect: {
            type: 'ATK_MULT',
            multiplier: 3,
            duration: { unit: durationUnit, amount: durationAmount },
          },
        },
      };
    }

    // ─── Duration decrements ───

    test('attack-based duration decrements on "attack" unit', () => {
      const c = makeCombatant({ durationUnit: 'attack', durationAmount: 2 });
      const updated = decrementMaskPowerCounter(c, 'attack');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('attack-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        shortName: Mask.Pakari,
        durationUnit: 'attack',
        durationAmount: 1,
        cooldownUnit: 'turn',
        cooldownAmount: 0,
      });
      const updated = decrementMaskPowerCounter(c, 'attack');
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown copied from MASK_POWERS[Pakari] (turn-based, amount 2)
      expect(updated.maskPower?.cooldown.unit).toBe('turn');
      expect(updated.maskPower?.cooldown.amount).toBe(2);
    });

    test('hit-based duration decrements on "hit" unit', () => {
      const c = makeCombatant({
        shortName: Mask.Miru,
        durationUnit: 'hit',
        durationAmount: 2,
      });
      const updated = decrementMaskPowerCounter(c, 'hit');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('hit-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        shortName: Mask.Miru,
        durationUnit: 'hit',
        durationAmount: 1,
        cooldownUnit: 'wave',
        cooldownAmount: 0,
      });
      const updated = decrementMaskPowerCounter(c, 'hit');
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown copied from MASK_POWERS[Miru] (wave-based, amount 1)
      expect(updated.maskPower?.cooldown.unit).toBe('wave');
      expect(updated.maskPower?.cooldown.amount).toBe(1);
    });

    test('turn-based duration decrements on "turn" unit', () => {
      const c = makeCombatant({
        shortName: Mask.Kaukau,
        durationUnit: 'turn',
        durationAmount: 3,
      });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('turn-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        shortName: Mask.Kaukau,
        durationUnit: 'turn',
        durationAmount: 1,
        cooldownUnit: 'wave',
        cooldownAmount: 0,
      });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown copied from MASK_POWERS[Kaukau] (wave-based, amount 1)
      expect(updated.maskPower?.cooldown.unit).toBe('wave');
      expect(updated.maskPower?.cooldown.amount).toBe(1);
    });

    test('round-based duration decrements on "round" unit', () => {
      const c = makeCombatant({
        shortName: Mask.Hau,
        durationUnit: 'round',
        durationAmount: 2,
      });
      const updated = decrementMaskPowerCounter(c, 'round');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('round-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        shortName: Mask.Hau,
        durationUnit: 'round',
        durationAmount: 1,
        cooldownUnit: 'wave',
        cooldownAmount: 0,
      });
      const updated = decrementMaskPowerCounter(c, 'round');
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown copied from MASK_POWERS[Hau] (wave-based, amount 1)
      expect(updated.maskPower?.cooldown.unit).toBe('wave');
      expect(updated.maskPower?.cooldown.amount).toBe(1);
    });

    // ─── Cooldown decrements ───

    test('turn-based cooldown decrements on "turn" unit when inactive', () => {
      const c = makeCombatant({
        active: false,
        durationUnit: 'attack',
        durationAmount: 1,
        cooldownUnit: 'turn',
        cooldownAmount: 3,
      });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.cooldown.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(false);
    });

    test('wave-based cooldown decrements on "wave" unit when inactive', () => {
      const c = makeCombatant({
        active: false,
        durationUnit: 'round',
        durationAmount: 1,
        cooldownUnit: 'wave',
        cooldownAmount: 2,
      });
      const updated = decrementMaskPowerCounter(c, 'wave');
      expect(updated.maskPower?.cooldown.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(false);
    });

    // ─── No-op scenarios ───

    test('does not decrement duration when unit does not match', () => {
      const c = makeCombatant({ durationUnit: 'attack', durationAmount: 2 });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('does not decrement cooldown when unit does not match', () => {
      const c = makeCombatant({
        active: false,
        cooldownUnit: 'turn',
        cooldownAmount: 3,
      });
      const updated = decrementMaskPowerCounter(c, 'wave');
      expect(updated.maskPower?.cooldown.amount).toBe(3);
    });

    test('returns same combatant when no maskPower is present', () => {
      const c: Combatant = {
        id: 'test',
        name: 'Test',
        model: '',
        lvl: 1,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
        speed: 5,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
      };
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated).toBe(c); // same reference, no change
    });

    test('does not decrement cooldown in the same pass that expiry sets it', () => {
      // Pakari: attack-based duration 1. When duration expires, cooldown is set from MASK_POWERS.
      // In the same call, cooldown should NOT be decremented.
      const c = makeCombatant({
        shortName: Mask.Pakari,
        durationUnit: 'attack',
        durationAmount: 1,
        cooldownUnit: 'turn',
        cooldownAmount: 0,
      });
      const updated = decrementMaskPowerCounter(c, 'attack');
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown just set from MASK_POWERS[Pakari] = 2, should NOT be decremented to 1
      expect(updated.maskPower?.cooldown.amount).toBe(2);
    });
  });
});
