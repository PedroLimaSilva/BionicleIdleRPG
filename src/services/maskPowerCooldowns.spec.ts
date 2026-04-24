import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { decrementWaveCounters, decrementMaskPowerCounter } from './combatUtils';

describe('Mask Power Cooldowns', () => {
  describe('Wave-based Cooldowns', () => {
    test('decrements wave-based mask power duration when active', () => {
      const combatant: Combatant = {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'test',
        lvl: 1,
        maskPower: {
          active: true,
          cooldown: { amount: 0, unit: 'wave' },
          description: 'Test mask',
          effect: {
            duration: { amount: 3, unit: 'wave' },
            multiplier: 1.5,
            type: 'ATK_MULT',
          },
          longName: 'Test Mask',
          shortName: Mask.Pakari,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('deactivates mask power when duration reaches 0', () => {
      const combatant: Combatant = {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'Toa_Tahu', // Use a real combatant ID so it can look up the original mask
        lvl: 1,
        maskPower: {
          active: true,
          cooldown: { amount: 0, unit: 'wave' },
          description: 'Test mask',
          effect: {
            duration: { amount: 1, unit: 'wave' },
            multiplier: 0.5,
            type: 'DMG_MITIGATOR',
          },
          longName: 'Test Mask',
          shortName: Mask.Hau,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
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
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'test',
        lvl: 1,
        maskPower: {
          active: false,
          cooldown: { amount: 3, unit: 'wave' },
          description: 'Test mask',
          effect: {
            duration: { amount: 2, unit: 'wave' },
            multiplier: 1.5,
            type: 'ATK_MULT',
          },
          longName: 'Test Mask',
          shortName: Mask.Pakari,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.cooldown.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(false);
    });

    test('does not decrement non-wave counters', () => {
      const combatant: Combatant = {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'test',
        lvl: 1,
        maskPower: {
          active: true,
          cooldown: { amount: 0, unit: 'turn' },
          description: 'Test mask',
          effect: {
            duration: { amount: 3, unit: 'turn' },
            multiplier: 1.5,
            type: 'ATK_MULT',
          },
          longName: 'Test Mask',
          shortName: Mask.Pakari,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
      };

      const [updated] = decrementWaveCounters([combatant]);

      // Should not change because duration unit is 'turn', not 'wave'
      expect(updated.maskPower?.effect.duration.amount).toBe(3);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('handles multiple combatants', () => {
      const combatants: Combatant[] = [
        {
          attack: 10,
          defense: 5,
          element: ElementTribe.Fire,
          hp: 100,
          id: 'test1',
          lvl: 1,
          maskPower: {
            active: true,
            cooldown: { amount: 0, unit: 'wave' },
            description: 'Test mask',
            effect: {
              duration: { amount: 2, unit: 'wave' },
              multiplier: 1.5,
              type: 'ATK_MULT',
            },
            longName: 'Test Mask',
            shortName: Mask.Pakari,
            target: 'self',
          },
          maxHp: 100,
          model: '',
          name: 'Test1',
          speed: 5,
          strategy: BattleStrategy.Random,
          willUseAbility: false,
        },
        {
          attack: 10,
          defense: 5,
          element: ElementTribe.Water,
          hp: 100,
          id: 'test2',
          lvl: 1,
          maskPower: {
            active: false,
            cooldown: { amount: 3, unit: 'wave' },
            description: 'Test mask',
            effect: {
              duration: { amount: 1, unit: 'wave' },
              multiplier: 0.2,
              type: 'HEAL',
            },
            longName: 'Test Mask',
            shortName: Mask.Kaukau,
            target: 'self',
          },
          maxHp: 100,
          model: '',
          name: 'Test2',
          speed: 5,
          strategy: BattleStrategy.Random,
          willUseAbility: false,
        },
      ];

      const updated = decrementWaveCounters(combatants);

      expect(updated[0].maskPower?.effect.duration.amount).toBe(1);
      expect(updated[1].maskPower?.cooldown.amount).toBe(2);
    });

    test('cooldown does not go below 0', () => {
      const combatant: Combatant = {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'test',
        lvl: 1,
        maskPower: {
          active: false,
          cooldown: { amount: 0, unit: 'wave' },
          description: 'Test mask',
          effect: {
            duration: { amount: 2, unit: 'wave' },
            multiplier: 1.5,
            type: 'ATK_MULT',
          },
          longName: 'Test Mask',
          shortName: Mask.Pakari,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
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
        active = true,
        cooldownAmount = 0,
        cooldownUnit = 'turn',
        durationAmount = 2,
        durationUnit = 'attack',
        id = 'test',
        shortName = Mask.Pakari,
      } = overrides;
      return {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id,
        lvl: 1,
        maskPower: {
          active,
          cooldown: { amount: cooldownAmount, unit: cooldownUnit },
          description: 'Test',
          effect: {
            duration: { amount: durationAmount, unit: durationUnit },
            multiplier: 3,
            type: 'ATK_MULT',
          },
          longName: 'Test Mask',
          shortName,
          target: 'self',
        },
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
        strategy: BattleStrategy.Random,
        willUseAbility: false,
      };
    }

    // ─── Duration decrements ───

    test('attack-based duration decrements on "attack" unit', () => {
      const c = makeCombatant({ durationAmount: 2, durationUnit: 'attack' });
      const updated = decrementMaskPowerCounter(c, 'attack');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('attack-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        cooldownAmount: 0,
        cooldownUnit: 'turn',
        durationAmount: 1,
        durationUnit: 'attack',
        shortName: Mask.Pakari,
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
        durationAmount: 2,
        durationUnit: 'hit',
        shortName: Mask.Miru,
      });
      const updated = decrementMaskPowerCounter(c, 'hit');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('hit-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        cooldownAmount: 0,
        cooldownUnit: 'wave',
        durationAmount: 1,
        durationUnit: 'hit',
        shortName: Mask.Miru,
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
        durationAmount: 3,
        durationUnit: 'turn',
        shortName: Mask.Kaukau,
      });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('turn-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        cooldownAmount: 0,
        cooldownUnit: 'wave',
        durationAmount: 1,
        durationUnit: 'turn',
        shortName: Mask.Kaukau,
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
        durationAmount: 2,
        durationUnit: 'round',
        shortName: Mask.Hau,
      });
      const updated = decrementMaskPowerCounter(c, 'round');
      expect(updated.maskPower?.effect.duration.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('round-based duration reaching 0 deactivates and sets cooldown', () => {
      const c = makeCombatant({
        cooldownAmount: 0,
        cooldownUnit: 'wave',
        durationAmount: 1,
        durationUnit: 'round',
        shortName: Mask.Hau,
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
        cooldownAmount: 3,
        cooldownUnit: 'turn',
        durationAmount: 1,
        durationUnit: 'attack',
      });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.cooldown.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(false);
    });

    test('wave-based cooldown decrements on "wave" unit when inactive', () => {
      const c = makeCombatant({
        active: false,
        cooldownAmount: 2,
        cooldownUnit: 'wave',
        durationAmount: 1,
        durationUnit: 'round',
      });
      const updated = decrementMaskPowerCounter(c, 'wave');
      expect(updated.maskPower?.cooldown.amount).toBe(1);
      expect(updated.maskPower?.active).toBe(false);
    });

    // ─── No-op scenarios ───

    test('does not decrement duration when unit does not match', () => {
      const c = makeCombatant({ durationAmount: 2, durationUnit: 'attack' });
      const updated = decrementMaskPowerCounter(c, 'turn');
      expect(updated.maskPower?.effect.duration.amount).toBe(2);
      expect(updated.maskPower?.active).toBe(true);
    });

    test('does not decrement cooldown when unit does not match', () => {
      const c = makeCombatant({
        active: false,
        cooldownAmount: 3,
        cooldownUnit: 'turn',
      });
      const updated = decrementMaskPowerCounter(c, 'wave');
      expect(updated.maskPower?.cooldown.amount).toBe(3);
    });

    test('returns same combatant when no maskPower is present', () => {
      const c: Combatant = {
        attack: 10,
        defense: 5,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'test',
        lvl: 1,
        maxHp: 100,
        model: '',
        name: 'Test',
        speed: 5,
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
        cooldownAmount: 0,
        cooldownUnit: 'turn',
        durationAmount: 1,
        durationUnit: 'attack',
        shortName: Mask.Pakari,
      });
      const updated = decrementMaskPowerCounter(c, 'attack');
      expect(updated.maskPower?.active).toBe(false);
      // Cooldown just set from MASK_POWERS[Pakari] = 2, should NOT be decremented to 1
      expect(updated.maskPower?.cooldown.amount).toBe(2);
    });
  });
});
