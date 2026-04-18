import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Combatant, EnemyEncounter } from '../types/Combat';
import { RecruitedCharacterData } from '../types/Matoran';
import { getLevelFromExp } from '../game/Levelling';
import {
  generateCombatantStats,
  getScaledEnemyLevelForEncounter,
  queueCombatRound,
  decrementWaveCounters,
  hasReadyMaskPowers,
} from '../services/combatUtils';
import { getBattleOutcomePhaseDelayMs } from '../game/battleOutcomeVisualDelay';

export const enum BattlePhase {
  Idle = 'idle',
  Preparing = 'preparing',
  Inprogress = 'in-progress',
  Victory = 'victory',
  Defeat = 'defeat',
  Retreated = 'retreated',
}

export interface BattleState {
  phase: BattlePhase;
  currentEncounter: EnemyEncounter | undefined;
  currentWave: number;
  enemies: Combatant[];
  team: Combatant[];
  startBattle: (encounter: EnemyEncounter) => void;
  confirmTeam: (team: RecruitedCharacterData[]) => void;
  advanceWave: () => void;
  toggleAbility: (toa: Combatant) => void;
  retreat: () => void;
  runRound: () => void;
  playActionQueue: () => Promise<void>;
  actionQueue: (() => void)[];
  isRunningRound: boolean;
  endBattle: () => void;
}

export const INITIAL_BATTLE_STATE: BattleState = {
  phase: BattlePhase.Idle,
  currentWave: 0,
  currentEncounter: undefined,
  enemies: [],
  team: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startBattle: function (_encounter: EnemyEncounter): void {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmTeam: function (_team: RecruitedCharacterData[]): void {
    throw new Error('Function not implemented.');
  },
  advanceWave: function (): void {
    throw new Error('Function not implemented.');
  },
  retreat: function (): void {
    throw new Error('Function not implemented.');
  },
  runRound: function (): void {
    throw new Error('Function not implemented.');
  },
  playActionQueue: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleAbility: function (_toa: Combatant): boolean {
    throw new Error('Function not implemented.');
  },
  actionQueue: [],
  isRunningRound: false,
  endBattle: function (): void {
    throw new Error('Function not implemented.');
  },
};

const TOA_NUVA_IDS = [
  'Toa_Tahu_Nuva',
  'Toa_Gali_Nuva',
  'Toa_Pohatu_Nuva',
  'Toa_Onua_Nuva',
  'Toa_Kopaka_Nuva',
  'Toa_Lewa_Nuva',
] as const;

export const useBattleState = (nuvaSymbolsSequestered = false): BattleState => {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<BattlePhase>(INITIAL_BATTLE_STATE.phase);
  const [currentEncounter, setCurrentEncounter] = useState<EnemyEncounter | undefined>(
    INITIAL_BATTLE_STATE.currentEncounter
  );
  const [currentWave, setCurrentWave] = useState(INITIAL_BATTLE_STATE.currentWave);
  const [enemies, setEnemies] = useState<Combatant[]>(INITIAL_BATTLE_STATE.enemies);
  const [team, setTeam] = useState<Combatant[]>(INITIAL_BATTLE_STATE.team);
  const [actionQueue, setActionQueue] = useState<(() => void)[]>([]);
  const [isRunningRound, setIsRunningRound] = useState(false);
  const teamRef = useRef(team);
  const enemiesRef = useRef(enemies);
  /** Average party level when the current encounter uses `scalesWithParty`. */
  const partyAvgLevelRef = useRef<number | null>(null);
  /** Cleared on retreat/endBattle/startBattle; avoids overlapping delayed outcome phases. */
  const pendingOutcomePhaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingOutcomePhase = () => {
    if (pendingOutcomePhaseTimerRef.current !== null) {
      clearTimeout(pendingOutcomePhaseTimerRef.current);
      pendingOutcomePhaseTimerRef.current = null;
    }
  };

  teamRef.current = team;
  enemiesRef.current = enemies;

  useEffect(() => {
    if (phase !== BattlePhase.Inprogress) return;

    const allTeamDefeated = team.length > 0 && team.every((t) => t.hp <= 0);
    const allEnemiesDefeated =
      !!currentEncounter &&
      currentWave === currentEncounter.waves.length - 1 &&
      enemies.length > 0 &&
      enemies.every((e) => e.hp <= 0);

    // Team wipe takes precedence (same ordering as separate effects would race).
    if (allTeamDefeated) {
      console.log('Defeat!');
      setIsRunningRound(false);
      const delayMs = getBattleOutcomePhaseDelayMs(reduceMotion);
      if (delayMs === 0) {
        setPhase(BattlePhase.Defeat);
        return;
      }
      pendingOutcomePhaseTimerRef.current = setTimeout(() => {
        pendingOutcomePhaseTimerRef.current = null;
        setPhase(BattlePhase.Defeat);
      }, delayMs);
      return clearPendingOutcomePhase;
    }

    if (allEnemiesDefeated) {
      console.log('Victory!');
      setIsRunningRound(false);
      const delayMs = getBattleOutcomePhaseDelayMs(reduceMotion);
      if (delayMs === 0) {
        setPhase(BattlePhase.Victory);
        return;
      }
      pendingOutcomePhaseTimerRef.current = setTimeout(() => {
        pendingOutcomePhaseTimerRef.current = null;
        setPhase(BattlePhase.Victory);
      }, delayMs);
      return clearPendingOutcomePhase;
    }
  }, [currentEncounter, currentWave, enemies, team, phase, reduceMotion]);

  const startBattle = (encounter: EnemyEncounter) => {
    clearPendingOutcomePhase();
    setCurrentEncounter(encounter);
    setTeam([]);
    setEnemies(
      encounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id}-${index}`, id, lvl)
      )
    );
    setPhase(BattlePhase.Preparing);
  };

  const toggleAbility = (toa: Combatant) => {
    if (toa.maskPower && toa.hp > 0 && toa.maskPower.cooldown.amount === 0) {
      toa.willUseAbility = !toa.willUseAbility;
      const updatedTeam = team.map((t) => (t.id === toa.id ? toa : t));
      setTeam(updatedTeam);
    }
  };

  const advanceWave = () => {
    if (!currentEncounter) return;
    const nextWave = currentWave + 1;
    setCurrentWave(nextWave);

    // Decrement wave-based mask power counters for the team
    const updatedTeam = decrementWaveCounters(team);
    setTeam(updatedTeam);

    const avg = partyAvgLevelRef.current;
    const wave = currentEncounter.waves[nextWave];
    setEnemies(
      wave.map(({ id, lvl }, index) =>
        generateCombatantStats(
          `${id}-${index}`,
          id,
          avg !== null ? getScaledEnemyLevelForEncounter(currentEncounter, wave, lvl, avg) : lvl
        )
      )
    );
  };

  const retreat = () => {
    clearPendingOutcomePhase();
    if (phase === BattlePhase.Preparing) {
      setPhase(BattlePhase.Idle);
      setCurrentEncounter(undefined);
      partyAvgLevelRef.current = null;
    } else {
      setPhase(BattlePhase.Retreated);
    }
  };

  const endBattle = () => {
    clearPendingOutcomePhase();
    setPhase(BattlePhase.Idle);
    setCurrentEncounter(undefined);
    setCurrentWave(0);
    setTeam([]);
    setEnemies([]);
    partyAvgLevelRef.current = null;
  };

  const confirmTeam = (team: RecruitedCharacterData[]) => {
    const partyLevels = team.map(({ exp }) => getLevelFromExp(exp));
    const avgPartyLevel = Math.round(
      partyLevels.reduce((sum, l) => sum + l, 0) / partyLevels.length
    );

    setTeam(
      team.map(({ id, exp, maskOverride }) =>
        generateCombatantStats(id, id, getLevelFromExp(exp), {
          maskOverride,
          nuvaSymbolsSequestered:
            nuvaSymbolsSequestered && TOA_NUVA_IDS.includes(id as (typeof TOA_NUVA_IDS)[number]),
        })
      )
    );
    setCurrentWave(0);

    partyAvgLevelRef.current = currentEncounter!.scalesWithParty ? avgPartyLevel : null;

    setEnemies(
      currentEncounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(
          `${id}-${index}`,
          id,
          getScaledEnemyLevelForEncounter(
            currentEncounter!,
            currentEncounter!.waves[0],
            lvl,
            avgPartyLevel
          )
        )
      )
    );
    setPhase(BattlePhase.Inprogress);
  };

  const runRound = () => {
    const queue: (() => void)[] = [];
    const setTeamWithRef = (t: Combatant[]) => {
      teamRef.current = t;
      setTeam(t);
    };
    const setEnemiesWithRef = (e: Combatant[]) => {
      enemiesRef.current = e;
      setEnemies(e);
    };
    const getLatestState = () => ({
      team: teamRef.current,
      enemies: enemiesRef.current,
    });
    queueCombatRound(
      team,
      enemies,
      setTeamWithRef,
      setEnemiesWithRef,
      (fn) => queue.push(fn),
      getLatestState
    );
    setActionQueue(queue);
  };

  const playActionQueue = async () => {
    setIsRunningRound(true);

    let queue = [...actionQueue];

    while (queue.length > 0) {
      for (const step of queue) {
        await step();
      }

      const latestTeam = teamRef.current;
      const latestEnemies = enemiesRef.current;
      const enemiesAlive = latestEnemies.some((e) => e.hp > 0);
      const teamAlive = latestTeam.some((t) => t.hp > 0);

      if (!enemiesAlive || !teamAlive || hasReadyMaskPowers(latestTeam, latestEnemies)) {
        break;
      }

      queue = [];
      queueCombatRound(
        latestTeam,
        latestEnemies,
        (t: Combatant[]) => {
          teamRef.current = t;
          setTeam(t);
        },
        (e: Combatant[]) => {
          enemiesRef.current = e;
          setEnemies(e);
        },
        (fn) => queue.push(fn),
        () => ({ team: teamRef.current, enemies: enemiesRef.current })
      );
    }

    setActionQueue([]);
    setIsRunningRound(false);
  };

  return {
    phase,
    currentEncounter,
    currentWave,
    enemies,
    team,
    confirmTeam,
    startBattle,
    toggleAbility: toggleAbility,
    advanceWave,
    retreat,
    runRound,
    playActionQueue,
    isRunningRound,
    actionQueue,
    endBattle,
  };
};
