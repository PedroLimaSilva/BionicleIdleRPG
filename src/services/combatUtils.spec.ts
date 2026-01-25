import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe } from '../types/Matoran';
import { chooseTarget, generateCombatantStats } from './combatUtils';

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
        'Kaukau' as any
      );

      expect(combatant.maskPower).toBeDefined();
    });

    test('initializes mask power cooldown to 0', () => {
      const combatant = generateCombatantStats(
        'test-id',
        'Toa_Tahu',
        1,
        'Hau' as any
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
});
