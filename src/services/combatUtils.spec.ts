import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe } from '../types/Matoran';
import { chooseTarget } from './combatUtils';

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
    };

    const chosen = chooseTarget(self, targets);
    expect(chosen).toBe(targets[1]);

    jest.spyOn(Math, 'random').mockRestore();
  });
});
