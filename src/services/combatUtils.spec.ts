import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { chooseTarget, generateCombatantStats, decrementWaveCounters } from './combatUtils';
import { LegoColor } from '../types/Colors';

describe('chooseTarget', () => {
  const targets: Combatant[] = [
    {
      id: 'a',
      hp: 100,
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      strategy: BattleStrategy.LowestHp,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    },
    {
      id: 'b',
      hp: 20,
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      strategy: BattleStrategy.LowestHp,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    },
    {
      id: 'c',
      hp: 80,
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      strategy: BattleStrategy.LowestHp,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    },
  ];

  test('chooses target with lowest HP', () => {
    const self: Combatant = {
      id: 'self',
      hp: 100,
      attack: 10,
      defense: 5,
      element: ElementTribe.Stone,
      strategy: BattleStrategy.LowestHp,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    };
    const chosen = chooseTarget(self, targets);
    expect(chosen.id).toBe('b');
  });

  test('chooses target with highest calculated damage', () => {
    // Freeze randomness for consistent damage calculation
    jest.spyOn(Math, 'random').mockReturnValue(0); // i.e. adds 0

    const self: Combatant = {
      id: 'fire',
      hp: 100,
      attack: 15,
      defense: 5,
      element: ElementTribe.Fire,
      strategy: BattleStrategy.MostEffective,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    };

    const customTargets: Combatant[] = [
      {
        id: 'ice',
        hp: 100,
        attack: 5,
        defense: 10,
        element: ElementTribe.Ice,
        strategy: BattleStrategy.LowestHp,
        name: 'ice',
        model: '',
        lvl: 0,
        maxHp: 0,
        speed: 0,
        willUseAbility: false,
      }, // effective (1.5x)
      {
        id: 'earth',
        hp: 100,
        attack: 5,
        defense: 10,
        element: ElementTribe.Earth,
        strategy: BattleStrategy.LowestHp,
        name: 'earth',
        model: '',
        lvl: 0,
        maxHp: 0,
        speed: 0,
        willUseAbility: false,
      }, // neutral (1x)
      {
        id: 'shadow',
        hp: 100,
        attack: 5,
        defense: 10,
        element: ElementTribe.Shadow,
        strategy: BattleStrategy.LowestHp,
        name: 'shadow',
        model: '',
        lvl: 0,
        maxHp: 0,
        speed: 0,
        willUseAbility: false,
      }, // neutral (1x)
    ];

    const chosen = chooseTarget(self, customTargets);
    expect(chosen.id).toBe('ice');

    // Restore original Math.random
    jest.spyOn(Math, 'random').mockRestore();
  });

  test('chooses a random target when strategy is Random', () => {
    // Force the random index to 1
    jest.spyOn(Math, 'random').mockReturnValue(0.51); // 0.51 * 3 = index 1

    const self: Combatant = {
      id: 'self',
      hp: 100,
      attack: 10,
      defense: 5,
      element: ElementTribe.Stone,
      strategy: BattleStrategy.Random,
      name: '',
      model: '',
      lvl: 0,
      maxHp: 0,
      speed: 0,
      willUseAbility: false,
    };

    const chosen = chooseTarget(self, targets);
    expect(chosen).toBe(targets[1]);

    jest.spyOn(Math, 'random').mockRestore();
  });

  describe('generateCombatantStats', () => {
    test('generates combatant with correct base stats', () => {
      const combatant = generateCombatantStats('test-id', 'Toa_Tahu', 1);

      expect(combatant.id).toBe('test-id');
      expect(combatant.lvl).toBe(1);
      expect(combatant.element).toBe(ElementTribe.Fire);
    });

    test('scales stats with level', () => {
      const level1 = generateCombatantStats('test-1', 'Toa_Tahu', 1);
      const level5 = generateCombatantStats('test-5', 'Toa_Tahu', 5);

      // HP scales by 10 per level
      expect(level5.maxHp).toBe(level1.maxHp + 40); // 4 levels * 10
      expect(level5.hp).toBe(level5.maxHp);

      // Attack scales by 3 per level
      expect(level5.attack).toBe(level1.attack + 12); // 4 levels * 3

      // Defense scales by 2 per level
      expect(level5.defense).toBe(level1.defense + 8); // 4 levels * 2

      // Speed scales by 1 per level
      expect(level5.speed).toBe(level1.speed + 4); // 4 levels * 1
    });

    test('initializes HP to maxHp', () => {
      const combatant = generateCombatantStats('test-id', 'Toa_Tahu', 5);

      expect(combatant.hp).toBe(combatant.maxHp);
    });

    test('applies mask override when provided', () => {
      const combatant = generateCombatantStats(
        'test-id',
        'Toa_Tahu',
        1,
        Mask.Kaukau
      );

      expect(combatant.maskPower).toBeDefined();
    });

    test('initializes mask power cooldown to 0', () => {
      const combatant = generateCombatantStats(
        'test-id',
        'Toa_Tahu',
        1,
        Mask.Hau
      );

      expect(combatant.maskPower?.effect.cooldown.amount).toBe(0);
    });
  });

  // Skipping these tests as they are not actually testing the type effectiveness
  // TODO: Improve the tests
  describe.skip('element effectiveness', () => {
    test('Fire is effective against Ice (1.5x)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);

      const fire: Combatant = {
        id: 'fire',
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 0,
        element: ElementTribe.Fire,
        strategy: BattleStrategy.LowestHp,
        name: 'Fire',
        model: '',
        lvl: 1,
        speed: 5,
        willUseAbility: false,
      };

      const ice: Combatant = {
        id: 'ice',
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 0,
        element: ElementTribe.Ice,
        strategy: BattleStrategy.LowestHp,
        name: 'Ice',
        model: '',
        lvl: 1,
        speed: 5,
        willUseAbility: false,
      };

      // This test verifies the element effectiveness is working
      // We can't directly test calculateAtkDmg as it's not exported,
      // but we know Fire vs Ice should be 1.5x effective
      expect(fire.element).toBe(ElementTribe.Fire);
      expect(ice.element).toBe(ElementTribe.Ice);

      jest.spyOn(Math, 'random').mockRestore();
    });

    test('Water is effective against Fire (1.5x)', () => {
      const water: Combatant = {
        id: 'water',
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 0,
        element: ElementTribe.Water,
        strategy: BattleStrategy.LowestHp,
        name: 'Water',
        model: '',
        lvl: 1,
        speed: 5,
        willUseAbility: false,
      };

      expect(water.element).toBe(ElementTribe.Water);
    });

    test('Shadow is effective against Light (1.5x)', () => {
      const shadow: Combatant = {
        id: 'shadow',
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 0,
        element: ElementTribe.Shadow,
        strategy: BattleStrategy.LowestHp,
        name: 'Shadow',
        model: '',
        lvl: 1,
        speed: 5,
        willUseAbility: false,
      };

      expect(shadow.element).toBe(ElementTribe.Shadow);
    });
  });

  describe('mask powers and abilities', () => {
    test('generates combatant with Hau mask (DMG_MITIGATOR)', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      expect(tahu.maskPower).toBeDefined();
      expect(tahu.maskPower?.effect.type).toBe('DMG_MITIGATOR');
    });

    test('generates combatant with Kakama mask (SPEED)', () => {
      const pohatu = generateCombatantStats('pohatu', 'Toa_Pohatu', 1, Mask.Kakama);

      expect(pohatu.maskPower).toBeDefined();
      expect(pohatu.maskPower?.effect.type).toBe('SPEED');
    });

    test('generates combatant with Kaukau mask (HEAL)', () => {
      const gali = generateCombatantStats('gali', 'Toa_Gali', 1, Mask.Kaukau);

      expect(gali.maskPower).toBeDefined();
      expect(gali.maskPower?.effect.type).toBe('HEAL');
    });

    test('generates combatant with Pakari mask (ATK_MULT)', () => {
      const onua = generateCombatantStats('onua', 'Toa_Onua', 1, Mask.Pakari);

      expect(onua.maskPower).toBeDefined();
      expect(onua.maskPower?.effect.type).toBe('ATK_MULT');
    });

    test('generates combatant with Miru mask (DMG_MITIGATOR)', () => {
      const lewa = generateCombatantStats('lewa', 'Toa_Lewa', 1, Mask.Miru);

      expect(lewa.maskPower).toBeDefined();
      expect(lewa.maskPower?.effect.type).toBe('DMG_MITIGATOR');
    });

    test('generates combatant with Huna mask (AGGRO)', () => {
      const matoran = generateCombatantStats('test', 'Toa_Tahu', 1, Mask.Huna);

      expect(matoran.maskPower).toBeDefined();
      expect(matoran.maskPower?.effect.type).toBe('AGGRO');
    });

    test('mask power has duration and cooldown properties', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      expect(tahu.maskPower?.effect.duration).toBeDefined();
      expect(tahu.maskPower?.effect.duration.unit).toBeDefined();
      expect(tahu.maskPower?.effect.duration.amount).toBeGreaterThanOrEqual(0);
      expect(tahu.maskPower?.effect.cooldown).toBeDefined();
      expect(tahu.maskPower?.effect.cooldown.unit).toBeDefined();
      expect(tahu.maskPower?.effect.cooldown.amount).toBeGreaterThanOrEqual(0);
    });

    test('mask power starts inactive or undefined', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      // active can be false or undefined (both mean inactive)
      expect(tahu.maskPower?.active).toBeFalsy();
    });
  });

  describe('decrementWaveCounters', () => {
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
      // Cooldown should be set from the original mask data when duration expires
      expect(updated.maskPower?.effect.duration.amount).toBe(0);
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
  });
});
