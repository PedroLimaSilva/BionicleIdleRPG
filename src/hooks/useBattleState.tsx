import { useEffect, useRef, useState } from 'react';
import { Combatant, EnemyEncounter } from '../types/Combat';
import { RecruitedCharacterData } from '../types/Matoran';
import { getLevelFromExp } from '../game/Levelling';
import { TEAM_POSITION_LABELS } from '../data/combat';
import {
  generateCombatantStats,
  queueCombatRound,
  decrementWaveCounters,
  hasReadyMaskPowers,
} from '../services/combatUtils';

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

export const useBattleState = (): BattleState => {
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
  teamRef.current = team;
  enemiesRef.current = enemies;

  useEffect(() => {
    const allTeamDefeated = team.length && team.every((t) => t.hp <= 0);
    if (allTeamDefeated) {
      console.log('Defeat!');
      setIsRunningRound(false);
      setPhase(BattlePhase.Defeat);
    }
  }, [team]);

  useEffect(() => {
    const allEnemiesDefeated =
      currentEncounter &&
      currentWave === currentEncounter.waves.length - 1 &&
      enemies.length &&
      enemies.every((e) => e.hp <= 0);
    if (allEnemiesDefeated) {
      console.log('Victory!');
      setIsRunningRound(false);
      setPhase(BattlePhase.Victory);
    }
  }, [currentEncounter, currentWave, enemies]);

  const startBattle = (encounter: EnemyEncounter) => {
    setCurrentEncounter(encounter);
    setTeam([]);
    setEnemies(
      encounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
      )
    );
    setPhase(BattlePhase.Preparing);
  };

  const toggleAbility = (toa: Combatant) => {
    if (toa.maskPower && toa.hp > 0 && toa.maskPower.effect.cooldown.amount === 0) {
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

    // Load new enemies for the next wave
    setEnemies(
      currentEncounter.waves[nextWave].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
      )
    );
  };

  const retreat = () => {
    if (phase === BattlePhase.Preparing) {
      setPhase(BattlePhase.Idle);
      setCurrentEncounter(undefined);
    } else {
      setPhase(BattlePhase.Retreated);
    }
  };

  const endBattle = () => {
    setPhase(BattlePhase.Idle);
    setCurrentEncounter(undefined);
    setCurrentWave(0);
    setTeam([]);
    setEnemies([]);
  };

  const confirmTeam = (team: RecruitedCharacterData[]) => {
    setTeam(
      team.map(({ id, exp, maskColorOverride, maskOverride }) =>
        generateCombatantStats(id, id, getLevelFromExp(exp), maskOverride, maskColorOverride)
      ) // add stats
    );
    setCurrentWave(0);
    setEnemies(
      currentEncounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
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

      if (!enemiesAlive || !teamAlive || hasReadyMaskPowers(latestTeam)) {
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
