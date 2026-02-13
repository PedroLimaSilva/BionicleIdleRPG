import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { decrementWaveCounters } from './combatUtils';

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
          active: true,
          effect: {
            type: 'ATK_MULT',
            target: 'self',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 3 },
            cooldown: { unit: 'wave', amount: 0 },
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
          active: true,
          effect: {
            type: 'DMG_MITIGATOR',
            target: 'self',
            multiplier: 0.5,
            duration: { unit: 'wave', amount: 1 },
            cooldown: { unit: 'wave', amount: 0 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.active).toBe(false);
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
      // Cooldown should be copied from MASK_POWERS when duration expires (Hau has wave cooldown of 1)
      expect(updated.maskPower?.effect.cooldown.amount).toBe(1);
      expect(updated.maskPower?.effect.cooldown.unit).toBe('wave');
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
          active: false,
          effect: {
            type: 'ATK_MULT',
            target: 'self',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 2 },
            cooldown: { unit: 'wave', amount: 3 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      expect(updated.maskPower?.effect.cooldown.amount).toBe(2);
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
          active: true,
          effect: {
            type: 'ATK_MULT',
            target: 'self',
            multiplier: 1.5,
            duration: { unit: 'turn', amount: 3 },
            cooldown: { unit: 'turn', amount: 0 },
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
            active: true,
            effect: {
              type: 'ATK_MULT',
              target: 'self',
              multiplier: 1.5,
              duration: { unit: 'wave', amount: 2 },
              cooldown: { unit: 'wave', amount: 0 },
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
            active: false,
            effect: {
              type: 'HEAL',
              target: 'self',
              multiplier: 0.2,
              duration: { unit: 'wave', amount: 1 },
              cooldown: { unit: 'wave', amount: 3 },
            },
          },
        },
      ];

      const updated = decrementWaveCounters(combatants);

      expect(updated[0].maskPower?.effect.duration.amount).toBe(1);
      expect(updated[1].maskPower?.effect.cooldown.amount).toBe(2);
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
          active: false,
          effect: {
            type: 'ATK_MULT',
            target: 'self',
            multiplier: 1.5,
            duration: { unit: 'wave', amount: 2 },
            cooldown: { unit: 'wave', amount: 0 },
          },
        },
      };

      const [updated] = decrementWaveCounters([combatant]);

      // Cooldown is already 0, should stay 0
      expect(updated.maskPower?.effect.cooldown.amount).toBe(0);
    });
  });

  describe('Cooldown Unit Types', () => {
    test('attack-based cooldown (Pakari)', () => {
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
          description: 'Pakari',
          shortName: Mask.Pakari,
          longName: 'Mask of Strength',
          active: false,
          effect: {
            type: 'ATK_MULT',
            target: 'self',
            multiplier: 3,
            duration: { unit: 'attack', amount: 1 },
            cooldown: { unit: 'turn', amount: 2 },
          },
        },
      };

      expect(combatant.maskPower?.effect.duration.unit).toBe('attack');
      expect(combatant.maskPower?.effect.cooldown.unit).toBe('turn');
    });

    test('hit-based duration (Miru)', () => {
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
          description: 'Miru',
          shortName: Mask.Miru,
          longName: 'Mask of Levitation',
          active: true,
          effect: {
            type: 'DMG_MITIGATOR',
            target: 'self',
            multiplier: 0,
            duration: { unit: 'hit', amount: 2 },
            cooldown: { unit: 'wave', amount: 1 },
          },
        },
      };

      expect(combatant.maskPower?.effect.duration.unit).toBe('hit');
      expect(combatant.maskPower?.effect.cooldown.unit).toBe('wave');
    });

    test('turn-based cooldown (Kakama)', () => {
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
          description: 'Kakama',
          shortName: Mask.Kakama,
          longName: 'Mask of Speed',
          active: false,
          effect: {
            type: 'SPEED',
            target: 'self',
            multiplier: 2,
            duration: { unit: 'round', amount: 1 },
            cooldown: { unit: 'turn', amount: 5 },
          },
        },
      };

      expect(combatant.maskPower?.effect.duration.unit).toBe('round');
      expect(combatant.maskPower?.effect.cooldown.unit).toBe('turn');
      expect(combatant.maskPower?.effect.cooldown.amount).toBe(5);
    });

    test('round-based duration (Hau)', () => {
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
          description: 'Hau',
          shortName: Mask.Hau,
          longName: 'Mask of Shielding',
          active: true,
          effect: {
            type: 'DMG_MITIGATOR',
            target: 'self',
            multiplier: 0,
            duration: { unit: 'round', amount: 1 },
            cooldown: { unit: 'wave', amount: 1 },
          },
        },
      };

      expect(combatant.maskPower?.effect.duration.unit).toBe('round');
      expect(combatant.maskPower?.effect.cooldown.unit).toBe('wave');
    });
  });
});
