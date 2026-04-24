import { BattleStrategy, Combatant, type EnemyEncounter } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { KraataPower } from '../types/Kraata';
import {
  chooseTarget,
  generateCombatantStats,
  getScaledEnemyLevelForEncounter,
  hasActiveEffectFromSource,
  hasReadyMaskPowers,
  queueCombatRound,
  RAHKSHI_SOLO_PARTY_LEVEL_BONUS,
} from './combatUtils';

describe('chooseTarget', () => {
  const targets: Combatant[] = [
    {
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      hp: 100,
      id: 'a',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.LowestHp,
      willUseAbility: false,
    },
    {
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      hp: 20,
      id: 'b',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.LowestHp,
      willUseAbility: false,
    },
    {
      attack: 5,
      defense: 1,
      element: ElementTribe.Stone,
      hp: 80,
      id: 'c',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.LowestHp,
      willUseAbility: false,
    },
  ];

  test('chooses target with lowest HP', () => {
    const self: Combatant = {
      attack: 10,
      defense: 5,
      element: ElementTribe.Stone,
      hp: 100,
      id: 'self',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.LowestHp,
      willUseAbility: false,
    };
    const chosen = chooseTarget(self, targets);
    expect(chosen.id).toBe('b');
  });

  test('chooses target with highest calculated damage', () => {
    // Freeze randomness for consistent damage calculation
    jest.spyOn(Math, 'random').mockReturnValue(0); // i.e. adds 0

    const self: Combatant = {
      attack: 15,
      defense: 5,
      element: ElementTribe.Fire,
      hp: 100,
      id: 'fire',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.MostEffective,
      willUseAbility: false,
    };

    const customTargets: Combatant[] = [
      {
        attack: 5,
        defense: 10,
        element: ElementTribe.Ice,
        hp: 100,
        id: 'ice',
        lvl: 0,
        maxHp: 0,
        model: '',
        name: 'ice',
        speed: 0,
        strategy: BattleStrategy.LowestHp,
        willUseAbility: false,
      }, // effective (1.5x)
      {
        attack: 5,
        defense: 10,
        element: ElementTribe.Earth,
        hp: 100,
        id: 'earth',
        lvl: 0,
        maxHp: 0,
        model: '',
        name: 'earth',
        speed: 0,
        strategy: BattleStrategy.LowestHp,
        willUseAbility: false,
      }, // weak (0.5x)
      {
        attack: 5,
        defense: 10,
        element: ElementTribe.Shadow,
        hp: 100,
        id: 'shadow',
        lvl: 0,
        maxHp: 0,
        model: '',
        name: 'shadow',
        speed: 0,
        strategy: BattleStrategy.LowestHp,
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
      attack: 10,
      defense: 5,
      element: ElementTribe.Stone,
      hp: 100,
      id: 'self',
      lvl: 0,
      maxHp: 0,
      model: '',
      name: '',
      speed: 0,
      strategy: BattleStrategy.Random,
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

    test('assigns stable nui_rama jaw variant from instance id', () => {
      const first = generateCombatantStats('nui_rama-0', 'nui_rama', 5);
      const again = generateCombatantStats('nui_rama-0', 'nui_rama', 1);
      expect(first.nuiRamaVariant).toMatch(/^(orange|lime)$/);
      expect(first.nuiRamaVariant).toBe(again.nuiRamaVariant);
    });

    test('applies mask override when provided', () => {
      const combatant = generateCombatantStats('test-id', 'Toa_Tahu', 1, Mask.Kaukau);

      expect(combatant.maskPower).toBeDefined();
    });

    test('initializes mask power cooldown to 0', () => {
      const combatant = generateCombatantStats('test-id', 'Toa_Tahu', 1, Mask.Hau);

      expect(combatant.maskPower?.cooldown.amount).toBe(0);
    });

    test('diminishes Toa Nuva stats when nuvaSymbolsSequestered', () => {
      const full = generateCombatantStats('tahu-nuva', 'Toa_Tahu_Nuva', 10);
      const sequestered = generateCombatantStats('tahu-nuva', 'Toa_Tahu_Nuva', 10, {
        nuvaSymbolsSequestered: true,
      });

      expect(sequestered.maxHp).toBeLessThan(full.maxHp);
      expect(sequestered.attack).toBeLessThan(full.attack);
      expect(sequestered.defense).toBeLessThan(full.defense);
      expect(sequestered.speed).toBeLessThan(full.speed);
    });

    test('does not diminish Toa Mata when nuvaSymbolsSequestered', () => {
      const normal = generateCombatantStats('tahu', 'Toa_Tahu', 10);
      const withFlag = generateCombatantStats('tahu', 'Toa_Tahu', 10, {
        nuvaSymbolsSequestered: true,
      });
      expect(withFlag.maxHp).toBe(normal.maxHp);
      expect(withFlag.attack).toBe(normal.attack);
    });
  });

  describe('getScaledEnemyLevelForEncounter', () => {
    const baseEncounter = (scales: boolean): EnemyEncounter => ({
      description: '',
      difficulty: 1,
      headliner: 'tahnok',
      id: 'test',
      loot: [],
      name: 'Test',
      scalesWithParty: scales,
      waves: [[]],
    });

    test('returns wave base level when encounter does not scale with party', () => {
      const e = baseEncounter(false);
      expect(getScaledEnemyLevelForEncounter(e, [{ id: 'x', lvl: 1 }], 5, 20)).toBe(5);
    });

    test('adds solo bonus vs average party for one-enemy waves', () => {
      const e = baseEncounter(true);
      expect(getScaledEnemyLevelForEncounter(e, [{ id: 'x', lvl: 1 }], 1, 10)).toBe(
        10 + RAHKSHI_SOLO_PARTY_LEVEL_BONUS
      );
    });

    test('does not add solo bonus for multi-enemy waves', () => {
      const e = baseEncounter(true);
      expect(
        getScaledEnemyLevelForEncounter(
          e,
          [
            { id: 'a', lvl: 1 },
            { id: 'b', lvl: 1 },
          ],
          1,
          10
        )
      ).toBe(10);
    });
  });

  // Skipping these tests as they are not actually testing the type effectiveness
  // TODO: Improve the tests
  describe.skip('element effectiveness', () => {
    test('Fire is effective against Ice (1.5x)', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0);

      const fire: Combatant = {
        attack: 10,
        defense: 0,
        element: ElementTribe.Fire,
        hp: 100,
        id: 'fire',
        lvl: 1,
        maxHp: 100,
        model: '',
        name: 'Fire',
        speed: 5,
        strategy: BattleStrategy.LowestHp,
        willUseAbility: false,
      };

      const ice: Combatant = {
        attack: 10,
        defense: 0,
        element: ElementTribe.Ice,
        hp: 100,
        id: 'ice',
        lvl: 1,
        maxHp: 100,
        model: '',
        name: 'Ice',
        speed: 5,
        strategy: BattleStrategy.LowestHp,
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
        attack: 10,
        defense: 0,
        element: ElementTribe.Water,
        hp: 100,
        id: 'water',
        lvl: 1,
        maxHp: 100,
        model: '',
        name: 'Water',
        speed: 5,
        strategy: BattleStrategy.LowestHp,
        willUseAbility: false,
      };

      expect(water.element).toBe(ElementTribe.Water);
    });

    test('Shadow is effective against Light (1.5x)', () => {
      const shadow: Combatant = {
        attack: 10,
        defense: 0,
        element: ElementTribe.Shadow,
        hp: 100,
        id: 'shadow',
        lvl: 1,
        maxHp: 100,
        model: '',
        name: 'Shadow',
        speed: 5,
        strategy: BattleStrategy.LowestHp,
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
      expect(tahu.maskPower?.cooldown).toBeDefined();
      expect(tahu.maskPower?.cooldown.unit).toBeDefined();
      expect(tahu.maskPower?.cooldown.amount).toBeGreaterThanOrEqual(0);
    });

    test('mask power starts inactive or undefined', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      // active can be false or undefined (both mean inactive)
      expect(tahu.maskPower?.active).toBeFalsy();
    });
  });

  describe('hasReadyMaskPowers', () => {
    const baseCombatant: Combatant = {
      attack: 10,
      defense: 5,
      element: ElementTribe.Fire,
      hp: 100,
      id: 'test',
      lvl: 1,
      maxHp: 100,
      model: 'test',
      name: 'Test',
      speed: 5,
      strategy: BattleStrategy.Random,
      willUseAbility: false,
    };

    test('returns true when a combatant has mask power off cooldown', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      expect(hasReadyMaskPowers([tahu])).toBe(true);
    });

    test('returns false when combatant has no mask power', () => {
      expect(hasReadyMaskPowers([baseCombatant])).toBe(false);
    });

    test('returns false when mask power is on cooldown', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      tahu.maskPower!.cooldown.amount = 3;
      expect(hasReadyMaskPowers([tahu])).toBe(false);
    });

    test('returns false when mask power is currently active', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      tahu.maskPower!.active = true;
      expect(hasReadyMaskPowers([tahu])).toBe(false);
    });

    test('returns false when combatant is dead', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      tahu.hp = 0;
      expect(hasReadyMaskPowers([tahu])).toBe(false);
    });

    test('returns true if at least one team member has ready power', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      tahu.maskPower!.cooldown.amount = 3;
      const onua = generateCombatantStats('onua', 'Toa_Onua', 1);
      expect(hasReadyMaskPowers([tahu, onua])).toBe(true);
    });

    test('returns false when all mask powers are on cooldown', () => {
      const tahu = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      tahu.maskPower!.cooldown.amount = 1;
      const onua = generateCombatantStats('onua', 'Toa_Onua', 1);
      onua.maskPower!.cooldown.amount = 2;
      expect(hasReadyMaskPowers([tahu, onua])).toBe(false);
    });

    test('returns false for empty team', () => {
      expect(hasReadyMaskPowers([])).toBe(false);
    });
  });

  describe('hasActiveEffectFromSource', () => {
    test('returns false when effect is only on dead combatant (e.g. Komau target died)', () => {
      const deadEnemy = generateCombatantStats('enemy', 'tahnok', 1);
      deadEnemy.hp = 0;
      deadEnemy.effects = [
        {
          durationRemaining: 2,
          durationUnit: 'turn',
          sourceId: 'Toa_Tahu',
          type: 'CONFUSION',
        },
      ];
      const team = [generateCombatantStats('Toa_Tahu', 'Toa_Tahu', 1)];
      expect(hasActiveEffectFromSource(team, [deadEnemy], 'Toa_Tahu')).toBe(false);
    });

    test('returns true when effect is on alive combatant', () => {
      const aliveEnemy = generateCombatantStats('enemy', 'tahnok', 1);
      aliveEnemy.effects = [
        {
          durationRemaining: 2,
          durationUnit: 'turn',
          sourceId: 'Toa_Tahu',
          type: 'CONFUSION',
        },
      ];
      const team = [generateCombatantStats('Toa_Tahu', 'Toa_Tahu', 1)];
      expect(hasActiveEffectFromSource(team, [aliveEnemy], 'Toa_Tahu')).toBe(true);
    });
  });
});

describe('queueCombatRound (self-target / 3D refs)', () => {
  beforeEach(() => {
    (globalThis as unknown as { window: { combatantRefs: Record<string, unknown> } }).window = {
      combatantRefs: {},
    };
  });

  test('does not call defender Hit when attacker targets self (same ref would cancel Attack)', async () => {
    const confusedRahkshi = generateCombatantStats(`${KraataPower.Fear}-0`, KraataPower.Fear, 1);
    confusedRahkshi.effects = [
      {
        durationRemaining: 1,
        durationUnit: 'turn',
        sourceId: 'ally',
        type: 'CONFUSION',
      },
    ];
    // No allies: confused attacker has no one else to hit, so target becomes self
    const team: Combatant[] = [];
    const enemies = [confusedRahkshi];

    const hitSpy = jest.fn().mockResolvedValue(undefined);
    const attackSpy = jest.fn().mockResolvedValue(undefined);
    const selfHandle = {
      playAnimation: jest.fn(async (name: string) => {
        if (name === 'Attack') await attackSpy();
        if (name === 'Hit') await hitSpy();
      }),
    };
    window.combatantRefs[confusedRahkshi.id] = selfHandle;

    const queue: (() => Promise<void>)[] = [];
    queueCombatRound(team, enemies, jest.fn(), jest.fn(), (fn) => queue.push(fn));

    for (const step of queue) {
      await step();
    }

    expect(attackSpy).toHaveBeenCalled();
    expect(hitSpy).not.toHaveBeenCalled();
  });

  test('does not call defender Hit when targetRef is same object as actorRef (stale id map)', async () => {
    const attacker = generateCombatantStats('Toa_Tahu', 'Toa_Tahu', 1);
    const enemy = generateCombatantStats(`${KraataPower.Fear}-0`, KraataPower.Fear, 1);

    const hitSpy = jest.fn().mockResolvedValue(undefined);
    const attackSpy = jest.fn().mockResolvedValue(undefined);
    const shared = {
      playAnimation: jest.fn(async (name: string) => {
        if (name === 'Attack') await attackSpy();
        if (name === 'Hit') await hitSpy();
      }),
    };
    window.combatantRefs[attacker.id] = shared;
    window.combatantRefs[enemy.id] = shared;

    const queue: (() => Promise<void>)[] = [];
    queueCombatRound([attacker], [enemy], jest.fn(), jest.fn(), (fn) => queue.push(fn));

    for (const step of queue) {
      await step();
    }

    expect(attackSpy).toHaveBeenCalled();
    expect(hitSpy).not.toHaveBeenCalled();
  });
});
