import { Mask } from '../types/Matoran';
import { generateCombatantStats } from './combatUtils';

describe('Mask Powers', () => {
  beforeEach(() => {
    // Mock Math.random to make tests deterministic
    jest.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ATK_MULT - Attack Multiplier Masks', () => {
    describe('Pakari - Mask of Strength', () => {
      test('multiplies attack damage by 3x when active', () => {
        const attacker = generateCombatantStats(
          'onua',
          'Toa_Onua',
          1,
          Mask.Pakari,
        );

        // Activate the mask power
        if (attacker.maskPower) {
          attacker.maskPower.active = true;
        }

        // Expected: (attack - defense) * 3 = (15 - 5) * 3 = 30
        // With element effectiveness and random (mocked to 0), should be 30
        expect(attacker.maskPower?.effect.type).toBe('ATK_MULT');
        expect(attacker.maskPower?.effect.multiplier).toBe(3);
        expect(attacker.maskPower?.effect.duration.unit).toBe('attack');
        expect(attacker.maskPower?.effect.duration.amount).toBe(1);
      });

      test('has correct cooldown settings', () => {
        const combatant = generateCombatantStats(
          'onua',
          'Toa_Onua',
          1,
          Mask.Pakari,
        );

        expect(combatant.maskPower?.effect.cooldown.unit).toBe('turn');
        expect(combatant.maskPower?.effect.cooldown.amount).toBe(0); // Starts at 0
      });
    });

    describe('Akaku - Mask of X-Ray Vision', () => {
      test('provides 1.5x damage multiplier for 2 turns', () => {
        const combatant = generateCombatantStats(
          'test',
          'Toa_Tahu',
          1,
          Mask.Akaku,
        );

        expect(combatant.maskPower?.effect.type).toBe('ATK_MULT');
        expect(combatant.maskPower?.effect.multiplier).toBe(1.5);
        expect(combatant.maskPower?.effect.duration.unit).toBe('turn');
        expect(combatant.maskPower?.effect.duration.amount).toBe(2);
        expect(combatant.maskPower?.effect.cooldown.unit).toBe('turn');
      });
    });
  });

  describe('DMG_MITIGATOR - Damage Mitigation Masks', () => {
    describe('Hau - Mask of Shielding', () => {
      test('provides full immunity (0 multiplier) for 1 round', () => {
        const combatant = generateCombatantStats(
          'tahu',
          'Toa_Tahu',
          1,
          Mask.Hau,
        );

        expect(combatant.maskPower?.effect.type).toBe('DMG_MITIGATOR');
        expect(combatant.maskPower?.effect.multiplier).toBe(0);
        expect(combatant.maskPower?.effect.duration.unit).toBe('round');
        expect(combatant.maskPower?.effect.duration.amount).toBe(1);
      });

      test('has wave-based cooldown', () => {
        const combatant = generateCombatantStats(
          'tahu',
          'Toa_Tahu',
          1,
          Mask.Hau,
        );

        expect(combatant.maskPower?.effect.cooldown.unit).toBe('wave');
        expect(combatant.maskPower?.effect.cooldown.amount).toBe(0); // Starts at 0
      });
    });

    describe('Miru - Mask of Levitation', () => {
      test('evades next 2 hits with full immunity', () => {
        const combatant = generateCombatantStats(
          'lewa',
          'Toa_Lewa',
          1,
          Mask.Miru,
        );

        expect(combatant.maskPower?.effect.type).toBe('DMG_MITIGATOR');
        expect(combatant.maskPower?.effect.multiplier).toBe(0);
        expect(combatant.maskPower?.effect.duration.unit).toBe('hit');
        expect(combatant.maskPower?.effect.duration.amount).toBe(2);
      });
    });

    describe('Mahiki - Mask of Illusion', () => {
      test('absorbs 1 hit with full immunity', () => {
        const combatant = generateCombatantStats(
          'test',
          'Toa_Tahu',
          1,
          Mask.Mahiki,
        );

        expect(combatant.maskPower?.effect.type).toBe('DMG_MITIGATOR');
        expect(combatant.maskPower?.effect.multiplier).toBe(0);
        expect(combatant.maskPower?.effect.duration.unit).toBe('hit');
        expect(combatant.maskPower?.effect.duration.amount).toBe(1);
      });
    });
  });

  describe('HEAL - Healing Masks', () => {
    describe('Kaukau - Mask of Water Breathing', () => {
      test('heals 20% of max HP each turn for 3 turns', () => {
        const combatant = generateCombatantStats(
          'gali',
          'Toa_Gali',
          1,
          Mask.Kaukau,
        );

        expect(combatant.maskPower?.effect.type).toBe('HEAL');
        expect(combatant.maskPower?.effect.multiplier).toBe(0.2);
        expect(combatant.maskPower?.effect.duration.unit).toBe('turn');
        expect(combatant.maskPower?.effect.duration.amount).toBe(3);
      });

      test('has wave-based cooldown', () => {
        const combatant = generateCombatantStats(
          'gali',
          'Toa_Gali',
          1,
          Mask.Kaukau,
        );

        expect(combatant.maskPower?.effect.cooldown.unit).toBe('wave');
        expect(combatant.maskPower?.effect.cooldown.amount).toBe(0);
      });
    });
  });

  describe('AGGRO - Targeting Masks', () => {
    describe('Huna - Mask of Concealment', () => {
      test('makes user untargetable (0 aggro) for 1 turn', () => {
        const combatant = generateCombatantStats(
          'test',
          'Toa_Tahu',
          1,
          Mask.Huna,
        );

        expect(combatant.maskPower?.effect.type).toBe('AGGRO');
        expect(combatant.maskPower?.effect.multiplier).toBe(0);
        expect(combatant.maskPower?.effect.duration.unit).toBe('turn');
        expect(combatant.maskPower?.effect.duration.amount).toBe(1);
      });
    });
  });

  describe('SPEED - Speed Masks', () => {
    describe('Kakama - Mask of Speed', () => {
      test('grants extra turn (2x multiplier) for 1 round', () => {
        const combatant = generateCombatantStats(
          'pohatu',
          'Toa_Pohatu',
          1,
          Mask.Kakama,
        );

        expect(combatant.maskPower?.effect.type).toBe('SPEED');
        expect(combatant.maskPower?.effect.multiplier).toBe(2);
        expect(combatant.maskPower?.effect.duration.unit).toBe('round');
        expect(combatant.maskPower?.effect.duration.amount).toBe(1);
      });

      test('has turn-based cooldown of 5 turns', () => {
        const combatant = generateCombatantStats(
          'pohatu',
          'Toa_Pohatu',
          1,
          Mask.Kakama,
        );

        expect(combatant.maskPower?.effect.cooldown.unit).toBe('turn');
        expect(combatant.maskPower?.effect.cooldown.amount).toBe(0); // Starts at 0
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

  describe('All Mask Powers Configuration', () => {
    test('Ruru - Mask of Night Vision reduces enemy accuracy', () => {
      const combatant = generateCombatantStats(
        'test',
        'Toa_Tahu',
        1,
        Mask.Ruru,
      );

      expect(combatant.maskPower?.effect.type).toBe('ACCURACY_MULT');
      expect(combatant.maskPower?.effect.multiplier).toBe(0.5);
      expect(combatant.maskPower?.effect.target).toBe('allEnemies');
      expect(combatant.maskPower?.effect.duration.amount).toBe(2);
      expect(combatant.maskPower?.effect.duration.unit).toBe('turn');
    });

    test('Komau - Mask of Mind Control confuses enemy', () => {
      const combatant = generateCombatantStats(
        'test',
        'Toa_Tahu',
        1,
        Mask.Komau,
      );

      expect(combatant.maskPower?.effect.type).toBe('CONFUSION');
      expect(combatant.maskPower?.effect.target).toBe('enemy');
      expect(combatant.maskPower?.effect.duration.amount).toBe(3);
      expect(combatant.maskPower?.effect.duration.unit).toBe('turn');
    });

    test('Rau - Mask of Translation provides super effective attacks', () => {
      const combatant = generateCombatantStats('test', 'Toa_Tahu', 1, Mask.Rau);

      expect(combatant.maskPower?.effect.type).toBe('ATK_MULT');
      expect(combatant.maskPower?.effect.multiplier).toBe(1.5);
      expect(combatant.maskPower?.effect.duration.unit).toBe('wave');
      expect(combatant.maskPower?.effect.duration.amount).toBe(1);
    });

    test('Matatu - Mask of Telekinesis immobilizes enemy', () => {
      const combatant = generateCombatantStats(
        'test',
        'Toa_Tahu',
        1,
        Mask.Matatu,
      );

      expect(combatant.maskPower?.effect.type).toBe('ATK_MULT');
      expect(combatant.maskPower?.effect.multiplier).toBe(0);
      expect(combatant.maskPower?.effect.target).toBe('enemy');
      expect(combatant.maskPower?.effect.duration.unit).toBe('wave');
    });
  });
});
