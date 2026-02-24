import { BattleStrategy, Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import {
  generateCombatantStats,
  calculateAtkDmg,
  applyDamage,
  applyHealing,
  chooseTarget,
} from './combatUtils';

describe('Mask Powers - Combat Mechanics', () => {
  let defender: Combatant;

  beforeEach(() => {
    // Mock Math.random to make tests deterministic (returns 0)
    jest.spyOn(Math, 'random').mockReturnValue(0);

    // Create a standard defender for all tests
    // Using same element to avoid element effectiveness complications
    defender = {
      id: 'enemy',
      name: 'Enemy',
      model: '',
      lvl: 1,
      hp: 100,
      maxHp: 100,
      attack: 10,
      defense: 5,
      speed: 5,
      element: ElementTribe.Earth, // Same as Onua to get 1.0x effectiveness
      strategy: BattleStrategy.Random,
      willUseAbility: false,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ATK_MULT - Attack Multiplier Masks', () => {
    describe('Pakari - Mask of Strength', () => {
      test('multiplies attack damage by 3x when active', () => {
        const attacker = generateCombatantStats('onua', 'Toa_Onua', 1, Mask.Pakari);

        // Calculate damage without mask power
        const normalDamage = calculateAtkDmg(attacker, defender);

        // Activate the mask power
        if (attacker.maskPower) {
          attacker.maskPower.active = true;
        }

        // Calculate damage with mask power active
        const boostedDamage = calculateAtkDmg(attacker, defender);

        // Pakari should triple the raw damage before element effectiveness
        // The ratio should be 3:1
        expect(boostedDamage).toBe(normalDamage * 3);
        expect(boostedDamage).toBeGreaterThan(normalDamage);
      });

      test('does not boost damage when inactive', () => {
        const attacker = generateCombatantStats('onua', 'Toa_Onua', 1, Mask.Pakari);

        // Ensure mask is inactive
        if (attacker.maskPower) {
          attacker.maskPower.active = false;
        }

        const damage1 = calculateAtkDmg(attacker, defender);
        const damage2 = calculateAtkDmg(attacker, defender);

        // Should be consistent damage without mask
        expect(damage1).toBe(damage2);
        expect(damage1).toBeGreaterThan(0);
      });
    });

    describe('Akaku - Mask of X-Ray Vision (DEBUFF DEFENSE)', () => {
      test('DEFENSE effect increases damage from any attacker', () => {
        const attacker = generateCombatantStats('tahu', 'Toa_Tahu', 1);
        const debuffedDefender: Combatant = {
          ...defender,
          effects: [
            {
              type: 'DEFENSE',
              multiplier: 1.5,
              durationRemaining: 2,
              durationUnit: 'round',
              sourceId: 'caster',
            },
          ],
        };

        const normalDamage = calculateAtkDmg(attacker, defender);
        const damageVsDebuffed = calculateAtkDmg(attacker, debuffedDefender);

        expect(damageVsDebuffed).toBe(Math.floor(normalDamage * 1.5));
      });
    });
  });

  describe('DMG_MITIGATOR - Damage Mitigation Masks', () => {
    describe('Hau - Mask of Shielding', () => {
      test('provides full immunity when active', () => {
        const target = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);
        const incomingDamage = 50;

        // Without mask power
        const damagedWithoutMask = applyDamage(target, incomingDamage);
        expect(damagedWithoutMask.hp).toBe(target.hp - incomingDamage);

        // With mask power active
        if (target.maskPower) {
          target.maskPower.active = true;
        }
        const damagedWithMask = applyDamage(target, incomingDamage);

        // Hau should provide full immunity (0 damage)
        expect(damagedWithMask.hp).toBe(target.hp);
      });

      test('does not mitigate damage when inactive', () => {
        const target = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);
        const incomingDamage = 50;

        // Ensure mask is inactive
        if (target.maskPower) {
          target.maskPower.active = false;
        }

        const damaged = applyDamage(target, incomingDamage);

        // Should take full damage
        expect(damaged.hp).toBe(target.hp - incomingDamage);
      });
    });

    describe('Miru - Mask of Levitation', () => {
      test('provides full immunity when active', () => {
        const target = generateCombatantStats('lewa', 'Toa_Lewa', 1, Mask.Miru);
        const incomingDamage = 40;

        // Activate mask power
        if (target.maskPower) {
          target.maskPower.active = true;
        }

        const damaged = applyDamage(target, incomingDamage);

        // Miru should provide full immunity (0 damage)
        expect(damaged.hp).toBe(target.hp);
      });

      test('does not mitigate damage when inactive', () => {
        const target = generateCombatantStats('lewa', 'Toa_Lewa', 1, Mask.Miru);
        const incomingDamage = 40;

        if (target.maskPower) {
          target.maskPower.active = false;
        }

        const damaged = applyDamage(target, incomingDamage);

        expect(damaged.hp).toBe(target.hp - incomingDamage);
      });
    });

    describe('Mahiki - Mask of Illusion', () => {
      test('provides full immunity when active', () => {
        const target = generateCombatantStats('lewa', 'Toa_Lewa', 1, Mask.Mahiki);
        const incomingDamage = 35;

        // Activate mask power
        if (target.maskPower) {
          target.maskPower.active = true;
        }

        const damaged = applyDamage(target, incomingDamage);

        // Mahiki should provide full immunity (0 damage)
        expect(damaged.hp).toBe(target.hp);
      });

      test('does not mitigate damage when inactive', () => {
        const target = generateCombatantStats('lewa', 'Toa_Lewa', 1, Mask.Mahiki);
        const incomingDamage = 35;

        if (target.maskPower) {
          target.maskPower.active = false;
        }

        const damaged = applyDamage(target, incomingDamage);

        expect(damaged.hp).toBe(target.hp - incomingDamage);
      });
    });
  });

  describe('AGGRO - Untargetable Masks (Huna)', () => {
    test('chooseTarget filters out enemy with Huna active', () => {
      const attacker = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      const targetWithHuna = generateCombatantStats('enemy_huna', 'tahnok', 1, Mask.Huna);
      const targetNormal = generateCombatantStats('enemy_normal', 'tahnok', 1);

      if (targetWithHuna.maskPower) {
        targetWithHuna.maskPower.active = true;
      }

      const targets = [targetWithHuna, targetNormal];

      // With Random strategy, mock Math.random to always pick first valid target (index 0 or 1)
      // Since Huna enemy is filtered out, validTargets = [targetNormal], so we always get targetNormal
      const chosen = chooseTarget(attacker, targets);

      expect(chosen.id).toBe('enemy_normal');
      expect(chosen.id).not.toBe('enemy_huna');
    });

    test('chooseTarget includes enemy with Huna when inactive', () => {
      const attacker = generateCombatantStats('tahu', 'Toa_Tahu', 1);
      const targetWithHuna = generateCombatantStats('enemy_huna', 'tahnok', 1, Mask.Huna);

      if (targetWithHuna.maskPower) {
        targetWithHuna.maskPower.active = false;
      }

      const targets = [targetWithHuna];

      const chosen = chooseTarget(attacker, targets);

      expect(chosen.id).toBe('enemy_huna');
    });
  });

  describe('ATK_MULT - Rau (wave duration)', () => {
    test('multiplies attack damage by 1.5x when active', () => {
      const attacker = generateCombatantStats('kopaka', 'Toa_Kopaka', 1, Mask.Rau);

      const normalDamage = calculateAtkDmg(attacker, defender);

      if (attacker.maskPower) {
        attacker.maskPower.active = true;
      }

      const boostedDamage = calculateAtkDmg(attacker, defender);

      expect(boostedDamage).toBe(Math.floor(normalDamage * 1.5));
    });
  });

  describe('HEAL - Healing Masks', () => {
    describe('Kaukau - Mask of Water Breathing', () => {
      test('heals 20% of max HP when active', () => {
        const combatant = generateCombatantStats('gali', 'Toa_Gali', 1, Mask.Kaukau);

        // Damage the combatant first
        combatant.hp = 50; // Half health
        const maxHp = combatant.maxHp;

        // Activate mask power
        if (combatant.maskPower) {
          combatant.maskPower.active = true;
        }

        const healed = applyHealing(combatant);

        // Should heal 20% of max HP
        const expectedHeal = Math.floor(maxHp * 0.2);
        expect(healed.hp).toBe(50 + expectedHeal);
      });

      test('does not heal when inactive', () => {
        const combatant = generateCombatantStats('gali', 'Toa_Gali', 1, Mask.Kaukau);

        // Damage the combatant first
        combatant.hp = 50;

        // Ensure mask is inactive
        if (combatant.maskPower) {
          combatant.maskPower.active = false;
        }

        const healed = applyHealing(combatant);

        // Should not heal
        expect(healed.hp).toBe(50);
      });

      test('does not heal above max HP', () => {
        const combatant = generateCombatantStats('gali', 'Toa_Gali', 1, Mask.Kaukau);

        // Set HP to near max
        const maxHp = combatant.maxHp;
        combatant.hp = maxHp - 5; // 5 HP below max

        // Activate mask power
        if (combatant.maskPower) {
          combatant.maskPower.active = true;
        }

        const healed = applyHealing(combatant);

        // Should cap at max HP
        expect(healed.hp).toBe(maxHp);
      });
    });
  });

  describe('Mask Power Initialization', () => {
    test('mask powers start inactive', () => {
      const combatant = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      expect(combatant.maskPower?.active).toBeFalsy();
    });

    test('mask powers start with 0 cooldown', () => {
      const combatant = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      expect(combatant.maskPower?.effect.cooldown.amount).toBe(0);
    });

    test('willUseAbility starts false', () => {
      const combatant = generateCombatantStats('tahu', 'Toa_Tahu', 1, Mask.Hau);

      expect(combatant.willUseAbility).toBe(false);
    });
  });
});
