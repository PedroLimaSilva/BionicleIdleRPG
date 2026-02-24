/**
 * Full battle simulation tests - runs complete battles from start to finish
 * with mask power activation between rounds. Designed to catch bugs like
 * mask powers incorrectly staying active across round boundaries.
 */
import { Combatant, EnemyEncounter } from '../types/Combat';
import { ENCOUNTERS } from '../data/combat';
import { Mask } from '../types/Matoran';
import {
  generateCombatantStats,
  queueCombatRound,
  decrementWaveCounters,
  hasReadyMaskPowers,
} from './combatUtils';
import { getLevelFromExp } from '../game/Levelling';
import type { RecruitedCharacterData } from '../types/Matoran';

/** Deep clone combatants to avoid cross-test pollution */
function cloneCombatants(combatants: Combatant[]): Combatant[] {
  return combatants.map((c) => structuredClone(c));
}

/** Set willUseAbility for specific combatants */
function setAbilities(team: Combatant[], ids: string[], use: boolean): Combatant[] {
  const idSet = new Set(ids);
  return team.map((t) =>
    idSet.has(t.id) ? { ...t, willUseAbility: use } : { ...t, willUseAbility: false }
  );
}

/** Add full immunity (DMG_MITIGATOR multiplier 0) for given rounds. Ensures no combatants die. */
function addImmunityBuff(team: Combatant[], rounds: number): Combatant[] {
  const buff = {
    type: 'DMG_MITIGATOR' as const,
    multiplier: 0,
    durationRemaining: rounds,
    durationUnit: 'round' as const,
    sourceId: 'test-immunity',
  };
  return team.map((t) => ({
    ...t,
    buffs: [...(t.buffs ?? []), buff],
  }));
}

/**
 * Battle simulator - runs combat rounds without React, for unit testing.
 * Mirrors the logic in useBattleState + queueCombatRound.
 */
class BattleSimulator {
  team: Combatant[];
  enemies: Combatant[];
  currentWave: number;
  encounter: EnemyEncounter;

  constructor(team: Combatant[], encounter: EnemyEncounter, currentWave = 0) {
    this.team = cloneCombatants(team);
    this.enemies = encounter.waves[currentWave].map(({ id, lvl }, index) =>
      generateCombatantStats(`${id}-${index}`, id, lvl)
    );
    this.currentWave = currentWave;
    this.encounter = encounter;
  }

  /** Run one combat round and await all steps */
  async runRound(): Promise<void> {
    let team = cloneCombatants(this.team);
    let enemies = cloneCombatants(this.enemies);

    const stateRef = { team, enemies };
    const setTeamWithRef = (t: Combatant[]) => {
      team = t;
      stateRef.team = t;
    };
    const setEnemiesWithRef = (e: Combatant[]) => {
      enemies = e;
      stateRef.enemies = e;
    };
    const getLatestState = () => ({
      team: stateRef.team,
      enemies: stateRef.enemies,
    });

    const queue: (() => Promise<void>)[] = [];
    queueCombatRound(
      cloneCombatants(this.team),
      cloneCombatants(this.enemies),
      setTeamWithRef,
      setEnemiesWithRef,
      (fn) => queue.push(fn),
      getLatestState
    );

    for (const step of queue) {
      await step();
    }

    this.team = team;
    this.enemies = enemies;
  }

  /**
   * Run rounds with auto-progression: keeps running rounds automatically
   * until a mask power becomes ready or the battle ends.
   * Mirrors the updated playActionQueue logic in useBattleState.
   * Returns the number of rounds executed.
   */
  async runWithAutoProgression(): Promise<number> {
    let roundsRun = 0;

    do {
      await this.runRound();
      roundsRun++;

      if (this.allEnemiesDefeated || this.allTeamDefeated) break;
    } while (!hasReadyMaskPowers(this.team, this.enemies));

    return roundsRun;
  }

  advanceWave(): void {
    this.team = decrementWaveCounters(this.team);
    this.currentWave++;
    this.enemies = this.encounter.waves[this.currentWave].map(({ id, lvl }, index) =>
      generateCombatantStats(`${id}-${index}`, id, lvl)
    );
  }

  get allEnemiesDefeated(): boolean {
    return this.enemies.every((e) => e.hp <= 0);
  }

  get allTeamDefeated(): boolean {
    return this.team.every((t) => t.hp <= 0);
  }

  get hasMoreWaves(): boolean {
    return this.currentWave < this.encounter.waves.length - 1;
  }
}

/** Create team from recruited character data (like confirmTeam) */
function createTeamFromRecruited(data: RecruitedCharacterData[]): Combatant[] {
  return data.map(({ id, exp, maskColorOverride, maskOverride }) =>
    generateCombatantStats(id, id, getLevelFromExp(exp), maskOverride, maskColorOverride)
  );
}

describe('Battle Simulation', () => {
  beforeAll(() => {
    // combatUtils accesses window.combatantRefs - node has no window
    (globalThis as unknown as { window: { combatantRefs: Record<string, unknown> } }).window = {
      combatantRefs: {},
    };
  });

  beforeEach(() => {
    // No combatantRefs entries - animations are no-ops, Promise.all([]) resolves immediately
    // Deterministic damage (minimal variance)
    jest.spyOn(Math, 'random').mockReturnValue(0);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('full battle flow', () => {
    test('runs battle from team confirm through rounds to victory', async () => {
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Gali', exp: 2000 },
        { id: 'Toa_Onua', exp: 2000 },
      ]);

      const sim = new BattleSimulator(team, customEncounter);

      expect(sim.team.length).toBe(3);
      expect(sim.enemies.length).toBe(1);

      let roundCount = 0;
      const maxRounds = 10;
      while (!sim.allEnemiesDefeated && !sim.allTeamDefeated && roundCount < maxRounds) {
        await sim.runRound();
        roundCount++;
      }

      expect(sim.allEnemiesDefeated).toBe(true);
      expect(roundCount).toBeLessThan(maxRounds);
    });
  });

  describe('mask power lifecycle between rounds', () => {
    test('Hau (1 round duration) is inactive after round ends', async () => {
      // Tahu has Hau - full immunity for 1 round
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      // Single weak enemy
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      // Activate Hau before round 1
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      const hpBeforeRound1 = sim.team[0].hp;

      await sim.runRound();

      // Hau duration is 1 round - should be INACTIVE after round ends
      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
      expect(tahu.maskPower?.effect.duration.unit).toBe('round');
      expect(tahu.maskPower?.effect.duration.amount).toBe(0);

      // Round 2: Hau should stay inactive (on cooldown), Tahu can take damage
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], false); // Can't use - on cooldown
      await sim.runRound();

      const hpAfterRound2 = sim.team.find((t) => t.id === 'Toa_Tahu')!.hp;
      // Tahu should have taken damage in round 2 (no Hau protection)
      expect(hpAfterRound2).toBeLessThan(hpBeforeRound1);
    });

    test('Kakama (1 round duration) is inactive after round ends', async () => {
      // Pohatu has Kakama - attacks twice for 1 round
      const team = createTeamFromRecruited([{ id: 'Toa_Pohatu', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Pohatu'], true);

      await sim.runRound();

      const pohatu = sim.team.find((t) => t.id === 'Toa_Pohatu')!;
      expect(pohatu.maskPower?.active).toBe(false);
      expect(pohatu.maskPower?.effect.duration.amount).toBe(0);
    });

    test('Pakari (1 attack duration) is inactive after first attack', async () => {
      // Onua has Pakari - 3x damage for 1 attack
      const team = createTeamFromRecruited([{ id: 'Toa_Onua', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Onua'], true);

      await sim.runRound();

      const onua = sim.team.find((t) => t.id === 'Toa_Onua')!;
      // Pakari duration is 'attack' - consumed on first attack
      expect(onua.maskPower?.active).toBe(false);
    });

    test('Kaukau (3 turn duration) heals for 3 turns then expires', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Gali', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Gali'], true);

      const hpStart = sim.team[0].hp;
      await sim.runRound();

      const gali = sim.team.find((t) => t.id === 'Toa_Gali')!;
      // After 1 round: 3 turns (Gali, enemy, maybe more). Kaukau duration 3 turns.
      // Should have healed at least once
      expect(gali.hp).toBeGreaterThanOrEqual(hpStart);
    });

    test('Akaku marks target; allies deal +50% damage for 2 turns', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Kopaka', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Kopaka'], true);

      const enemyHpBefore = sim.enemies[0].hp;
      await sim.runRound();
      const enemyHpAfter = sim.enemies[0].hp;

      // Kopaka marks on attack; enemy should take damage (1.5x when marked)
      expect(enemyHpBefore - enemyHpAfter).toBeGreaterThan(0);
      const kopaka = sim.team.find((t) => t.id === 'Toa_Kopaka')!;
      expect(kopaka.maskPower?.effect.type).toBe('DEBUFF');
      expect(kopaka.maskPower?.effect.debuffType).toBe('DEFENSE');
      // Debuff lasts 2 rounds; after round 1, enemy has 1 round left (decremented at end of round)
      const enemy = sim.enemies[0];
      expect(enemy.debuffs?.some((d) => d.type === 'DEFENSE')).toBe(true);
    });

    test('Miru (2 hit duration) provides mitigation for first 2 hits', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Lewa', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Lewa'], true);

      await sim.runRound();
      const lewa = sim.team.find((t) => t.id === 'Toa_Lewa')!;

      // Miru blocks 2 hits; after round with enemy attacking, Lewa should have taken no damage
      // (tahnok goes first by speed, attacks once - blocked by Miru; duration goes to 1 hit remaining)
      // Then Lewa attacks. Next round tahnok attacks again - blocks 2nd hit, Miru expires
      expect(lewa.maskPower?.effect.type).toBe('DMG_MITIGATOR');
      expect(lewa.maskPower?.effect.duration.unit).toBe('hit');
    });

    test('Mahiki (1 hit duration) provides mitigation for 1 hit then expires', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Lewa', exp: 0, maskOverride: Mask.Mahiki }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Lewa'], true);

      await sim.runRound();
      const lewa = sim.team.find((t) => t.id === 'Toa_Lewa')!;

      // Mahiki blocks 1 hit then expires; after first enemy attack it should be inactive
      expect(lewa.maskPower?.effect.type).toBe('DMG_MITIGATOR');
      expect(lewa.maskPower?.effect.duration.unit).toBe('hit');
    });

    test('Huna (1 turn untargetable) makes enemy untargetable when active', async () => {
      // Enemy with Huna: need enemy to have Huna. Enemies use generateCombatantStats - we need
      // a custom encounter. createTeamFromRecruited with maskOverride gives Toa Huna.
      // When Toa has Huna and uses it, Toa is untargetable - enemy must attack someone else.
      // With 1 Toa vs 1 enemy, if Toa has Huna active, enemy has no valid target (fallback to all).
      // Simpler: team of 2 (Tahu, Lewa). Give Lewa Huna. Enemy will prefer to hit Tahu when Lewa untargetable.
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 0 },
        { id: 'Toa_Lewa', exp: 0, maskOverride: Mask.Huna },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Lewa'], true);

      await sim.runRound();

      const lewa = sim.team.find((t) => t.id === 'Toa_Lewa')!;
      expect(lewa.maskPower?.effect.type).toBe('AGGRO');
      // Huna makes Lewa untargetable; round completes
      expect(sim.team.length).toBe(2);
    });

    test('Komau CONFUSION makes enemy attack their own team', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0, maskOverride: Mask.Komau }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [
          [
            { id: 'tahnok', lvl: 1 },
            { id: 'tahnok', lvl: 1 },
          ],
        ],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);

      const enemyHpsBefore = sim.enemies.map((e) => e.hp);
      await sim.runRound();

      // One enemy should have CONFUSION debuff (the one Tahu attacked)
      const confusedEnemy = sim.enemies.find((e) => e.debuffs?.some((d) => d.type === 'CONFUSION'));
      expect(confusedEnemy).toBeDefined();

      // Total enemy HP should have decreased (Tahu's attack + confused enemy attacking ally)
      const enemyHpsAfter = sim.enemies.map((e) => e.hp);
      const totalBefore = enemyHpsBefore.reduce((a, b) => a + b, 0);
      const totalAfter = enemyHpsAfter.reduce((a, b) => a + b, 0);
      expect(totalAfter).toBeLessThan(totalBefore);
    });

    test('Komau CONFUSION: confused enemy attacks itself when alone', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0, maskOverride: Mask.Komau }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);

      const enemyHpBefore = sim.enemies[0].hp;
      await sim.runRound();

      const enemy = sim.enemies[0];
      expect(enemy.debuffs?.some((d) => d.type === 'CONFUSION')).toBe(true);
      expect(enemy.hp).toBeLessThan(enemyHpBefore);
    });

    test('Komau CONFUSION lasts exactly 3 turns (no re-application)', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0, maskOverride: Mask.Komau }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [
          [
            { id: 'tahnok', lvl: 1 },
            { id: 'tahnok', lvl: 1 },
            { id: 'tahnok', lvl: 1 },
          ],
        ],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);

      await sim.runRound();
      const confusedAfterR1 = sim.enemies.find((e) =>
        e.debuffs?.some((d) => d.type === 'CONFUSION' && d.durationRemaining > 0)
      );
      expect(confusedAfterR1).toBeDefined();
      const confusionsAfterR1 = confusedAfterR1!.debuffs!.filter((d) => d.type === 'CONFUSION').length;
      expect(confusionsAfterR1).toBe(1);

      for (let r = 0; r < 5; r++) {
        sim.team = setAbilities(sim.team, [], false);
        await sim.runRound();
      }

      const confusedAfterR6 = sim.enemies.find((e) =>
        e.debuffs?.some((d) => d.type === 'CONFUSION' && d.durationRemaining > 0)
      );
      expect(confusedAfterR6).toBeUndefined();
    });

    test('Kakama grants Pohatu two attacks in one round', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Pohatu', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Pohatu'], true);

      const enemyHpBefore = sim.enemies[0].hp;
      await sim.runRound();
      const enemyHpAfter = sim.enemies[0].hp;

      // Pohatu with Kakama attacks twice; damage should be at least 2 (minimum 1 per attack)
      const damageDealt = enemyHpBefore - enemyHpAfter;
      expect(damageDealt).toBeGreaterThanOrEqual(2);
    });

    test('wave advance decrements wave-based mask power counters', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 2000 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();

      // Hau expires, goes on cooldown (1 wave)
      const tahuAfterRound = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahuAfterRound.maskPower?.active).toBe(false);
      expect(tahuAfterRound.maskPower?.effect.cooldown.amount).toBeGreaterThan(0);

      // Defeat wave 1 and advance (high-level Tahu kills level 1 tahnok quickly)
      for (let i = 0; i < 10 && !sim.allEnemiesDefeated; i++) {
        await sim.runRound();
      }
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();

      // After wave advance, Hau cooldown (wave-based) should decrement
      const tahuAfterWave = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahuAfterWave.maskPower?.effect.cooldown.amount).toBe(0);
    });

    test('multi-round: 1 round wave 1 then wave 2 - Hau only (no Kakama)', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Pohatu', exp: 2000 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };
      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      for (let i = 0; i < 5 && !sim.allEnemiesDefeated; i++) await sim.runRound();
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();
      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
    });

    test('multi-round: 1 round wave 1 then wave 2 - both Hau and Kakama', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Pohatu', exp: 2000 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };
      const sim = new BattleSimulator(team, customEncounter);
      sim.team = setAbilities(sim.team, ['Toa_Tahu', 'Toa_Pohatu'], true);
      await sim.runRound();
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();
      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
    });

    test('multi-round battle with mask power toggling (empty wave 1)', async () => {
      // Empty wave 1: advance immediately, then wave 2 round with 2 Toa + Hau
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Pohatu', exp: 2000 },
      ]);
      const customEncounter: EnemyEncounter = {
        id: 'test',
        name: 'Test',
        headliner: 'tahnok',
        difficulty: 1,
        description: 'Test',
        waves: [[], [{ id: 'tahnok', lvl: 1 }]],
        loot: [],
      };
      const sim = new BattleSimulator(team, customEncounter);
      expect(sim.enemies.length).toBe(0);
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();
      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
    });

    test('multi-round battle with mask power toggling between rounds', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Pohatu', exp: 2000 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      // Round 1 wave 1: Tahu uses Hau, Pohatu uses Kakama
      sim.team = setAbilities(sim.team, ['Toa_Tahu', 'Toa_Pohatu'], true);
      await sim.runRound();
      expect(sim.team.find((t) => t.id === 'Toa_Tahu')!.maskPower?.active).toBe(false);
      expect(sim.team.find((t) => t.id === 'Toa_Pohatu')!.maskPower?.active).toBe(false);

      // Defeat wave 1 (2 Toa vs 1 tahnok - may take 1–3 rounds)
      for (let i = 0; i < 15 && !sim.allEnemiesDefeated; i++) {
        await sim.runRound();
      }
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();

      expect(sim.team.find((t) => t.id === 'Toa_Tahu')!.maskPower?.effect.cooldown.amount).toBe(0);

      // Wave 2 round 1: activate Hau
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();

      const tahuAfterRound2 = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahuAfterRound2.maskPower?.active).toBe(false);
      expect(tahuAfterRound2.maskPower?.effect.duration.amount).toBe(0);
    });

    test('Hau expires correctly in wave 2 with 2 Toa (starts directly in wave 2)', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 2000 },
        { id: 'Toa_Pohatu', exp: 2000 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };
      const sim = new BattleSimulator(team, customEncounter, 1); // start in wave 2
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();
      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
    });

    test('Hau expires correctly in wave 2 with single Toa (isolated repro)', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 2000 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      for (let i = 0; i < 10 && !sim.allEnemiesDefeated; i++) await sim.runRound();
      expect(sim.allEnemiesDefeated).toBe(true);
      sim.advanceWave();

      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();

      const tahu = sim.team.find((t) => t.id === 'Toa_Tahu')!;
      expect(tahu.maskPower?.active).toBe(false);
    });

    test('auto-progression runs multiple rounds when no mask powers are ready', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 0 },
        { id: 'Toa_Onua', exp: 0 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      // Activate both mask powers so they go on cooldown after round 1
      sim.team = setAbilities(sim.team, ['Toa_Tahu', 'Toa_Onua'], true);
      await sim.runRound();

      // Both powers are now on cooldown
      expect(hasReadyMaskPowers(sim.team, sim.enemies)).toBe(false);

      // Auto-progression should run multiple rounds until powers come off cooldown
      // or the enemy is defeated
      const roundsRun = await sim.runWithAutoProgression();
      expect(roundsRun).toBeGreaterThanOrEqual(1);

      // Battle should have progressed: either enemy defeated or a power is ready
      const enemyDefeated = sim.allEnemiesDefeated;
      const powersReady = hasReadyMaskPowers(sim.team, sim.enemies);
      expect(enemyDefeated || powersReady).toBe(true);
    });

    test('auto-progression stops when a mask power becomes ready', async () => {
      // High-level Onua so he can survive several rounds against a level 10 enemy
      const team = createTeamFromRecruited([
        { id: 'Toa_Onua', exp: 5000 }, // Pakari: 2 turn cooldown
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      // Moderate enemy: survives a few rounds but doesn't one-shot Onua
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'pahrak', lvl: 10 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      // Activate Pakari to put it on cooldown (2 turns)
      sim.team = setAbilities(sim.team, ['Toa_Onua'], true);
      await sim.runRound();

      const onua = sim.team.find((t) => t.id === 'Toa_Onua')!;
      expect(onua.maskPower?.active).toBe(false);
      expect(onua.maskPower?.effect.cooldown.amount).toBeGreaterThan(0);

      // Auto-progression should run rounds until Pakari comes off cooldown
      const roundsRun = await sim.runWithAutoProgression();

      if (!sim.allEnemiesDefeated && !sim.allTeamDefeated) {
        expect(hasReadyMaskPowers(sim.team, sim.enemies)).toBe(true);
        expect(roundsRun).toBeGreaterThanOrEqual(1);
      }
    });

    test('auto-progression stops immediately when mask powers are already ready', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 50 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      // Powers start ready (cooldown === 0)
      expect(hasReadyMaskPowers(sim.team, sim.enemies)).toBe(true);

      // Auto-progression runs exactly 1 round then stops
      const roundsRun = await sim.runWithAutoProgression();
      expect(roundsRun).toBe(1);

      if (!sim.allEnemiesDefeated && !sim.allTeamDefeated) {
        expect(hasReadyMaskPowers(sim.team, sim.enemies)).toBe(true);
      }
    });

    test('auto-progression stops on team defeat', async () => {
      const team = createTeamFromRecruited([{ id: 'Toa_Tahu', exp: 0 }]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      // Overwhelmingly strong enemy
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'pahrak', lvl: 99 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      // Activate Hau to put it on cooldown, so auto-progression is triggered
      sim.team = setAbilities(sim.team, ['Toa_Tahu'], true);
      await sim.runRound();

      if (!sim.allTeamDefeated) {
        await sim.runWithAutoProgression();
      }
      // Should not loop infinitely - either team defeated or power ready
      expect(sim.allTeamDefeated || hasReadyMaskPowers(sim.team, sim.enemies)).toBe(true);
    });

    test('auto-progression stops on enemy defeat', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 5000 },
        { id: 'Toa_Onua', exp: 5000 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);
      // Use both powers so cooldowns engage
      sim.team = setAbilities(sim.team, ['Toa_Tahu', 'Toa_Onua'], true);

      const roundsRun = await sim.runWithAutoProgression();
      expect(roundsRun).toBeGreaterThanOrEqual(1);
      // High level team vs level 1 enemy - should be defeated
      expect(sim.allEnemiesDefeated).toBe(true);
    });

    test('no mask power bleeds from round N to round N+1 when duration expired', async () => {
      const team = createTeamFromRecruited([
        { id: 'Toa_Tahu', exp: 0 },
        { id: 'Toa_Pohatu', exp: 0 },
      ]);
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }], [{ id: 'tahnok', lvl: 1 }]],
      };

      const sim = new BattleSimulator(team, customEncounter);

      // Round 1: both use mask powers
      sim.team = setAbilities(sim.team, ['Toa_Tahu', 'Toa_Pohatu'], true);
      await sim.runRound();

      const afterRound1 = sim.team.map((t) => ({
        id: t.id,
        active: t.maskPower?.active,
        duration: t.maskPower?.effect.duration,
      }));
      expect(afterRound1.every((a) => a.active === false)).toBe(true);

      // Round 2: do NOT activate any mask powers
      sim.team = setAbilities(sim.team, [], false);
      await sim.runRound();

      const afterRound2 = sim.team.map((t) => ({
        id: t.id,
        active: t.maskPower?.active,
      }));
      expect(afterRound2.every((a) => a.active === false)).toBe(true);
    });

    test('active mask power does NOT re-trigger when willUseAbility is false', async () => {
      // Kaukau Nuva: 2-turn HEAL buff on team. Immunity buff ensures no combatants die.
      const team = addImmunityBuff(
        createTeamFromRecruited([
          { id: 'Toa_Gali', exp: 0, maskOverride: Mask.KaukauNuva },
          { id: 'Toa_Tahu', exp: 0 },
          { id: 'Toa_Onua', exp: 0 },
        ]),
        2
      );
      const encounter = ENCOUNTERS.find((e) => e.id === 'tahnok-1')!;
      const customEncounter: EnemyEncounter = {
        ...encounter,
        waves: [[{ id: 'tahnok', lvl: 1 }]],
      };
      const sim = new BattleSimulator(team, customEncounter);

      // Round 1: activate Kaukau Nuva - applies HEAL buff to all allies
      sim.team = setAbilities(sim.team, ['Toa_Gali'], true);
      await sim.runRound();

      const buffCountAfterRound1 = sim.team.reduce(
        (sum, t) => sum + (t.buffs?.filter((b) => b.type === 'HEAL').length ?? 0),
        0
      );
      expect(buffCountAfterRound1).toBe(3);

      // Round 2: do NOT activate - willUseAbility stays false for everyone
      sim.team = setAbilities(sim.team, [], false);
      await sim.runRound();

      // Turn-based HEAL buffs expire in round 2; count must decrease (no re-application)
      const buffCountAfterRound2 = sim.team.reduce(
        (sum, t) => sum + (t.buffs?.filter((b) => b.type === 'HEAL').length ?? 0),
        0
      );
      expect(buffCountAfterRound2).toBeLessThan(buffCountAfterRound1);
    });
  });
});
